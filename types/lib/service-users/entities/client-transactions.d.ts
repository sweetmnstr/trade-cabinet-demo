import { PartnerEntity } from './partner';
import { ITransactionCard } from './transaction-card';
import { ITransactionBitcoin } from './transaction-bitcoin';
import { TransactionClientTypeEnum } from '../enums/transaction-client-type.enum';
import { TransactionClientStatusEnum } from '../enums/transaction-client-status.enum';

export interface IClientTransactions {
    id: number;

    partner: PartnerEntity;

    type: TransactionClientTypeEnum;

    status: TransactionClientStatusEnum;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    transactionBitcoin: ITransactionBitcoin;

    transactionCard: ITransactionCard;
}
