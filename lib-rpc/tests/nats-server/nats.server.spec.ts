process.env.SERVICE_PREFIX = 'test';

import { NestFactory } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { RpcException, NatsServerStrategy, RpcCode, RpcExceptionsFilter } from '../../lib';
import { TestClientService } from './test.client.service';
import { TestController, TestServerModule } from './test.server.module';
import { RpcExceptionChain } from '../../lib/exception-chain';

const NATS_URL = 'nats://localhost:4222';
const NATS_TOKEN = 'test';

describe('Nats Server test', () => {
    let controller: TestController;
    let client: TestClientService;

    beforeAll(async () => {
        const server = await NestFactory.createMicroservice(TestServerModule, {
            strategy: new NatsServerStrategy(process.env.SERVICE_PREFIX!, { url: NATS_URL, token: NATS_TOKEN }),
        });

        server.useGlobalFilters(new RpcExceptionsFilter());

        await server.listenAsync();
        console.log('Server listen');

        controller = server.get<TestController>(TestController);
        client = new TestClientService(NATS_URL, 30e3, NATS_TOKEN);
    }, 20e3);

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(client).toBeDefined();
    });

    it('should call test function', async () => {
        const res = await controller.test();

        console.log(res);
    });

    it('should call test via client', async () => {
        const res = await client.request('test.test');

        expect(res).toEqual('success_string');
    }, 30e3);

    it('should call testThrow via client and handle it as RpcException', async () => {
        const res = await client.request('test.testThrow').catch(err => {
            return err;
        });

        expect(res).toBeInstanceOf(RpcExceptionChain);
        expect(res.status).toEqual('error');
    }, 10e3);

    it('should call testThrowInternal via client and handle it as RpcException', async () => {
        const res: RpcExceptionChain = await client.request('test.testThrowInternal').catch(err => {
            return err;
        });

        expect(res).toBeInstanceOf(RpcExceptionChain);
        expect(res.status).toEqual('error');
        expect(res.messages[0].code).toEqual(RpcCode.INTERNAL);
    }, 10e3);
});
