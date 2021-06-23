import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
// import { IS_PROD, START_BALANCE } from '../../common/config';
import { Session } from '../../entities/session.entity';
import { User } from '../../entities/user.entity';
import { Partner } from '../../entities/partner.entity';
import { ClientTransaction } from '../../entities/client-transactions.entity';
import { ClientAccount } from '../../entities/client-account.entity';
import {
    IClientTransactions,
    ILoginDto,
    PartnerEntity,
    IUserUpdateDto,
    IAddClientAccountDto,
    IUpdateTransactionStatusDto,
    IGetId,
    IUpdatePasswordDto,
    IBalanceDto,
    UserEntity,
} from 'trade-cabinet-types';
import { compareHash, geneHash } from '../../lib/crypto';
import { randomInt } from 'crypto';
import { CacheClass, CacheStorage, RpcCode, RpcException } from 'lib-rpc';

export type UserAuth = Pick<User, 'id' | 'userType' | 'hash' | 'salt' | 'email'>;

@Injectable()
export class OperatorService extends CacheClass {
    private readonly cacheMe: CacheStorage<IUserUpdateDto> = {};

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Session) private readonly sessionRepo: Repository<Session>,
        @InjectRepository(Partner) private readonly partnerRepo: Repository<Partner>,
        @InjectRepository(ClientTransaction) private readonly clientTransactionsRepo: Repository<ClientTransaction>,
        @InjectRepository(ClientAccount) private readonly clientAccountRepo: Repository<ClientAccount>
    ) {
        super();
    }

    private notUniqueEmail(): never {
        throw new ConflictException('ALREADY_REGISTERED');
    }

    async checkUniqueEmail(email: string): Promise<void> {
        const oldUser = await this.userRepo.findOne({ email });

        if (oldUser) this.notUniqueEmail();
    }

    // async create(dto: ISignupDto): Promise<User> {
    //     const { hash, salt } = geneHash(dto.password, randomInt(8, 12));
    //
    //     const user = this.userRepo.create({
    //         userType: 'user',
    //         hash,
    //         salt,
    //     });
    //
    //     this.userRepo.merge(user, dto);
    //
    //     await this.userRepo.insert(user);
    //
    //     return user;
    // }

    async create(params: DeepPartial<UserEntity>): Promise<UserEntity> {
        const user = this.userRepo.create(params);
        await this.userRepo.save(user);

        return user;
    }

    async update(user: JWT.TokenPayload, data: Partial<User>): Promise<void> {
        const { id, userType } = user;

        const res = await this.userRepo.update({ id, userType }, data);

        if (!res.affected) throw new NotFoundException('RELOGIN');

        this.clearCache(this.cacheMe, id);
    }

    private userAuthSql: SelectQueryBuilder<User> = this.userRepo.createQueryBuilder('u');

    findByIdWithTypes(userId: number): Promise<UserAuth | undefined> {
        return this.userAuthSql.clone().where({ id: userId }).getOne() as Promise<User | undefined>;
    }
    async findByCredentials(params: ILoginDto): Promise<UserAuth> {
        const userKeys: (keyof User)[] = ['hash', 'salt'];
        const user = (await this.userAuthSql
            .clone()
            .addSelect(userKeys.map((k) => `u.${k}`))
            .where({ email: params.email })
            .getOne()) as UserAuth;
        if (!user || !compareHash(params.password, user.hash, user.salt)) {
            throw new RpcException(RpcCode.INVALID_ARGUMENT, 'Invalid username/password');
        }
        return user;
    }
    async changePassword(passwords: IUpdatePasswordDto, jwtData: JWT.TokenPayload): Promise<void> {
        const user = await this.userRepo.findOne({ id: jwtData.id });
        if (!user || !compareHash(passwords.currentPassword, user.hash, user.salt)) {
            throw new RpcException(RpcCode.INVALID_ARGUMENT, 'Invalid current password!');
        }
        const hashValues = geneHash(passwords.newPassword, randomInt(8, 12));
        await this.userRepo.update({ id: user.id }, hashValues);
        await this.terminateSessionsById(user.id);
    }

    async findById(where: JWT.TokenPayload, select: (keyof User)[] = ['id', 'userType']): Promise<JWT.TokenPayload> {
        const user = await this.userRepo.findOne({ select, where });

        if (!user) throw new NotFoundException('USER_NOT_FOUND');

        return user;
    }

    // async getData(where: JWT.TokenPayload): Promise<IUserUpdateDto> {
    //     const data = await this.userRepo.findOne({
    //         where,
    //     });
    //
    //     if (!data) throw new NotFoundException('RELOGIN');
    //
    //     return data;
    // }

    // async getBalance(where: JWT.TokenPayload): Promise<number> {
    //     const data = await this.userRepo.findOne({
    //         where,
    //     });
    //
    //     if (!data) throw new NotFoundException('RELOGIN');
    //
    //     return data;
    // }

    private async terminateSessionsById(userId: number): Promise<void> {
        await this.sessionRepo.delete({ user: { id: userId } });
    }

    async isAdmin(where: JWT.TokenPayload): Promise<boolean> {
        const res = await this.userRepo.count({ where });

        return !!res;
    }

    // async setBalance(id: number, balance: number | (() => string)): Promise<void> {
    //     await this.userRepo.update({ id }, { balance });
    // }

    // async removeBalance(id: number, amount: number): Promise<boolean> {
    //     const res = await this.userRepo.update(
    //         { id, balance: MoreThanOrEqual(amount) },
    //         { balance: () => `balance - ${amount}` }
    //     );
    //
    //     return !!res.affected;
    // }

    async getAllPartners(): Promise<PartnerEntity[]> {
        const allPartners = await this.partnerRepo.find();

        if (!allPartners) throw new NotFoundException('PARTNERS_NOT_FOUND');

        return allPartners;
    }

    async findPartnerById(
        where: IGetId,
        select: (keyof PartnerEntity)[] = ['username', 'email', 'phone', 'firstName', 'lastName']
    ): Promise<Partner> {
        const partner = await this.partnerRepo.findOne({ select, where });

        if (!partner) throw new NotFoundException('PARTNER_NOT_FOUND');

        return partner;
    }

    async findTransactionById(where: IGetId): Promise<IClientTransactions[]> {
        const transactions = await this.clientTransactionsRepo.find({ where });

        if (!transactions) throw new NotFoundException('TRANSACTIONS_NOT_FOUND');

        return transactions;
    }

    async addClientAccount(dto: IAddClientAccountDto): Promise<ClientAccount> {
        const account = new ClientAccount();

        this.clientAccountRepo.merge(account, dto);

        await this.clientAccountRepo.save(account);

        return account;
    }

    async getAllTransactions(): Promise<IClientTransactions[]> {
        const transactions = await this.clientTransactionsRepo.find();

        if (!transactions) throw new NotFoundException('TRANSACTIONS_NOT_FOUND');

        return transactions;
    }

    async getTransactionStatusById(
        where: { id: number },
        select: (keyof IClientTransactions)[] = ['status']
    ): Promise<IClientTransactions> {
        const transaction = await this.clientTransactionsRepo.findOne({ select, where });

        if (!transaction) throw new NotFoundException('TRANSACTIONS_NOT_FOUND');

        return transaction;
    }

    async addBalance(id: number, amount: number): Promise<IBalanceDto> {
        const partner = await this.partnerRepo.findOne({
            where: { id },
            select: ['balance'],
        });

        if (!partner) throw new BadRequestException('INVALID_ID');

        const balance = partner.balance + amount;
        await this.partnerRepo.save({ id, balance });

        return { balance };
    }

    async getBalance(id: number): Promise<number> {
        const partner = await this.partnerRepo.findOne({
            where: { id },
            select: ['balance'],
        });

        if (!partner) throw new BadRequestException('INVALID_ID');

        return partner.balance;
    }

    async updateTransactionStatus(
        dto: IUpdateTransactionStatusDto
        // select: (keyof IClientTransactions)[] = ['status']
    ): Promise<IClientTransactions | undefined> {
        const { id, status } = dto;

        return this.clientTransactionsRepo.save({ id, status });
    }
}
