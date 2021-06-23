import { RedisClient, RpcRedisOptions } from "lib-rpc";

export class CrmClient extends RedisClient {
    constructor(config: RpcRedisOptions) {
        super("crm", config);
    }
}
