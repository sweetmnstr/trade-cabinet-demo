export abstract class CacheClass {
    protected clearCache<T>(storage: CacheStorage<T>, id: string | number): void {
        if (storage[id]) {
            clearTimeout(storage[id].timeout);
            delete storage[id];
        }
    }

    protected clearAllCache<T>(storage: CacheStorage<T>): void {
        for (const id in storage) {
            this.clearCache(storage, id);
        }
    }

    protected getCacheTimeout<T>(storage: CacheStorage<T>, id: string | number, ms: number): NodeJS.Timeout {
        return setTimeout(() => {
            delete storage[id];
        }, ms);
    }
}

export type CacheStorage<T> = {
    [id: string]: {
        promise: Promise<T | undefined>;
        timeout: NodeJS.Timeout;
    };
};
