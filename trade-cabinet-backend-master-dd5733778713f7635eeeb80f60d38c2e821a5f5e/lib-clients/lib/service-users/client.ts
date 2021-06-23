import { RedisClient } from 'lib-rpc';
import { RpcRedisOptions } from 'lib-rpc';

export class UsersClient extends RedisClient {
    constructor(config: RpcRedisOptions) {
        super('serviceUsers', config);
    }
}
