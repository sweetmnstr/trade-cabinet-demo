import { AccountEntity } from './account';

export interface UserEntity {
    id: number;

    email: string;

    hash: string;

    salt: string;

    accountType?: AccountEntity;

    userType: JWT.UserType;

    readonly createdAt: Date;
}
