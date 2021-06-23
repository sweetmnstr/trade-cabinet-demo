import { RedisContext } from '@nestjs/microservices';
import { CONNECT_EVENT, ERROR_EVENT, NO_MESSAGE_HANDLER } from '@nestjs/microservices/constants';
import { CustomTransportStrategy } from '@nestjs/microservices/interfaces';
import { Server } from '@nestjs/microservices/server';
import * as Redis from 'ioredis';
import { Observable } from 'rxjs';
import { RpcException } from '../../exception';
import { RpcExceptionChain } from '../../exception-chain';
import { RpcCode } from '../../rpc-code';
import { RpcResponse } from '../../interfaces/rpc-response';
import { RpcRedisOptions } from '../../interfaces/rpc-common';
import { RedisPubSub, getRedisPubSub } from './redis-lib';
import { RpcRequest } from '../../interfaces';

// TODO: Add replyTo property to objects
export class RedisServerStrategy extends Server implements CustomTransportStrategy {
    private pubSub!: RedisPubSub;

    private options: RpcRedisOptions;

    constructor(private prefix: string, options?: RpcRedisOptions) {
        super();
        this.options = options || { url: 'localhost' };
    }

    public async listen(callback: () => void) {
        this.pubSub = getRedisPubSub(this.options);

        for (const type in this.pubSub) {
            this.handleError(this.pubSub[type as keyof RedisPubSub]);
        }

        this.start(callback);
    }

    public start(callback: () => void) {
        this.bindEvents();
        // Only one redis instance
        this.pubSub.pub.on(CONNECT_EVENT, callback);
    }

    public bindEvents() {
        this.pubSub.sub.psubscribe(`${this.prefix}.*.*`);

        this.pubSub.sub.on('pmessage', this.getMessageHandler());
        /*const queue = this.options.queue;
        const subscribe = (channel: string) => 
            this.natsClient.subscribe(channel, this.getMessageHandler(channel), { queue });

        const registeredPatterns = [...this.messageHandlers.keys()];d
        registeredPatterns.forEach(subscribe); */
    }

    public close() {
        for (const type in this.pubSub) {
            this.pubSub[type as keyof RedisPubSub] && this.pubSub[type as keyof RedisPubSub].disconnect();
        }
    }

    public async createClient(): Promise<Redis.Redis> {
        const client = new Redis();

        return client;
    }

    public getMessageHandler(): (wildChannel: string, channel: string, message: string) => void | Promise<void> {
        return async (_wildChannel, channel, message) => {
            const msg = this.parsePayload(message);
            if (!msg) {
                this.logger.warn(`Invalid payload ${channel}: ${JSON.stringify(msg, null, 4)}`);
                return;
            }

            const ctx = new RedisContext([channel]);

            const handler = this.getHandlerByPattern(channel);
            const publish = msg.reply ? this.getPublisher(msg.reply) : undefined;

            if (!handler) {
                if (publish) {
                    const err = new RpcException(RpcCode.UNIMPLEMENTED, NO_MESSAGE_HANDLER, undefined, channel);
                    publish(new RpcExceptionChain([err]));
                }

                return;
            }

            const promise = handler(msg.data, ctx)
                .then((data) => {
                    if (data instanceof Observable) return data.toPromise();

                    return { status: 'OK', data, timestamp: Date.now() };
                })
                .catch((err) => {
                    if (err instanceof RpcExceptionChain) {
                        err.messages.push(new RpcException(RpcCode.ABORTED, undefined, undefined, channel));

                        return err;
                    }

                    if (!(err instanceof RpcException)) {
                        // TODO: decide how it will be logger, as some errors have extended params
                        this.logger.error(`${err.stack || err}\n\n${JSON.stringify(err)}`);

                        err = new RpcException(RpcCode.INTERNAL, 'Internal error');
                    } else if (this.options.logVerbose) this.logger.verbose(err);

                    err.subject = channel;
                    return new RpcExceptionChain([err]);
                });

            const res = await promise;

            if (publish) publish(res);
        };
    }

    public parsePayload(data: any): RpcRequest | null {
        try {
            const payload = JSON.parse(data);
            if (payload._method) delete payload._method;

            if (payload && typeof payload === 'object') return payload;
        } catch (err) {
            //
        }
        return null;
    }

    public getPublisher(replyTo: string) {
        return (data: RpcExceptionChain | RpcResponse) => {
            const outgoingResponse = data instanceof RpcException ? data.toString() : JSON.stringify(data);
            return this.pubSub.pub.publish(replyTo, outgoingResponse);
        };
    }

    public handleError(stream: any) {
        stream.on(ERROR_EVENT, (err: any) => this.logger.error(err));
    }
}
