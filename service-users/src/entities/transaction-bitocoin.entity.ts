import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClientTransaction } from './client-transactions.entity';
import { TransactionBitcoinStateEnum } from '../enums/TransactionBitcoinState.enum';

@Entity('transactionBitcoins')
export class TransactionBitcoin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: TransactionBitcoinStateEnum,
    })
    state: TransactionBitcoinStateEnum;

    @Column()
    amount: number;

    @Column()
    receivingAddress: string;

    @Column()
    blockchainTransactionId: string;

    @Column()
    numConfirmations: number;

    @OneToOne(() => ClientTransaction, (clientTransaction: ClientTransaction) => clientTransaction.transactionBitcoin)
    clientTransaction: ClientTransaction;
}
