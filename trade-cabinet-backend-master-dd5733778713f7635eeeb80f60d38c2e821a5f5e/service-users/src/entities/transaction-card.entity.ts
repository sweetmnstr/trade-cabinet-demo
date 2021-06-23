import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClientTransaction } from './client-transactions.entity';
import { TransactionCardStateEnum } from '../enums/TransactionCardState.enum';

@Entity('transactionCards')
export class TransactionCard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: TransactionCardStateEnum })
    state: TransactionCardStateEnum;

    @Column('float')
    amount: number;

    @Column()
    cardNumber: string;

    @Column()
    expirationDate: string;

    @Column()
    cvv: string;

    @Column({ length: 50 })
    cardHolder: string;

    @Column()
    authCode: string;

    @OneToOne(() => ClientTransaction, (clientTransaction: ClientTransaction) => clientTransaction.transactionCard)
    clientTransaction: ClientTransaction;
}
