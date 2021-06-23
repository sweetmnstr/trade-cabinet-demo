import { RpcCode } from '../rpc-code';
import { NatsConnectionOptions } from 'ts-nats';
import { RedisOptions } from 'ioredis';

export interface RpcStatus {
    code: RpcCode;
    message?: string;
}

export interface RpcAnswer<T extends unknown = unknown> {
    status: RpcStatus;
    data: T;
}

// export type RpcData = object | string | number;

export interface RpcNatsOptions extends NatsConnectionOptions {
    url: string;
    token?: string;
    user?: string;
    pass?: string;
    timeout?: number;
    json?: boolean;
    logVerbose?: boolean;
}

export interface RpcRedisOptions extends RedisOptions {
    url: string;
    token?: string;
    user?: string;
    pass?: string;
    timeout?: number;
    json?: boolean;
    logVerbose?: boolean;
}
