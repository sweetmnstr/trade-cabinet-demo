import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CacheKey } from '../workers/rate-limit-mem-cache';

export const RATE_LIMIT_METADATA_KEY = 'rateLimits';
export const RateLimited = (name: CacheKey): CustomDecorator<string> => SetMetadata(RATE_LIMIT_METADATA_KEY, name);
