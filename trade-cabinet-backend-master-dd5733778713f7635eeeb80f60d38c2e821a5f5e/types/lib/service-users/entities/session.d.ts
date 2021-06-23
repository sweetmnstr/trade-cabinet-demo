import { UserEntity } from './user';

export class SessionEntity {
    id: number;

    refreshToken: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    user: UserEntity;
}
