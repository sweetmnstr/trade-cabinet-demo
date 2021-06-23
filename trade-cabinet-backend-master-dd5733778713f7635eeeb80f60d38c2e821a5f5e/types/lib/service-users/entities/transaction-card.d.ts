import { TransactionCardStateEnum } from '../enums/transaction-card-state.enum';

export interface ITransactionCard {
    id: number;

    state: TransactionCardStateEnum;

    amount: number;

    cardNumber: string;

    expirationDate: string;

    cvv: string;

    cardHolder: string;

    authCode: string;
}
