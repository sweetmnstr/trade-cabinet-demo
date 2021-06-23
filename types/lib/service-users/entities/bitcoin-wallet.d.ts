import { PartnerEntity } from './partner';

export interface IBitcoinWallet {
    id: number;

    partner: PartnerEntity;

    address: string;

    publicKey: string;

    privateKey: string;

    createdAt: Date;

    updatedAt: Date;
}
