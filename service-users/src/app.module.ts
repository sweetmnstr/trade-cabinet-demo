import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalModule } from './core/global';
import { UserModule } from './modules/user/user.module';
import { OperatorModule } from './modules/operator/operator.module';

@Module({
    imports: [GlobalModule, AuthModule, UserModule, OperatorModule],
})
export class AppModule {}
