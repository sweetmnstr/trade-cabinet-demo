import { PaymentsService } from './payments.service';
import { TransactionCard } from '../../entities/transaction-card.entity';
import { MSClass, MSMethod } from 'lib-rpc';
import { ICreateTransaction, IGetId, UsersPaymentsContract } from 'trade-cabinet-types';

@MSClass('payments')
export class PaymentsController implements UsersPaymentsContract {
    constructor(private readonly paymentsService: PaymentsService) {}

    @MSMethod()
    async getAllCards(): Promise<TransactionCard[]> {
        return await this.paymentsService.getAllCards();
    }

    @MSMethod()
    async getCardById(body: IGetId): Promise<TransactionCard> {
        return await this.paymentsService.getCardById(body);
    }

    @MSMethod()
    async createTransaction(createTransactionDTO: ICreateTransaction): Promise<ISuccessMessageResponse> {
        await this.paymentsService.createTransaction(createTransactionDTO);
        return { success: true };
    }

    @MSMethod()
    async deleteCard(body: IGetId): Promise<ISuccessMessageResponse> {
        await this.paymentsService.deleteCard(body);
        return { success: true };
    }
}
