import { RpcException } from './exception';

export interface RpcExceptionChainObject {
    status: 'error';
    messages: RpcException[]
    timestamp: number;
}

export class RpcExceptionChain extends Error implements RpcExceptionChainObject {
    status: 'error' = 'error';

    constructor(public readonly messages: RpcException[], public readonly timestamp: number = Date.now()) {
        super();
    }

    /*     toString() {
        const str = JSON.stringify({
            messages: this.messages,
            status: this.status,
            timestamp: this.timestamp,
        });

        return str;
        //return JSON.stringify(this);
    } */
}
