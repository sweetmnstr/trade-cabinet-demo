import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lead } from './lead.entity';
import { ClientTransaction } from './client-transactions.entity';
import { BitcoinWallet } from './bitcoin-wallet.entity';

@Entity('partners')
export class Partner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 50 })
    lastName: string;

    @Column({ length: 50, unique: true })
    email: string;

    @Column({ length: 50 })
    password: string;

    @Column({ length: 50 })
    username: string;

    @Column({ length: 50 })
    phone: string;

    @Column({ length: 2 })
    languageCode: string;

    @Column()
    isTest: boolean;

    @Column()
    hasDeposited: boolean;

    @Column('int')
    balance: number;

    @Column()
    isVerified: boolean;

    @Column()
    isSuspended: boolean;

    @Column()
    statusName: string;

    @Column()
    statusGroupName: string;

    @Column()
    agentId: number;

    @Column({ length: 50 })
    agentName: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) readonly createdAt: Date;

    @OneToOne(() => Lead, (lead: Lead) => lead.partner, { cascade: true })
    lead: Lead;

    @OneToOne(() => ClientTransaction, (clientTransactions: ClientTransaction) => clientTransactions.partner, {
        cascade: true,
    })
    clientTransactions: ClientTransaction;

    @OneToOne(() => BitcoinWallet, (bitcoinWallet: BitcoinWallet) => bitcoinWallet.partner, { cascade: true })
    bitcoinWallet: BitcoinWallet;
}
