export const safeParse = (data: any): any | void => {
    try {
        const res = JSON.parse(data);
        if (res && typeof res === 'object') return res;
    } catch {
        // empty
    }
};

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
