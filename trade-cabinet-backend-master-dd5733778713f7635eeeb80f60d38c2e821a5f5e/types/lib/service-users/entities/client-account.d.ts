import { PartnerEntity } from './partner';

export interface IClientAccount {
    id: number;

    partner: PartnerEntity;

    accountNumber: number;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}
