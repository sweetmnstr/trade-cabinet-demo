'use strict';

const dir = `./${process.env.TS ? 'src' : 'build'}/`;

const { MYSQL_PORT, MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE } = process.env;
/** @type {import("@nestjs/typeorm").TypeOrmModuleOptions} */
const options = {
    port: (MYSQL_PORT && Number(MYSQL_PORT)) || 3306,
    host: MYSQL_HOST || '',
    username: MYSQL_USER || '',
    password: MYSQL_PASS || '',
    database: MYSQL_DATABASE || '',
    bigNumberStrings: true,
    type: 'mysql',
    migrations: [`${dir}migrations/*.{ts,js}`],
    entities: [`${dir}entities/*.entity.{ts,js}`],
    subscribers: [`${dir}subscribers/*.{ts,js}`],
    cli: {
        entitiesDir: './src/entities',
        migrationsDir: './src/migrations',
        subscribersDir: './src/subscribers',
    },
    multipleStatements: true,
    logging: !!process.env.TS,
};

module.exports = options;
