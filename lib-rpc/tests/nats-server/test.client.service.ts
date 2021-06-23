import { Injectable } from '@nestjs/common';
import { NatsClient } from '../../lib';

@Injectable()
export class TestClientService extends NatsClient {
    constructor(url: string, timeout: number, token?: string) {
        super('test', { url, token, timeout });
    }
}
