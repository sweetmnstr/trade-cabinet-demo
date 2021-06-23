import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionClientTypeEnum } from '../enums/TransactionClientType.enum';

@Entity('paymentTypes')
export class PaymentType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: TransactionClientTypeEnum })
    type: TransactionClientTypeEnum;
}
