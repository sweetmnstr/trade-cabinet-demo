import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from 'trade-cabinet-types';

@Entity('accountTypes')
export class AccountType implements AccountEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ length: 50, unique: true, type: 'varchar' }) name: string;
}
