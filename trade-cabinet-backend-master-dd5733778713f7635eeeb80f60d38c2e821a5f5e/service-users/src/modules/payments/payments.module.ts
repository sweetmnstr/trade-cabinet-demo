import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsBitcoinService } from './payments-bitcoin.service';
import { PaymentsController } from './payments.controller';
import { PaymentsBitcoinController } from './payments-bitcoin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientTransaction } from '../../entities/client-transactions.entity';
import { Partner } from '../../entities/partner.entity';
import { TransactionCard } from '../../entities/transaction-card.entity';
import { TransactionBitcoin } from '../../entities/transaction-bitocoin.entity';
import { BitcoinWallet } from '../../entities/bitcoin-wallet.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionCard, ClientTransaction, Partner, TransactionBitcoin, BitcoinWallet]),
    ],
    providers: [PaymentsService, PaymentsBitcoinService],
    controllers: [PaymentsController, PaymentsBitcoinController],
})
export class PaymentsModule {}
