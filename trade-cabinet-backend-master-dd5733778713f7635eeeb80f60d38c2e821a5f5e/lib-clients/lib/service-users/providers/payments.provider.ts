import { Injectable } from '@nestjs/common';
import { ICreateTransaction, UsersPaymentsContract, ITransactionCard, IGetId } from 'trade-cabinet-types';
import { UsersClient } from '../client';

@Injectable()
export class UsersPaymentsProvider implements UsersPaymentsContract {
    constructor(protected client: UsersClient) {}

    protected api<T extends keyof UsersPaymentsContract, R extends ReturnType<UsersPaymentsContract[T]>>(
        path: T,
        params?: object
    ): R {
        return this.client.request(`payments.${path}`, params) as R;
    }

    getAllCards(): Promise<ITransactionCard[]> {
        return this.api('getAllCards');
    }
    getCardById(body: IGetId): Promise<ITransactionCard> {
        return this.api('getCardById', body);
    }
    createTransaction(body: ICreateTransaction): Promise<ISuccessMessageResponse> {
        return this.api('createTransaction', body);
    }
    deleteCard(body: IGetId): Promise<ISuccessMessageResponse> {
        return this.api('deleteCard', body);
    }
}
