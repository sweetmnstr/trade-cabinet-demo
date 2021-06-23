import { existsSync, mkdirSync } from 'fs';
import * as moment from 'moment';
import { format as utilFormat } from 'util';
import { createLogger as createWinston, format, Logger, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as Transport from 'winston-transport';
import { LOGGER_FILE_CONFIG } from './config';

const { combine, label, printf, colorize, align, errors } = format;
// const LOGDIR = './logs'; // LOGGER_FILE_CONFIG.logDir
const loggers: { [label: string]: Logger } = {};

if (LOGGER_FILE_CONFIG.isEnabled) {
    if (!existsSync(LOGGER_FILE_CONFIG.logDir)) mkdirSync(LOGGER_FILE_CONFIG.logDir);
}

function getLogger(namespace: string): Logger {
    const logTransports: Transport[] = [
        new transports.Console({
            format: colorize({ all: true }),
        }),
    ];

    if (LOGGER_FILE_CONFIG.isEnabled) {
        const dirname = `${LOGGER_FILE_CONFIG.logDir}/${namespace}`;

        logTransports.push(
            new DailyRotateFile({
                level: 'info',
                filename: 'info-%DATE%.txt',
                dirname,
                maxSize: '5m',
                maxFiles: 10,
            }),
            new DailyRotateFile({
                level: 'error',
                filename: 'error-%DATE%.txt',
                dirname,
                maxSize: '5m',
                maxFiles: 10,
            }),
            new DailyRotateFile({
                level: 'verbose',
                filename: 'verbose-%DATE%.txt',
                dirname,
                maxSize: '5m',
                maxFiles: 10,
            })
        );
    }

    return createWinston({
        format: combine(
            label({ label: namespace }),
            errors({ stack: true }),
            printf((info) => {
                const { level, message, label, stack } = info;
                const ts = moment().format('YYYY-MM-DD HH:mm:ss');
                // info.timestamp = ts;

                return `${ts} [${level}] [${label}]: ${stack ? stack : utilFormat(message)}`;
            }),
            align()
        ),
        transports: logTransports,
    });
}

export function createLogger(namespace: string): Logger {
    const upperNamespace = namespace.toUpperCase();

    if (!loggers[upperNamespace]) loggers[upperNamespace] = getLogger(namespace);

    return loggers[upperNamespace];
}
