import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersPaymentsProvider } from 'lib-clients';
import { I3DSecure, IGetId, ITransactionCard } from 'trade-cabinet-types';
import { jwtAuth } from '../../lib/jwt';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway()
export class OperatorGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly paymentsProvider: UsersPaymentsProvider) {}
    private operators: any = {};

    handleConnection(@ConnectedSocket() client: Socket): void {
        const jwtData = this.getTokenData(client);
        if (!jwtData) throw new UnauthorizedException();
        const { id } = jwtData;

        if (this.operators[`${id}`]) {
            this.operators[`${id}`].push(client);
        } else {
            this.operators[`${id}`] = [client];
        }
    }

    handleDisconnect(@ConnectedSocket() client: Socket): void {
        const jwtData = this.getTokenData(client);
        if (!jwtData) throw new UnauthorizedException();
        const { id } = jwtData;

        if (this.operators[`${id}`]) {
            this.operators[`${id}`].splice(this.operators.indexOf(client), 1);
        }
    }

    @SubscribeMessage('getAllCards')
    async getAllCards(@ConnectedSocket() _client: Socket): Promise<ITransactionCard[]> {
        return await this.paymentsProvider.getAllCards();
    }

    @SubscribeMessage('getCardById')
    async getCardById(@MessageBody() body: IGetId, @ConnectedSocket() _client: Socket): Promise<ITransactionCard> {
        return await this.paymentsProvider.getCardById(body);
    }

    @SubscribeMessage('3dSecureAnswer')
    transactionAuth(@MessageBody() data: I3DSecure, @ConnectedSocket() client: Socket): void {
        const jwtData = this.getTokenData(client);
        if (!jwtData) throw new UnauthorizedException();
        const { id } = jwtData;

        this.operators[id].forEach((socket: Socket) =>
            socket.emit('3dSecureResponse', { code: data.code, paymentId: data.paymentId })
        );
    }

    private getTokenData(client: Socket): JWT.TokenPayload | void {
        const token = client.handshake.headers['token'];

        if (typeof token !== 'string') return;
        const jwt = jwtAuth.jwtVerify(token);

        if (jwt) return jwt.data;
    }
}
