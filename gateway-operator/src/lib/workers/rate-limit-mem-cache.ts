import { RATE_LIMIT_CONFIG } from "../../common/config";

export type CacheKey = keyof typeof RATE_LIMIT_CONFIG;

type KeyStorage = {
    [index: string]: {
        timeout: NodeJS.Timeout;
        value: any;
    };
};

export class MemCache {
    private static store: { [key: string]: KeyStorage } = {};

    static init(): void {
        for (const key in RATE_LIMIT_CONFIG) {
            this.store[key] = {};
        }
    }

    static get<T = any>(key: CacheKey, index: string | number): T | void {
        const pair = this.store[key][index];
        if (pair) return pair.value;
    }

    static set(key: CacheKey, index: string | number, value: any, ms = 1e3): void {
        this.clear(key, index);

        this.store[key][index] = {
            value,
            timeout: setTimeout(() => this.clear(key, index), ms),
        };
    }

    static clearGroup(key: CacheKey): void {
        for (const { timeout } of Object.values(this.store[key])) {
            clearTimeout(timeout);
        }

        this.store[key] = {};
    }

    static clear(key: CacheKey, index: string | number): void {
        const pair = this.store[key][index];

        if (pair) {
            clearTimeout(pair.timeout);
            delete this.store[key][index];
        }
    }
}

MemCache.init();
