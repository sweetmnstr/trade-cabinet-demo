import { Module } from '@nestjs/common';
import { OperatorController } from './operator.controller';
import { OperatorGateway } from './operator.gateway';
import { MsUsersModule } from '../ms-clients/ms-users.module';

@Module({
    imports: [MsUsersModule],
    providers: [OperatorGateway],
    controllers: [OperatorController],
})
export class OperatorModule {}
