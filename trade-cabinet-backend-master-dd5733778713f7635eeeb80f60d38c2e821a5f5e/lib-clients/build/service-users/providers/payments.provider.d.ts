import { ICreateTransaction, UsersPaymentsContract, ITransactionCard, IGetId } from 'trade-cabinet-types';
import { UsersClient } from '../client';
export declare class UsersPaymentsProvider implements UsersPaymentsContract {
    protected client: UsersClient;
    constructor(client: UsersClient);
    protected api<T extends keyof UsersPaymentsContract, R extends ReturnType<UsersPaymentsContract[T]>>(path: T, params?: object): R;
    getAllCards(): Promise<ITransactionCard[]>;
    getCardById(body: IGetId): Promise<ITransactionCard>;
    createTransaction(body: ICreateTransaction): Promise<ISuccessMessageResponse>;
    deleteCard(body: IGetId): Promise<ISuccessMessageResponse>;
}
