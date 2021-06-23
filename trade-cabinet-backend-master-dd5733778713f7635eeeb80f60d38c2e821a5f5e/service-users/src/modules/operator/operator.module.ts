import { Module } from '@nestjs/common';
import { OperatorController } from './operator.controller';
import { OperatorService } from './operator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientAccount } from '../../entities/client-account.entity';
import { User } from '../../entities/user.entity';
import { ClientTransaction } from '../../entities/client-transactions.entity';
import { Partner } from '../../entities/partner.entity';
import { Session } from '../../entities/session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, ClientTransaction, ClientAccount, Partner, Session])],
    controllers: [OperatorController],
    providers: [OperatorService],
    exports: [OperatorService],
})
export class OperatorModule {}
