require('reflect-metadata');

import { PATTERN_HANDLER_METADATA, PATTERN_METADATA } from '@nestjs/microservices/constants';
import { PatternHandler } from '@nestjs/microservices/enums/pattern-handler.enum';

type MSMethodObj = { f: Function; key: string };

export const SERVICE_PREFIX = process.env.SERVICE_PREFIX || '';
export const checkMicroservice = () => {
    if (!SERVICE_PREFIX) throw new Error(`SERVICE_PREFIX is not provided in process.env`);
};

export const MS_METHODS_STORE_KEY = 'mc.methods.store';
export const MSMethod = (): MethodDecorator => {
    return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
        if (typeof key === 'symbol') throw new Error('MSMethod function cannot named with symbol!'); // TODO: Change error

        const msMethodObj: MSMethodObj = {
            key,
            f: descriptor.value,
        };

        if (!Reflect.hasMetadata(MS_METHODS_STORE_KEY, target.constructor)) {
            Reflect.defineMetadata(MS_METHODS_STORE_KEY, [msMethodObj], target.constructor);
        } else {
            const store = Reflect.getMetadata(MS_METHODS_STORE_KEY, target.constructor) as MSMethodObj[];
            store.push(msMethodObj);
        }
    };
};

export const MSClass = (path: string): ClassDecorator => {
    return (target: Function) => {
        const store = Reflect.getMetadata(MS_METHODS_STORE_KEY, target) as MSMethodObj[];
        if (!store) return;

        for (const { key, f } of store) {
            const endpoint = `${SERVICE_PREFIX}.${path}.${key}`;
            Reflect.defineMetadata(PATTERN_METADATA, endpoint, f);
            Reflect.defineMetadata(PATTERN_HANDLER_METADATA, PatternHandler.MESSAGE, f);
        }
    };
};
