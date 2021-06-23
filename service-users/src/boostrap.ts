import { NestFactory } from '@nestjs/core';
import { RedisServerStrategy, RpcExceptionsFilter, SERVICE_PREFIX, checkMicroservice } from 'lib-rpc';
import { AppModule } from './app.module';
import { RPC_USERS } from './common/config';
import { createLogger } from './common/logger';

const logger = createLogger('APP');

export async function bootstrap(): Promise<void> {
    checkMicroservice();

    const app = await NestFactory.createMicroservice(AppModule, {
        strategy: new RedisServerStrategy(SERVICE_PREFIX, RPC_USERS),
    });

    app.useGlobalFilters(new RpcExceptionsFilter());

    app.listen(() => logger.info(`Service-Users started`));
}
