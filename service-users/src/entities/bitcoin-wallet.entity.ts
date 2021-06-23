import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Partner } from './partner.entity';

@Entity('bitcoinWallets')
export class BitcoinWallet {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Partner)
    @JoinColumn({ name: 'externalId' })
    partner: Partner;

    @Column()
    address: string;

    @Column()
    publicKey: string;

    @Column()
    privateKey: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) readonly createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    readonly updatedAt: Date;
}
