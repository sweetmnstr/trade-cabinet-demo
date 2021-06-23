import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Partner } from './partner.entity';

@Entity('clientAccounts')
export class ClientAccount {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Partner)
    @JoinColumn({ name: 'externalId' })
    partner: Partner;

    @Column()
    accountNumber: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) readonly createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    readonly updatedAt: Date;
}
