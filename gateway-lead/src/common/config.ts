import { config } from 'dotenv';
import { RpcRedisOptions } from 'lib-clients';
import { getEnv, getEnvArray, getEnvBool, getEnvNumber } from '../lib/env-helpers';
import { randomString } from '../lib/helpers';

config({ path: './.env' });

// MAIN CONFIG
export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const IS_PROD = NODE_ENV === 'production';
export const PORT = getEnvNumber('PORT', 3123);
export const UPDATER_ENABLED = getEnvBool('UPDATER_ENABLED', false);
export const IS_ATTACH_SWAGGER = getEnvBool('ATTACH_SWAGGER', false);

export const WEBSITE_URL = getEnv('WEBSITE_URL', 'http://localhost');
const url = new URL(WEBSITE_URL);
export const DOMAIN = url.host;
const domainSplit = DOMAIN.split('.');
// Note: do not set DOMAIN_COOKIE env in production!
export const DOMAIN_COOKIE = getEnv('DOMAIN_COOKIE', `.${domainSplit.slice(-2, domainSplit.length).join('.')}`);

export const IS_SECURE = getEnvBool('IS_SECURE', false);
export const REVERSE_PROXY_IPS = new Set(getEnvArray('REVERSE_PROXY_IPS', ['::1', '::ffff:127.0.0.1']));

// JWT
export const JWT_SECRET = getEnv('JWT_SECRET', randomString(20));
export const JWT_EXPIRE = getEnv('JWT_EXPIRE', '30m');
export const JWT_PASSRESET_SECRET = getEnv('JWT_PASSRESET_SECRET', randomString(20));
export const JWT_PASSRESET_SECRET_EXPIRE = getEnvNumber('JWT_PASSRESET_SECRET_EXPIRE', 300); // 5 min

export const RATE_LIMIT_CONFIG = {
    signin: getEnvNumber('RL_SIGNIN', 1e3),
    refreshToken: getEnvNumber('RL_REFRESH_TOKEN', 10e3),
    withdrawal: getEnvNumber('RL_WITHDRAWAL', 5e3),
};

export const LOGGER_FILE_CONFIG = {
    isEnabled: getEnvBool('LOGGER_FILE_ENABLED', true),
    logDir: getEnv('LOGGER_FILE_LOGDIR', './logs'),
};

export const RPC_USERS: RpcRedisOptions = {
    url: getEnv('RPC_USERS_URL', 'localhost:6379'),
    pass: getEnv('RPC_USERS_PASS', ''),
};
