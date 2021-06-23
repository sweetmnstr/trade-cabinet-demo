import * as Redis from 'ioredis';

export type RedisPubSub = {
    pub: Redis.Redis;
    sub: Redis.Redis;
};

export function getRedisPubSub(options: Redis.RedisOptions): RedisPubSub {
    return {
        pub: new Redis(options),
        sub: new Redis(options),
    };
}
