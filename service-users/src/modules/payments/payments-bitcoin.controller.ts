import { PaymentsBitcoinService } from './payments-bitcoin.service';
import { BitcoinWallet } from '../../entities/bitcoin-wallet.entity';
import { MSClass, MSMethod } from 'lib-rpc';
import { Partner } from '../../entities/partner.entity';
import { IGetId, UsersPaymentsBitcoinContract } from 'trade-cabinet-types';

@MSClass('payments-bitcoin')
export class PaymentsBitcoinController implements UsersPaymentsBitcoinContract {
    constructor(private readonly paymentsBitcoinService: PaymentsBitcoinService) {}

    @MSMethod()
    async getAllBitcoinWallets(): Promise<BitcoinWallet[]> {
        return await this.paymentsBitcoinService.getAllBitcoinWallets();
    }

    @MSMethod()
    async getBitcoinWalletById(body: IGetId): Promise<BitcoinWallet | undefined> {
        return await this.paymentsBitcoinService.getBitcoinWalletById(body);
    }

    @MSMethod()
    async createBitcoinWallet(partner: Partner): Promise<string | undefined> {
        return await this.paymentsBitcoinService.createBitcoinWallet(partner);
    }

    @MSMethod()
    async deleteBitcoinWallet(body: IGetId): Promise<ISuccessMessageResponse> {
        await this.paymentsBitcoinService.deleteBitcoinWallet(body);
        return { success: true };
    }

    @MSMethod()
    async createBitcoinTransaction(createBitcoinTransactionDTO: any): Promise<string> {
        return await this.paymentsBitcoinService.createBitcoinTransaction(createBitcoinTransactionDTO);
    }
}
