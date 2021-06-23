import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../../entities/session.entity';
import { User } from '../../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Partner } from '../../entities/partner.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Session, Partner])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
