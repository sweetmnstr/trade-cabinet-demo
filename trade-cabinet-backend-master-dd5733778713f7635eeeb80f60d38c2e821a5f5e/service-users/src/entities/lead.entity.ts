import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Partner } from './partner.entity';
import { decimalOptions } from '../lib/decorators/extended-entity.decorator';

@Entity('leads')
export class Lead {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Partner)
    @JoinColumn({ name: 'externalId' })
    partner: Partner;

    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 50 })
    lastName: string;

    @Column({ length: 50 })
    phone: string;

    @Column(decimalOptions)
    balance: number;

    @Column()
    sourceId: number;
}
