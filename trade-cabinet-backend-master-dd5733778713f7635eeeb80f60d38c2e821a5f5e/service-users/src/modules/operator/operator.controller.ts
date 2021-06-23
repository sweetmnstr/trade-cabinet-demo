import { MSClass, MSMethod } from 'lib-rpc';
import { OperatorService } from './operator.service';
import {
    IAddClientAccountDto,
    IUpdateTransactionStatusDto,
    IClientAccount,
    IClientTransactions,
    IGetId,
    ResDto,
    OperatorContract,
    IUpdatePasswordDto,
    IBalanceDto,
    IAddBalanceDto,
} from 'trade-cabinet-types';
import { PartnerEntity } from 'trade-cabinet-types';

@MSClass('operator')
export class OperatorController implements OperatorContract {
    constructor(private readonly operatorService: OperatorService) {}

    @MSMethod()
    async updatePassword(body: IReqBody<IUpdatePasswordDto>): Promise<ResDto.SuccessMessageResponse> {
        await this.operatorService.changePassword(body.body, body.user);

        return { success: true, message: 'Password changed' };
    }

    @MSMethod()
    async updateTransactionStatus(body: IUpdateTransactionStatusDto): Promise<ResDto.SuccessMessageResponse> {
        await this.operatorService.updateTransactionStatus(body);

        return { success: true, message: 'Transaction Status changed' };
    }

    @MSMethod()
    async getAllPartners(): Promise<PartnerEntity[]> {
        return await this.operatorService.getAllPartners();
    }

    @MSMethod()
    async getPartner(body: IGetId): Promise<PartnerEntity> {
        return await this.operatorService.findPartnerById(body);
    }

    @MSMethod()
    async getClientsTransaction(body: IGetId): Promise<IClientTransactions[]> {
        return await this.operatorService.findTransactionById(body);
    }

    @MSMethod()
    async addClientsAccount(body: IAddClientAccountDto): Promise<IClientAccount> {
        return await this.operatorService.addClientAccount(body);
    }

    @MSMethod()
    async getAllTransactions(): Promise<IClientTransactions[]> {
        return await this.operatorService.getAllTransactions();
    }

    @MSMethod()
    async getTransactionStatusById(body: IGetId): Promise<IClientTransactions> {
        return await this.operatorService.getTransactionStatusById(body);
    }

    @MSMethod()
    async getBalance(body: IGetId): Promise<IBalanceDto> {
        const balance = await this.operatorService.getBalance(body.id);
        return { balance };
    }

    @MSMethod()
    async addBalance(body: IReqBody<IAddBalanceDto>): Promise<ISuccessMessageResponse> {
        const { id, amount } = body.body;

        await this.operatorService.addBalance(id, amount);

        return { success: true };
    }
}
