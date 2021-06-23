import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../../entities/session.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OperatorModule } from '../operator/operator.module';

@Module({
    imports: [TypeOrmModule.forFeature([Session]), UserModule, OperatorModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
