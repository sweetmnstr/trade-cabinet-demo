import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcCode, RpcException } from 'lib-rpc';
import * as moment from 'moment';
import { InsertResult, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ILoginDto, ILoginOperator, ISignupDto } from 'trade-cabinet-types';
import { SESSION_EXPIRE } from '../../common/config';
import { MAX_SESSION_COUNT } from '../../common/constants/base.constants';
import { createLogger } from '../../common/logger';
import { Session } from '../../entities/session.entity';
import { User } from '../../entities/user.entity';
import { geneHash } from '../../lib/crypto';
import { randomInt } from '../../lib/helpers';
import { UserAuth, OperatorService } from '../operator/operator.service';
// import UserType = JWT.UserType;

const logger = createLogger('Auth');

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepo: Repository<Session>,
        private readonly operatorService: OperatorService
    ) {}

    insertSession(session: any): Promise<InsertResult> {
        return this.sessionRepo.insert(session);
    }

    private async addSession(session: Session): Promise<void> {
        const { user } = session;
        if (!user) throw new TypeError('No user in session!');
        const existingSessionsCount = await this.sessionRepo.count({ user });

        if (existingSessionsCount >= MAX_SESSION_COUNT) {
            await this.sessionRepo.delete({ user });
        }

        if (session.id) await this.sessionRepo.update(session.id, session);
        else await this.sessionRepo.insert(session);
    }

    async loginOperator(body: ILoginOperator): Promise<JWT.RefreshTokenInfo> {
        const { userType, loginDTO } = body;

        if (userType !== 'operator') throw new BadRequestException('INVALID_USER_TYPE');

        const user = await this.operatorService.findByCredentials(loginDTO);

        return this.getTokenResponse(user);
    }

    async login(params: ILoginDto): Promise<JWT.RefreshTokenInfo> {
        const user = await this.operatorService.findByCredentials(params);

        return this.getTokenResponse(user);
    }

    async refreshTokens(refreshToken: string): Promise<JWT.RefreshTokenInfo> {
        const userColumns: (keyof User)[] = ['id'];
        const sessionColumns: (keyof Session)[] = ['id', 'expiredAt'];

        const select = userColumns.map((c) => `u.${c}`).concat(sessionColumns.map((c) => `s.${c}`));
        const whereOpts: Partial<Session> = { refreshToken };

        const session = await this.sessionRepo
            .createQueryBuilder('s')
            .innerJoin('s.user', 'u')
            .select(select)
            .where(whereOpts)
            .getOne();

        if (!session) throw new RpcException(RpcCode.NOT_FOUND, 'Token not found');

        const nowTime = moment();

        if (nowTime.isAfter(session.expiredAt)) throw new RpcException(RpcCode.UNAUTHENTICATED, 'Token expired');

        const user = await this.operatorService.findByIdWithTypes(session.user.id);

        if (!user) throw new Error(`user not found with id: ${session.user.id}`);

        return this.getTokenResponse(user, session);
    }

    async logout(refreshToken: string): Promise<boolean> {
        const { affected } = await this.sessionRepo.delete({ refreshToken });

        if (!affected) throw new RpcException(RpcCode.NOT_FOUND, 'Token not found');

        return true;
    }

    protected updateSession(session: Session): void {
        session.refreshToken = uuid();
        session.expiredAt = moment().add({ milliseconds: SESSION_EXPIRE }).toDate();
    }

    async getTokenResponse(user: UserAuth, session?: Session): Promise<JWT.RefreshTokenInfo> {
        const { id, userType } = user;
        const data: JWT.TokenPayload = {
            id,
            userType,
        };

        if (!session) session = this.sessionRepo.create({ user });

        this.updateSession(session);
        await this.addSession(session);

        return {
            refreshToken: session.refreshToken,
            expiredAt: ~~(session.expiredAt.getTime() / 1000),
            data: data,
        };
    }

    async signup(user: ISignupDto): Promise<JWT.RefreshTokenInfo> {
        await this.operatorService.checkUniqueEmail(user.email);
        const { hash, salt } = geneHash(user.password, randomInt(8, 12));

        const userEntity = await this.operatorService.create({
            hash,
            salt,
            email: user.email,
            userType: 'user',
        });

        logger.info(`New user. ${user.email}`);

        return this.getTokenResponse(userEntity);
    }
}
