import { IAddClientAccountDto, IUpdateTransactionStatusDto } from '../../gateway-operator';
import { IClientAccount, IClientTransactions, PartnerEntity } from '../entities';
import { IAddBalanceDto, IBalanceDto, IGetId, IUpdatePasswordDto } from '../../gateway-users';
import { ResDto } from '../../core';
import SuccessMessageResponse = ResDto.SuccessMessageResponse;

export interface OperatorContract {
    addBalance(body: IReqBody<IAddBalanceDto>): Promise<ISuccessMessageResponse>;
    getBalance(body: IGetId): Promise<IBalanceDto>;
    updatePassword(body: IReqBody<IUpdatePasswordDto>): Promise<SuccessMessageResponse>;
    updateTransactionStatus(body: IUpdateTransactionStatusDto): Promise<SuccessMessageResponse>;
    getAllPartners(): Promise<PartnerEntity[]>;
    getPartner(body: IGetId): Promise<PartnerEntity>;
    getClientsTransaction(body: IGetId): Promise<IClientTransactions[]>;
    addClientsAccount(body: IAddClientAccountDto): Promise<IClientAccount>;
    getAllTransactions(): Promise<IClientTransactions[]>;
    getTransactionStatusById(body: IGetId): Promise<IClientTransactions>;
}
