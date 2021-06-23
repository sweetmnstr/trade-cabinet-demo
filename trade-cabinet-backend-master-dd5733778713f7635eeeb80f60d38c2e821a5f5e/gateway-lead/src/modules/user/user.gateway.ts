import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    private users = 0;

    handleConnection(): void {
        // A client has connected
        this.users++;

        //Current amount of connected users
        this.server.emit('users', this.users);
    }

    handleDisconnect(): void {
        // A client has disconnected
        this.users--;

        //Current amount of connected users
        this.server.emit('users', this.users);
    }

    @SubscribeMessage('init')
    handleInit(@MessageBody() data: string, @ConnectedSocket() _client: Socket): any {
        return data;
    }

    @SubscribeMessage('credentials')
    handleCredentials(@MessageBody() data: any, @ConnectedSocket() _client: Socket): any {
        return data;
    }

    @SubscribeMessage('confirm')
    handleConfirm(@MessageBody() data: any, @ConnectedSocket() _client: Socket): any {
        return data;
    }
}
