import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Partner } from './partner.entity';
import { TransactionClientStatusEnum } from '../enums/TransactionClientStatus.enum';
import { TransactionClientTypeEnum } from '../enums/TransactionClientType.enum';
import { TransactionBitcoin } from './transaction-bitocoin.entity';
import { TransactionCard } from './transaction-card.entity';

@Entity('clientTransactions')
export class ClientTransaction {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Partner)
    @JoinColumn({ name: 'externalId' })
    partner: Partner;

    @Column({ type: 'enum', enum: TransactionClientTypeEnum })
    type: TransactionClientTypeEnum;

    @Column({ type: 'enum', enum: TransactionClientStatusEnum, nullable: true })
    status: TransactionClientStatusEnum;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) readonly createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    readonly updatedAt: Date;

    @OneToOne(() => TransactionBitcoin, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    transactionBitcoin: TransactionBitcoin;

    @OneToOne(() => TransactionCard, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    transactionCard: TransactionCard;
}
