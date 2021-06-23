require('source-map-support').install();

import { BadRequestException, HttpException, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
    AllExceptionHttpFilter,
    attachSwagger,
    bodyParserMiddleware,
    HttpTransformInterceptor,
    realIpMiddleware,
    setCorsHelmet,
} from 'lib-http-server';
import { AppModule } from './app.module';
import {
    DOMAIN,
    IS_ATTACH_SWAGGER,
    IS_PROD,
    IS_SECURE,
    PORT,
    REVERSE_PROXY_IPS,
    UPDATER_ENABLED,
} from './common/config';
import { DOCS_PATH } from './common/constants/base.constants';
import { createLogger } from './common/logger';
import { MAIN_LANG } from './langs/main.lang';
import { RolesGuard } from './lib/guards/roles.guard';
import { Updater } from './lib/updater';

const logger = createLogger('APP');

const updater = new Updater(
    null,
    createLogger('Updater'),
    // before update
    null,
    // () => {},
    // after update. use process manager to auto-restart
    () => process.exit(0)
);

async function bootstrap(): Promise<void> {
    // FIXME: add ioredis startup as in ppnest-hasoffers

    if (UPDATER_ENABLED) await updater.run();

    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('/api');

    setCorsHelmet(app, {
        optionsSuccessStatus: 200,
        origin: IS_PROD ? RegExp(`(\\.|\/|^)${DOMAIN}$`) : '*',
    });

    app.use('*', bodyParserMiddleware());
    app.use('*', realIpMiddleware(REVERSE_PROXY_IPS));

    app.useGlobalPipes(
        new ValidationPipe({
            validationError: { target: false },
            transform: true,
            forbidUnknownValues: true,
            forbidNonWhitelisted: true,
            whitelist: true,
            exceptionFactory: (errors) => new BadRequestException(errors),
            /* disableErrorMessages: IS_PROD, */
        })
    );

    const reflector = app.get(Reflector);

    app.useGlobalGuards(new RolesGuard(reflector));

    app.useGlobalInterceptors(new HttpTransformInterceptor());
    app.useGlobalFilters(
        new AllExceptionHttpFilter(createLogger('ExceptionFilter'), HttpException, InternalServerErrorException)
    );

    if (!IS_PROD || IS_ATTACH_SWAGGER) attachSwagger(app, MAIN_LANG, DOCS_PATH, IS_SECURE);

    await app.listen(PORT, () => logger.info(`Gateway for ${DOMAIN} started on ${PORT}`));
}

bootstrap();
