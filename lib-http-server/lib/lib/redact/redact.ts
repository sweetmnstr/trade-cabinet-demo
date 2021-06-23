const isObject = (data: any): data is { [key: string]: any } => {
    return !!(data && data.toString() === "[object Object]" && !Array.isArray(data));
};

const DEFAULT_SENSIBLE_KEYS = ["password"];

const redact = (value: unknown, reg: RegExp): void => {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            redact(value[i], reg);
        }
        return;
    }

    if (isObject(value)) {
        for (const key of Object.keys(value)) {
            // TODO: maybe change 'number' to null or 0
            if (typeof value[key] === "string" && reg.exec(key)) {
                value[key] = "[FILTERED]";
            } else {
                redact(value[key], reg);
            }
        }
        return;
    }
};

export const sensitiveFields = <T extends object>(value: T, keys = DEFAULT_SENSIBLE_KEYS): T => {
    const regKeys = new RegExp(`^.*(${keys.join("|")}).*$`);
    redact(value, regKeys);
    return value;
};
