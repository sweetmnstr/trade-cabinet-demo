import { Injectable } from '@nestjs/common';
import { RpcException } from '../../exception';
import { RpcExceptionChain, RpcExceptionChainObject } from '../../exception-chain';
import { safeParse } from '../../helpers';
import { RpcCode } from '../../rpc-code';
import { RpcResponse } from '../../interfaces/rpc-response';
import { RpcRedisOptions, RpcRequest } from '../../interfaces';
import { getRedisPubSub, RedisPubSub } from './redis-lib';

@Injectable()
export class RedisClient {
    constructor(private readonly prefix: string, private readonly config: RpcRedisOptions) {}
    private pubSub!: RedisPubSub;
    private replies: Record<string, (data: RpcResponse | RpcExceptionChainObject) => void> = {};

    private bindSubEvents() {
        this.pubSub.sub.on('message', (channel: string, message: string) => {
            const handler = this.replies[channel];
            if (handler) {
                const resData: RpcResponse | RpcExceptionChainObject = safeParse(message);

                if (!resData) {
                    const err = new RpcExceptionChain([
                        new RpcException(RpcCode.DATA_LOSS, 'Invalid JSON', message, channel),
                    ]);

                    return handler(err);
                }

                return handler(resData);
            }
        });
    }

    private async serializeData(_method: string, data?: RpcRequest, reply?: string): Promise<string> {
        if (!this.pubSub) {
            this.pubSub = getRedisPubSub(this.config);
            this.bindSubEvents();
        }
        const sendData = { data, _method, reply };

        return JSON.stringify(sendData);
    }

    //private throwException(err: Error) {}

    async request(path: string, data?: object & { _method?: string }): Promise<object> {
        const prefixedPath = `${this.prefix}.${path}`;
        const replyPath = `_INBOX.${prefixedPath}.${Date.now()}`;
        const sendData = await this.serializeData(prefixedPath, data, replyPath);
        this.pubSub.sub.subscribe(replyPath);

        const cb = new Promise((resolve: (value: RpcResponse | RpcExceptionChainObject) => void) => {
            this.replies[replyPath] = resolve;
        });

        await this.pubSub.pub.publish(prefixedPath, sendData);

        const res = await cb;
        this.pubSub.sub.unsubscribe(replyPath);
        delete this.replies[replyPath];

        if (this.isRpcExceptionChain(res)) {
            const error = new RpcExceptionChain(res.messages, res.timestamp);

            throw error;
        }

        return res.data;
    }

    async publish(path: string, data?: object & { _method?: string }): Promise<void> {
        const prefixedPath = `${this.prefix}.${path}`;
        const sendData = await this.serializeData(prefixedPath, data);

        await this.pubSub.pub.publish(path, sendData);
    }

    isRpcExceptionChain(obj: RpcResponse | RpcExceptionChainObject): obj is RpcExceptionChainObject {
        return typeof obj.status !== 'string' || obj.status.toUpperCase() !== 'OK';
    }
}
