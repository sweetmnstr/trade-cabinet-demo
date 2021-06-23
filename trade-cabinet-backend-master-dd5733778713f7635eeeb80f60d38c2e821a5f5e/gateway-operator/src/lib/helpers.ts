/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'buffer';

export const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function safeParse(text: string, type?: 'object'): { [key: string]: any } | null;
export function safeParse(text: string, type?: 'boolean'): boolean | null;
export function safeParse(text: string, type?: 'string'): string | null;
export function safeParse(text: string, type?: 'number'): number | null;
export function safeParse(text: string, type: 'object' | 'boolean' | 'string' | 'number' = 'object'): any | null {
    try {
        const obj = JSON.parse(text);

        if (typeof obj === type) return obj;
    } catch (err) {}

    return null;
}

export function throwError(text: string, ThrowableClass: any = Error): never {
    throw new ThrowableClass(text);
}

export function mergeObjects<T, K>(targetObject: T, extendObject: K): T & K {
    return Object.assign(targetObject, extendObject);
}

export function jsonFormat(object: object | any[]): string {
    return JSON.stringify(object, null, 4);
}

export function deleteElementFromArray<T>(array: T[], element: T): void {
    const index = array.indexOf(element);

    if (index !== -1) array.splice(index, 1);
}

export function escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const getByteSize = (content: any): number => Buffer.byteLength(content);

export function randomInt(min: number, max: number): number {
    return ~~(min + Math.random() * (max - min + 1));
}

export function randomString(length: number): string {
    const abc = 'qwertyuiopasdfghjklzxcvbnm1234567890';

    let str = '';

    for (let i = 0; i < length; i++) {
        const letter = abc[~~(Math.random() * abc.length)];
        str += Math.random() > 0.5 ? letter : letter.toUpperCase();
    }

    return str;
}

export function getDeepProperty(obj: any, args: string[]): any {
    let temp = obj;

    for (const key of args) {
        if (!temp) return;

        temp = temp[key];
    }

    return temp;
}

export function safeParseUrl(str: string): URL | null {
    try {
        const url = new URL(str);

        return url;
    } catch (err) {
        return null;
    }
}

export function isObjectHasLength<T>(obj: T): obj is T {
    if (!obj || typeof obj !== 'object') return false;

    return !!Object.keys(obj).length;
}

type RenamePropFunction = <T, K extends keyof T, N extends string | symbol>(
    /* | Exclude<K>> */ obj: T,
    oldKey: K,
    newKey: N
) => Omit<T, K | N> & { [key in N]: T[K] };

export const renameProp: RenamePropFunction = (obj, oldKey, newKey) => {
    const vl = obj[oldKey];
    delete obj[oldKey];

    const o = obj as any;
    o[newKey] = vl;

    return o;
};

export const renamePropWithClone: RenamePropFunction = (obj, oldKey, newKey) => {
    const o: any = Object.assign({}, obj);
    o[newKey] = o[oldKey];
    delete o[oldKey];

    return o;
};
