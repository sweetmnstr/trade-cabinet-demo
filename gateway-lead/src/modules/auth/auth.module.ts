import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MsUsersModule } from '../ms-clients/ms-users.module';

@Module({
    imports: [MsUsersModule],
    providers: [],
    controllers: [AuthController],
})
export class AuthModule {}
