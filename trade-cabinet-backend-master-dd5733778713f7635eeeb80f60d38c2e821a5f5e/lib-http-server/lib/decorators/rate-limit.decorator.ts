import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_METADATA_KEY = 'rateLimits';
export const RateLimited = (name: string): CustomDecorator<string> => SetMetadata(RATE_LIMIT_METADATA_KEY, name);
