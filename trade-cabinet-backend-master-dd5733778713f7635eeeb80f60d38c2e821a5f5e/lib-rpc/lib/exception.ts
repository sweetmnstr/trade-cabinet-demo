import { RpcCode } from './rpc-code';
export class RpcException extends Error {
    constructor(
        public readonly code: RpcCode,
        message?: string,
        public readonly error?: string | object,
        public subject?: string
    ) {
        super(message);
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            error: this.error,
            subject: this.subject,
        };
    }
}
