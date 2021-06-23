import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'trade-cabinet-types';
// import { decimalOptions } from '../lib/decorators/extended-entity.decorator';
import { AccountType } from './account-type.entity';
import { Session } from './session.entity';

export const UserTypeArray: JWT.UserType[] = ['user', 'banned', 'admin'];

@Entity('users')
export class User implements UserEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ length: 50, unique: true })
    email: string;

    @Column({ length: 56 })
    hash: string;

    @Column({ length: 50 })
    salt: string;

    /* @Column({ type: 'enum' })
    status: string; */

    @ManyToOne(() => AccountType, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: true })
    accountType?: AccountType;

    @OneToMany(() => Session, (session: Session) => session.user)
    sessions: Session[];

    @Column({ type: 'enum', enum: UserTypeArray })
    userType: JWT.UserType;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    readonly createdAt: Date;
}
