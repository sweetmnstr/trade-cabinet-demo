import { IGetId, IUpdateTransactionStatusDto, PartnerEntity, IClientTransactions, IAddClientAccountDto, IClientAccount, ResDto, IUpdatePasswordDto, IAddBalanceDto, IBalanceDto } from 'trade-cabinet-types';
import { UsersClient } from '../client';
import { OperatorContract } from 'trade-cabinet-types';
import SuccessMessageResponse = ResDto.SuccessMessageResponse;
export declare class OperatorProvider implements OperatorContract {
    protected client: UsersClient;
    constructor(client: UsersClient);
    protected api<T extends keyof OperatorContract, R extends ReturnType<OperatorContract[T]>>(path: T, params?: object): R;
    updatePassword(body: IReqBody<IUpdatePasswordDto>): Promise<SuccessMessageResponse>;
    updateTransactionStatus(body: IUpdateTransactionStatusDto): Promise<SuccessMessageResponse>;
    getAllPartners(): Promise<PartnerEntity[]>;
    getPartner(body: IGetId): Promise<PartnerEntity>;
    getClientsTransaction(body: IGetId): Promise<IClientTransactions[]>;
    addClientsAccount(body: IAddClientAccountDto): Promise<IClientAccount>;
    getAllTransactions(): Promise<IClientTransactions[]>;
    getTransactionStatusById(body: IGetId): Promise<IClientTransactions>;
    getBalance(body: IGetId): Promise<IBalanceDto>;
    addBalance(body: IReqBody<IAddBalanceDto>): Promise<SuccessMessageResponse>;
}
