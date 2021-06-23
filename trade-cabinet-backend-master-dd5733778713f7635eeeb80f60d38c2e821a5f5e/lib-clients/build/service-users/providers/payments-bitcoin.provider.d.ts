import { IGetId, PartnerEntity, UsersPaymentsBitcoinContract } from 'trade-cabinet-types';
import { UsersClient } from '../client';
import { IBitcoinWallet } from 'trade-cabinet-types/lib/service-users/entities/bitcoin-wallet';
export declare class UsersPaymentsBitcoinProvider implements UsersPaymentsBitcoinContract {
    protected client: UsersClient;
    constructor(client: UsersClient);
    protected api<T extends keyof UsersPaymentsBitcoinContract, R extends ReturnType<UsersPaymentsBitcoinContract[T]>>(path: T, params?: object): R;
    getAllBitcoinWallets(): Promise<IBitcoinWallet[]>;
    getBitcoinWalletById(body: IGetId): Promise<IBitcoinWallet | undefined>;
    createBitcoinWallet(partner: PartnerEntity): Promise<string | undefined>;
    deleteBitcoinWallet(body: IGetId): Promise<ISuccessMessageResponse>;
    createBitcoinTransaction(body: any): Promise<string>;
}
