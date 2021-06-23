import { CONNECT_EVENT, ERROR_EVENT, NO_MESSAGE_HANDLER } from '@nestjs/microservices/constants';
import { NatsContext } from '@nestjs/microservices/ctx-host/nats.context';
import { CustomTransportStrategy } from '@nestjs/microservices/interfaces';
import { Server } from '@nestjs/microservices/server';
import { Observable } from 'rxjs';
import { Client, connect, MsgCallback } from 'ts-nats';
import { RpcException } from '../../exception';
import { RpcExceptionChain } from '../../exception-chain';
import { RpcCode } from '../../rpc-code';
import { RpcResponse } from '../../interfaces/rpc-response';
import { RpcNatsOptions } from '../../interfaces/rpc-common';

export class NatsServerStrategy extends Server implements CustomTransportStrategy {
    private natsClient!: Client;
    private options: RpcNatsOptions;

    constructor(private prefix: string, options?: RpcNatsOptions) {
        super();
        this.options = options || { url: 'nats://localhost:4222' };
    }

    public async listen(callback: () => void) {
        this.natsClient = await this.createNatsClient();
        this.handleError(this.natsClient);
        this.start(callback);
    }

    public start(callback: () => void) {
        this.bindEvents();
        this.natsClient.on(CONNECT_EVENT, callback);
    }

    public bindEvents() {
        this.natsClient.subscribe(`${this.prefix}.>`, this.getMessageHandler(), { queue: this.prefix });
        /*const queue = this.options.queue;
        const subscribe = (channel: string) => 
            this.natsClient.subscribe(channel, this.getMessageHandler(channel), { queue });

        const registeredPatterns = [...this.messageHandlers.keys()];d
        registeredPatterns.forEach(subscribe); */
    }

    public close() {
        this.natsClient && this.natsClient.close();
    }

    public createNatsClient(): Promise<Client> {
        return connect(this.options);
    }

    public getMessageHandler(): MsgCallback {
        return async (err, msg) => {
            if (err) return this.logger.error(`${err}`);
            const payload = msg.data && this.parsePayload(msg.data);
            const ctx = new NatsContext([msg.subject]);

            const { subject } = msg;
            const handler = this.getHandlerByPattern(subject);
            const publish = msg.reply ? this.getPublisher(msg.reply) : undefined;

            if (!handler) {
                if (publish) {
                    const err = new RpcException(RpcCode.UNIMPLEMENTED, NO_MESSAGE_HANDLER, undefined, subject);
                    publish(new RpcExceptionChain([err]));
                }

                return;
            }

            const promise = handler(payload, ctx)
                .then(data => {
                    if (data instanceof Observable) return data.toPromise();

                    return { status: 'OK', data, timestamp: Date.now() };
                })
                .catch(err => {
                    if (err instanceof RpcExceptionChain) {
                        err.messages.push(new RpcException(RpcCode.ABORTED, undefined, undefined, subject));

                        return err;
                    }

                    if (!(err instanceof RpcException)) {
                        // TODO: decide how it will be logger, as some errors have extended params
                        this.logger.error(`${err.stack || err}\n\n${JSON.stringify(err)}`);
                        
                        err = new RpcException(RpcCode.INTERNAL, 'Internal error');
                    } else if (this.options.logVerbose) this.logger.verbose(err);

                    err.subject = subject;
                    return new RpcExceptionChain([err]);
                });

            const res = await promise;

            if (publish) publish(res);
        };
    }

    public parsePayload(data: any): object | null {
        try {
            const payload = JSON.parse(data);
            if (payload._method) delete payload._method;

            if (payload && typeof payload === 'object') return payload;
        } catch (err) {
            //
        }
        return null;
    }

    public getPublisher(replyTo: string) {
        return (data: RpcExceptionChain | RpcResponse) => {
            const outgoingResponse = data instanceof RpcException ? data.toString() : JSON.stringify(data);
            return this.natsClient.publish(replyTo, outgoingResponse);
        };
    }

    public handleError(stream: any) {
        stream.on(ERROR_EVENT, (err: any) => this.logger.error(err));
    }
}
