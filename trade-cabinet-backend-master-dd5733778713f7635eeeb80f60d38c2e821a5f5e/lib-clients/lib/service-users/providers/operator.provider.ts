import { Injectable } from '@nestjs/common';
import {
    IGetId,
    IUpdateTransactionStatusDto,
    PartnerEntity,
    IClientTransactions,
    IAddClientAccountDto,
    IClientAccount,
    ResDto,
    IUpdatePasswordDto,
    IAddBalanceDto,
    IBalanceDto,
} from 'trade-cabinet-types';
import { UsersClient } from '../client';
import { OperatorContract } from 'trade-cabinet-types';
import SuccessMessageResponse = ResDto.SuccessMessageResponse;

@Injectable()
export class OperatorProvider implements OperatorContract {
    constructor(protected client: UsersClient) {}

    protected api<T extends keyof OperatorContract, R extends ReturnType<OperatorContract[T]>>(
        path: T,
        params?: object
    ): R {
        return this.client.request(`operator.${path}`, params) as R;
    }
    updatePassword(body: IReqBody<IUpdatePasswordDto>): Promise<SuccessMessageResponse> {
        return this.api('updatePassword', body);
    }
    updateTransactionStatus(body: IUpdateTransactionStatusDto): Promise<SuccessMessageResponse> {
        return this.api('updateTransactionStatus', body);
    }
    getAllPartners(): Promise<PartnerEntity[]> {
        return this.api('getAllPartners');
    }
    getPartner(body: IGetId): Promise<PartnerEntity> {
        return this.api('getPartner', body);
    }
    getClientsTransaction(body: IGetId): Promise<IClientTransactions[]> {
        return this.api('getClientsTransaction', body);
    }
    addClientsAccount(body: IAddClientAccountDto): Promise<IClientAccount> {
        return this.api('addClientsAccount', body);
    }
    getAllTransactions(): Promise<IClientTransactions[]> {
        return this.api('getAllTransactions');
    }
    getTransactionStatusById(body: IGetId): Promise<IClientTransactions> {
        return this.api('getTransactionStatusById', body);
    }

    getBalance(body: IGetId): Promise<IBalanceDto> {
        return this.api('getBalance', body);
    }

    addBalance(body: IReqBody<IAddBalanceDto>): Promise<SuccessMessageResponse> {
        return this.api('addBalance', body);
    }
}
