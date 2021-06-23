import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    NotImplementedException,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import { RpcCode } from './rpc-code';

export class CancelledException extends HttpException {
    constructor(message?: string | object | any, error = 'Client Closed Request') {
        super(HttpException.createBody(message, error, 499), 499);
    }
}

export class TooManyRequestsException extends HttpException {
    constructor(message?: string | object | any, error = 'Too Many Request') {
        super(HttpException.createBody(message, error, HttpStatus.TOO_MANY_REQUESTS), HttpStatus.TOO_MANY_REQUESTS);
    }
}

export const RpcToHttpExceptionMapping = {
    //
    [RpcCode.OK]: null,
    [RpcCode.CANCELLED]: CancelledException,
    [RpcCode.UNKNOWN]: InternalServerErrorException,
    [RpcCode.INVALID_ARGUMENT]: BadRequestException,
    [RpcCode.DEADLINE_EXCEEDED]: GatewayTimeoutException,
    [RpcCode.NOT_FOUND]: BadRequestException,
    [RpcCode.ALREADY_EXISTS]: BadRequestException,
    [RpcCode.PERMISSION_DENIED]: ForbiddenException,
    [RpcCode.RESOURCE_EXHAUSTED]: TooManyRequestsException,
    [RpcCode.FAILED_PRECONDITION]: BadRequestException,
    [RpcCode.ABORTED]: ConflictException,
    [RpcCode.OUT_OF_RANGE]: BadRequestException,
    [RpcCode.UNIMPLEMENTED]: NotImplementedException,
    [RpcCode.INTERNAL]: InternalServerErrorException,
    [RpcCode.UNAVAILABLE]: ServiceUnavailableException,
    [RpcCode.DATA_LOSS]: InternalServerErrorException,
    [RpcCode.UNAUTHENTICATED]: UnauthorizedException,
};
