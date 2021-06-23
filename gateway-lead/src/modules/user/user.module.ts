import { Module } from '@nestjs/common';
import { MsUsersModule } from '../ms-clients/ms-users.module';
import { UserController } from './user.controller';
import { UserGateway } from './user.gateway';

@Module({
    imports: [MsUsersModule],
    providers: [UserGateway],
    controllers: [UserController],
    exports: [],
})
export class UserModule {}
