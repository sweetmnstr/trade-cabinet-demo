import { JwtLib } from 'lib-http-server';
import { JWT_EXPIRE, JWT_PASSRESET_SECRET, JWT_PASSRESET_SECRET_EXPIRE, JWT_SECRET } from '../common/config';

export const jwtAuth = new JwtLib(JWT_SECRET, JWT_EXPIRE);
export const jwtPass = new JwtLib(JWT_PASSRESET_SECRET, JWT_PASSRESET_SECRET_EXPIRE);
