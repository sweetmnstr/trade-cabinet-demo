import { ITransactionCard } from '../entities';
import { ICreateTransaction, IGetId } from '../../gateway-users';

export interface UsersPaymentsContract {
    getAllCards(): Promise<ITransactionCard[]>;
    getCardById(body: IGetId): Promise<ITransactionCard>;
    createTransaction(body: ICreateTransaction): Promise<ISuccessMessageResponse>;
    deleteCard(body: IGetId): Promise<ISuccessMessageResponse>;
}
