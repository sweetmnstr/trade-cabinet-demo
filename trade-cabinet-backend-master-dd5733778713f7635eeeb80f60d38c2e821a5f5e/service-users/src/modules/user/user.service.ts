import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcCode, RpcException } from 'lib-rpc';
import { IUpdatePasswordDto, IUserUpdateDto, PartnerEntity, UserEntity } from 'trade-cabinet-types';
import { DeepPartial, Repository } from 'typeorm';
import { Partner } from '../../entities/partner.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(Partner) private readonly partnerRepo: Repository<Partner>) {}

    private notUniqueEmail(): never {
        throw new RpcException(RpcCode.ALREADY_EXISTS, 'Already registered');
    }

    async checkUniqueEmail(email: string): Promise<void> {
        const oldUser = await this.partnerRepo.count({ email });

        if (oldUser) this.notUniqueEmail();
    }

    async create(params: DeepPartial<UserEntity>): Promise<PartnerEntity> {
        const partner = this.partnerRepo.create(params);
        await this.partnerRepo.save(partner);

        return partner;
    }

    async changePassword(passwords: IUpdatePasswordDto, jwtData: JWT.TokenPayload): Promise<void> {
        const { currentPassword, newPassword } = passwords;
        const { id } = jwtData;
        const partner = await this.partnerRepo.findOne(id);

        if (!partner) throw new BadRequestException('INCORRECT_ID');
        if (currentPassword !== partner.password) throw new BadRequestException('INCORRECT_PASSWORD');

        await this.partnerRepo.save({ id, newPassword });
    }

    async updateUser(body: IUserUpdateDto, id: number): Promise<Partner> {
        return await this.partnerRepo.save({ id, body });
    }

    async getMe(req: IReq): Promise<IUserUpdateDto | undefined> {
        const { id } = req.user;

        return await this.partnerRepo.findOne({
            where: { id },
            select: ['firstName', 'lastName', 'phone'],
        });
    }

    async getBalance(id: number): Promise<number> {
        const partner = await this.partnerRepo.findOne({
            where: { id },
            select: ['balance'],
        });

        if (!partner) throw new BadRequestException('INVALID_ID');

        return partner.balance;
    }
}
