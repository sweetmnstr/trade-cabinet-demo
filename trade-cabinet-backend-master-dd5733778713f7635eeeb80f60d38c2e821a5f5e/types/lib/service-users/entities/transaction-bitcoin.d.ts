import { TransactionBitcoinStateEnum } from '../enums';

export interface ITransactionBitcoin {
    id: number;

    state: TransactionBitcoinStateEnum;

    amount: number;

    receivingAddress: string;

    blockchainTransactionId: string;

    numConfirmations: number;
}
