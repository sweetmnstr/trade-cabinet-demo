import { IGetId, PartnerEntity, UsersPaymentsBitcoinContract } from 'trade-cabinet-types';
import { UsersClient } from '../client';
import { IBitcoinWallet } from 'trade-cabinet-types/lib/service-users/entities/bitcoin-wallet';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersPaymentsBitcoinProvider implements UsersPaymentsBitcoinContract {
    constructor(protected client: UsersClient) {}

    protected api<T extends keyof UsersPaymentsBitcoinContract, R extends ReturnType<UsersPaymentsBitcoinContract[T]>>(
        path: T,
        params?: object
    ): R {
        return this.client.request(`payments.${path}`, params) as R;
    }

    getAllBitcoinWallets(): Promise<IBitcoinWallet[]> {
        return this.api('getAllBitcoinWallets');
    }
    getBitcoinWalletById(body: IGetId): Promise<IBitcoinWallet | undefined> {
        return this.api('getBitcoinWalletById');
    }
    createBitcoinWallet(partner: PartnerEntity): Promise<string | undefined> {
        return this.api('createBitcoinWallet');
    }

    deleteBitcoinWallet(body: IGetId): Promise<ISuccessMessageResponse> {
        return this.api('deleteBitcoinWallet');
    }
    createBitcoinTransaction(body: any): Promise<string> {
        return this.api('createBitcoinTransaction', body);
    }
}
