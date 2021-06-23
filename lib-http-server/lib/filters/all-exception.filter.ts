import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    InternalServerErrorException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { RpcExceptionChain, RpcToHttpExceptionMapping, RpcCode } from "lib-rpc";
import { format } from "util";
import { sensitiveFields } from "../lib/redact";

@Catch()
export class AllExceptionHttpFilter implements ExceptionFilter {
    constructor(
        private readonly log: Logger,
        private projectHttpException: typeof HttpException,
        private projectInternalError: typeof InternalServerErrorException
    ) {}

    catch(exception: Error, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const resp = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        // capture time as earlier as possible
        const now = Date.now();

        const httpException = this.getException(exception, req);
        const messages = this.getUserErrors(httpException);
        const errorResponse: IErrorResponse = {
            status: "error",
            timestamp: now,
            messages,
        };

        resp.status(httpException.getStatus()).json(errorResponse);
    }

    getException(err: Error, req: Request): HttpException {
        // @see switch type https://stackoverflow.com/a/36332700
        if (err instanceof RpcExceptionChain) {
            const h = this.natsToHTTP(err);
            if (h !== null) {
                return h;
            }
            this.log.error(
                `${this.formatNatsException(err)}\n${this.parseRequest(req)}`
            );
        } else if (
            err instanceof this.projectHttpException &&
            !(err instanceof this.projectInternalError)
        ) {
            return err as HttpException;
        } else {
            this.log.error(
                `${err.stack || err.message}\n${this.parseRequest(req)}`
            );
        }

        // switch (true) {
        // case err instanceof NatsExceptionChain:
        // }

        return new InternalServerErrorException();
    }

    natsToHTTP(exception: RpcExceptionChain): HttpException | null {
        const firstException = exception.messages[0];
        const CustomException = RpcToHttpExceptionMapping[firstException.code];

        if (
            !CustomException ||
            firstException.code === RpcCode.INTERNAL ||
            firstException.code === RpcCode.UNIMPLEMENTED
        ) {
            return null;
        }

        return new CustomException(
            firstException.error,
            firstException.message
        );
    }

    getUserErrors(exception: HttpException): object[] {
        const msg = exception.getResponse() as
            | string
            | { message?: object | object[]; error: object };

        if (typeof msg === "string") {
            return [{ error: msg }];
        }
        if (msg && typeof msg === "object") {
            return Array.isArray(msg.message)
                ? msg.message
                : [{ error: msg.message || msg.error }];
        }

        this.log.warn(`Unexpected error. resp:\n${msg}\n${exception}`);
        return [{ error: "Contact technical support" }];
    }

    parseRequest(req: Request): string {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const data = extractRequestData(req, false);
        // TODO: or just format(data)?
        let str = `${data.method} ${data.url}`;
        if (req.user) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            str += `\n  ${format(extractUserData(req.user, false))}`;
        }
        if (data.data) {
            str += `\n  ${data.data}`;
        }
        return str;
    }

    formatNatsException(ex: RpcExceptionChain): string {
        // `${(CustomException && firstException.code) || 'NO_CODE'} -> ${this.formatNatsException(exception)}`
        // [message.code, message.subject] .join()
        return `Chain: ${ex.messages
            .map((message) => message.subject)
            .join(" -> ")}\n${format(ex.messages)}`;
    }
}

interface Logger {
    debug(message: string, meta?: unknown): void;
    info(message: string, meta?: unknown): void;
    warn(message: string, meta?: unknown): void;
    error(message: string, meta?: unknown): void;
}

/**
 * from @sentry/core.
 */

/** Default request keys that'll be used to extract data from the request */
const DEFAULT_REQUEST_KEYS = ["data", "method", "url"];
// const DEFAULT_REQUEST_KEYS = ['cookies', 'data', 'headers', 'method', 'query_string', 'url'];

function extractRequestData(
    req: { [key: string]: any },
    keys: boolean | string[]
): { [key: string]: string } {
    const request: { [key: string]: any } = {};
    const attributes = Array.isArray(keys) ? keys : DEFAULT_REQUEST_KEYS;

    // method:
    //   node, express, koa: req.method
    const method = req.method;

    // url (including path and query string):
    //   node, express: req.originalUrl
    //   koa: req.url
    const originalUrl = (req.originalUrl || req.url) as string;
    // absolute url
    //   const absoluteUrl = `${protocol}://${host}${originalUrl}`;

    for (const key of attributes) {
        switch (key) {
            // case 'headers':
            // case 'cookies':
            // case 'query_string':
            // query string:
            //   node: req.url (raw)
            //   express, koa: req.query
            // request.query_string = url.parse(originalUrl || '', false).query;
            // break;
            case "method":
                request.method = method;
                break;
            case "url":
                request.url = originalUrl;
                // request.url = absoluteUrl;
                break;
            case "data":
                if (method === "GET" || method === "HEAD") {
                    break;
                }
                // body data:
                if (req.body !== undefined) {
                    /**
                     * JSON.stringify(normalize(req.body)).
                     * use toJSON() if exists, rm circular dep
                     */
                    request.data =
                        typeof req.body === "string"
                            ? req.body
                            : JSON.stringify(sensitiveFields(req.body));
                }
                break;
            default:
                if ({}.hasOwnProperty.call(req, key)) {
                    request[key] = (req as { [key: string]: any })[key];
                }
        }
    }

    return request;
}

/** Default user keys that'll be used to extract data from the request */
const DEFAULT_USER_KEYS = ["id", "accountId"];
function extractUserData(
    user: { [key: string]: any },
    keys: boolean | string[]
): { [key: string]: any } {
    const extractedUser: { [key: string]: any } = {};

    if (user) {
        const attributes = Array.isArray(keys) ? keys : DEFAULT_USER_KEYS;

        for (const key of attributes) {
            if (key in user) {
                extractedUser[key] = user[key];
            }
        }
    }

    return extractedUser;
}
