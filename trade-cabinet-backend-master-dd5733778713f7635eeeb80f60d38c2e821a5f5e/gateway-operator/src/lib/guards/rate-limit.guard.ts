import { CanActivate, ExecutionContext, Injectable, RequestTimeoutException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RATE_LIMIT_CONFIG } from '../../common/config';
import { RATE_LIMIT_METADATA_KEY } from '../decorators/rate-limit.decorator';
import { CacheKey, MemCache } from '../workers/rate-limit-mem-cache';

@Injectable()
export class RatelimitGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { realIp }: Request = context.switchToHttp().getRequest();

        const allowed = await this.isAllowed(context, realIp);

        if (!allowed) throw new RequestTimeoutException();

        return allowed;
    }

    async isAllowed(ctx: ExecutionContext, ip: string): Promise<boolean> {
        const classKey: CacheKey | undefined = this.reflector.get(RATE_LIMIT_METADATA_KEY, ctx.getClass());
        if (classKey && !this.validate(ip, classKey)) {
            return false;
        }

        const methodKey: CacheKey | undefined = this.reflector.get(RATE_LIMIT_METADATA_KEY, ctx.getHandler());
        if (methodKey && !this.validate(ip, methodKey)) {
            return false;
        }

        return true;
    }

    validate(ip: string, key: CacheKey): boolean {
        const ms = RATE_LIMIT_CONFIG[key];

        if (MemCache.get(key, ip)) {
            return false;
        }

        MemCache.set(key, ip, true, ms);

        return true;
    }
}
