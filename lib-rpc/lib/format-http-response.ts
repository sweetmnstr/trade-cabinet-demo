import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { RpcToHttpExceptionMapping } from './mapping';
import { RpcAnswer } from './interfaces/rpc-common';

export const formatHttpResponse = async <P>(grpcAnswer: RpcAnswer<P>): Promise<{ data: P }> => {
    if (grpcAnswer.status.code !== 0) {
        const exception: new (msg: string) => HttpException =
            RpcToHttpExceptionMapping[grpcAnswer.status.code] || InternalServerErrorException;
        throw new exception(grpcAnswer.status.message || 'Unknown');
    }
    return { data: grpcAnswer.data };
};
