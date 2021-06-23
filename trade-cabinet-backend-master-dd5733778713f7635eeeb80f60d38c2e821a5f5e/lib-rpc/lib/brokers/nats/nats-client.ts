import { Injectable } from '@nestjs/common';
import { Client, connect, NatsError } from 'ts-nats';
import { RpcExceptionChain, RpcExceptionChainObject } from '../../exception-chain';
import { RpcResponse } from '../../interfaces/rpc-response';
import { RpcNatsOptions } from '../../interfaces/rpc-common';

@Injectable()
export class NatsClient {
    constructor(private readonly prefix: string, private readonly config: RpcNatsOptions) {}
    private natsClient!: Client;

    private async serializeData(path: string, data?: object & { _method?: string }): Promise<string> {
        if (!this.natsClient) this.natsClient = await connect(this.config);
        (data || (data = {}))._method = path;

        return JSON.stringify(data);
    }

    //private throwException(err: Error) {}

    async request(path: string, data?: object & { _method?: string }): Promise<object> {
        const prefixedPath = `${this.prefix}.${path}`;
        const sendData = await this.serializeData(prefixedPath, data);
        const response = await this.natsClient
            .request(prefixedPath, this.config.timeout, sendData)
            .catch((err: NatsError) => {
                throw new NatsError(`${prefixedPath} -> ${err.message}`, err.code, err.chainedError);
            });

        const resData: RpcResponse | RpcExceptionChainObject = JSON.parse(response.data);

        if (this.isRpcExceptionChain(resData)) {
            const err = new RpcExceptionChain(resData.messages, resData.timestamp);

            throw err;
        }

        return resData.data;
    }

    async publish(path: string, data?: object & { _method?: string }): Promise<void> {
        const prefixedPath = `${this.prefix}.${path}`;
        const sendData = await this.serializeData(prefixedPath, data);

        await this.natsClient.publish(path, sendData);
    }

    isRpcExceptionChain(obj: RpcResponse | RpcExceptionChainObject): obj is RpcExceptionChainObject {
        return typeof obj.status !== 'string' || obj.status.toUpperCase() !== 'OK';
    }
}
