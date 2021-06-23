import { Module } from '@nestjs/common';
import { RpcException, RpcCode } from '../../lib';
import { MSClass, MSMethod } from '../../lib/decorators/ms.decorators';

@MSClass('test')
export class TestController {
    @MSMethod()
    test(data?: any) {
        console.log(`Recieved: ${(data && JSON.stringify(data)) || 'NO_DATA'}`);
        return 'success_string';
    }

    @MSMethod()
    async testThrow(data?: any) {
        console.log(`Recieved: ${(data && JSON.stringify(data)) || 'NO_DATA'}`);
        throw new RpcException(RpcCode.UNKNOWN, 'Test error', { err: 'Made exception for testing' });
    }

    @MSMethod()
    async testThrowInternal(data?: any) {
        console.log(`Recieved: ${(data && JSON.stringify(data)) || 'NO_DATA'}`);
        throw new Error('Fake internal error');
    }
}

export const TestServerModuleMetadata = {
    controllers: [TestController],
};

@Module(TestServerModuleMetadata)
export class TestServerModule {}
