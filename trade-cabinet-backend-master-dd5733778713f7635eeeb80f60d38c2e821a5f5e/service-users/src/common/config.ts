import { config } from 'dotenv';
import { RpcRedisOptions } from 'lib-rpc';
import { getEnv, getEnvBool, getEnvNumber } from '../lib/env-helpers';

config({ path: './.env' });

// MAIN CONFIG
export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const IS_PROD = NODE_ENV === 'production';

export const UPDATER_ENABLED = getEnvBool('UPDATER_ENABLED', false);

export const SESSION_EXPIRE = getEnvNumber('SESSION_EXPIRE', 2592000000); // 1 Month

export const LOGGER_FILE_CONFIG = {
    isEnabled: getEnvBool('LOGGER_FILE_ENABLED', true),
    logDir: getEnv('LOGGER_FILE_LOGDIR', './logs'),
};

export const START_BALANCE = IS_PROD ? 0 : getEnvNumber('START_BALANCE', 0);

export const RPC_USERS: RpcRedisOptions = {
    url: getEnv('RPC_USERS_URL', 'localhost:6379'),
    pass: getEnv('RPC_USERS_PASS', ''),
};
