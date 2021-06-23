import { RedisClient } from 'lib-rpc';
import { RpcRedisOptions } from 'lib-rpc';
export declare class UsersClient extends RedisClient {
    constructor(config: RpcRedisOptions);
}
