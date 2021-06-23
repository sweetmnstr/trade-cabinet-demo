import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MsUsersModule } from './modules/ms-clients/ms-users.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [MsUsersModule, UserModule, AuthModule],
})
export class AppModule {}
