import { IBitcoinWallet } from '../entities';
import { PartnerEntity } from '../entities';
import { IGetId } from '../../gateway-users';

export interface UsersPaymentsBitcoinContract {
    getAllBitcoinWallets(): Promise<IBitcoinWallet[]>;
    getBitcoinWalletById(id: IGetId): Promise<IBitcoinWallet | undefined>;
    createBitcoinWallet(id: PartnerEntity): Promise<string | undefined>;
    deleteBitcoinWallet(id: IGetId): Promise<ISuccessMessageResponse>;
    createBitcoinTransaction(createBitcoinTransactionDTO: any): Promise<string>;
}
