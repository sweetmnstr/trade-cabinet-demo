import { Module } from '@nestjs/common';
import { MsUsersModule } from './modules/ms-clients/ms-users.module';
import { OperatorModule } from './modules/operator/operator.module';

@Module({
    imports: [MsUsersModule, OperatorModule],
})
export class AppModule {}
