import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { SessionEntity } from 'trade-cabinet-types';
import { User } from './user.entity';

@Entity('sessions')
export class Session implements SessionEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ length: 36 })
    refreshToken: string;

    @Column('timestamp') expiredAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) readonly createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    readonly updatedAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
    user: User;
}
