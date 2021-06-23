import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

export class RpcExceptionsFilter implements ExceptionFilter {
    catch(exception: any, _host: ArgumentsHost) {
        throw exception;
    }
}
