import { BadRequestException, Injectable } from '@nestjs/common';
import * as bitcoin from 'bitcoinjs-lib';
import * as assert from 'assert';
import { InjectRepository } from '@nestjs/typeorm';
import { BitcoinWallet } from '../../entities/bitcoin-wallet.entity';
import { Repository } from 'typeorm';
import { TransactionBitcoin } from '../../entities/transaction-bitocoin.entity';
import { TransactionBitcoinStateEnum } from '../../enums/TransactionBitcoinState.enum';
import { regtestUtils } from './_regtest';
import { Partner } from '../../entities/partner.entity';
import { IGetId } from 'trade-cabinet-types';

@Injectable()
export class PaymentsBitcoinService {
    // private readonly regtest = regtestUtils.network
    private readonly network = bitcoin.networks.bitcoin;

    constructor(
        @InjectRepository(BitcoinWallet) private readonly bitcoinRepo: Repository<BitcoinWallet>,
        @InjectRepository(TransactionBitcoin) private readonly transactionBitcoinRepo: Repository<TransactionBitcoin>
    ) {}

    async getAllBitcoinWallets(): Promise<BitcoinWallet[]> {
        return await this.bitcoinRepo.find();
    }

    async getBitcoinWalletById(body: IGetId): Promise<BitcoinWallet | undefined> {
        const { id } = body;
        return await this.bitcoinRepo.findOne(id);
    }

    async deleteBitcoinWallet(body: IGetId): Promise<void> {
        const { id } = body;
        await this.bitcoinRepo.delete(id);
    }

    async createBitcoinWallet(partner: Partner): Promise<string | undefined> {
        const { privateKey, publicKey } = bitcoin.ECPair.makeRandom();

        const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKey });

        const wallet = new BitcoinWallet();

        typeof address === 'string' ? (wallet.address = address) : (wallet.address = '');
        wallet.publicKey = publicKey.toString('hex');
        typeof privateKey?.toString('hex') === 'string'
            ? (wallet.privateKey = privateKey?.toString('hex'))
            : (wallet.privateKey = '');

        wallet.partner = partner;

        await this.bitcoinRepo.save(wallet);

        return address;
    }

    async getWallet(body: IGetId): Promise<BitcoinWallet | undefined> {
        const { id } = body;

        const res = await this.bitcoinRepo.findOne({
            where: {
                id,
            },
        });

        return res;
    }

    async createBitcoinTransaction(createBitcoinTransactionDTO: any) {
        const { externalId, amount, receivingAddress, numConfirmations } = createBitcoinTransactionDTO;
        const inputAmount = await this.getSuitableInputAmount(externalId, amount);
        const p2wsh = this.createPayment('p2wsh-p2pk');
        const inputData = await this.getInputData(inputAmount, p2wsh.payment, 'p2wsh');

        {
            const {
                hash,
                index,
                witnessUtxo,
                witnessScript, // NEW: A Buffer of the witnessScript
            } = inputData;
            assert.deepStrictEqual({ hash, index, witnessUtxo, witnessScript }, inputData);
        }

        const psbt = new bitcoin.Psbt({ network: this.network })
            .addInput(inputData)
            .addOutput({
                address: receivingAddress,
                value: amount,
            })
            .addOutput({
                address: p2wsh.payment.address,
                value: inputAmount - amount,
            })
            .signInput(0, p2wsh.keys[0]);

        assert.strictEqual(psbt.validateSignaturesOfInput(0), true);
        psbt.finalizeAllInputs();

        const tx = psbt.extractTransaction();

        // build and broadcast to the Bitcoin RegTest network
        await regtestUtils.broadcast(tx.toHex());

        await regtestUtils.verify({
            txId: tx.getId(),
            address: receivingAddress,
            vout: 0,
            value: amount,
        });

        const transactionBitcoin = new TransactionBitcoin();

        transactionBitcoin.state = TransactionBitcoinStateEnum.Init;
        transactionBitcoin.amount = amount;
        transactionBitcoin.receivingAddress = receivingAddress;
        transactionBitcoin.blockchainTransactionId = tx.getId();
        transactionBitcoin.numConfirmations = numConfirmations;

        return tx.getId();
    }

    createPayment(_type: string, myKeys?: any[]): any {
        const network = this.network;
        const splitType = _type.split('-').reverse();
        const isMultisig = splitType[0].slice(0, 4) === 'p2ms';
        const keys = myKeys || [];
        let m: number | undefined;
        if (isMultisig) {
            const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/);
            m = parseInt(match![1], 10);
            let n = parseInt(match![2], 10);
            if (keys.length > 0 && keys.length !== n) {
                throw new Error('Need n keys for multisig');
            }
            while (!myKeys && n > 1) {
                keys.push(bitcoin.ECPair.makeRandom({ network }));
                n--;
            }
        }
        if (!myKeys) keys.push(bitcoin.ECPair.makeRandom({ network }));

        let payment: any;
        splitType.forEach((type) => {
            if (type.slice(0, 4) === 'p2ms') {
                payment = bitcoin.payments.p2ms({
                    m,
                    pubkeys: keys.map((key) => key.publicKey).sort((a, b) => a.compare(b)),
                    network,
                });
            } else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
                payment = (bitcoin.payments as any)[type]({
                    redeem: payment,
                    network,
                });
            } else {
                payment = (bitcoin.payments as any)[type]({
                    pubkey: keys[0].publicKey,
                    network,
                });
            }
        });

        return {
            payment,
            keys,
        };
    }

    async getInputData(amount: number, payment: any, redeemType: string): Promise<any> {
        const unspent = await regtestUtils.faucetComplex(payment.output, amount);
        const utx = await regtestUtils.fetch(unspent.txId);
        // for segwit inputs, you only need the output script and value as an object.
        const witnessUtxo = this.getWitnessUtxo(utx.outs[unspent.vout]);
        const mixin = { witnessUtxo };
        const mixin2: any = {};
        switch (redeemType) {
            case 'p2wsh':
                mixin2.witnessScript = payment.redeem.output;
                break;
        }
        return {
            hash: unspent.txId,
            index: unspent.vout,
            ...mixin,
            ...mixin2,
        };
    }

    getWitnessUtxo(out: any): any {
        delete out.address;
        out.script = Buffer.from(out.script, 'hex');
        return out;
    }

    async getSuitableInputAmount(externalId: number, amount: number): Promise<number> {
        const allTransactions = await this.transactionBitcoinRepo.find({
            where: {
                externalId,
            },
        });

        let suitable = false;

        const transactionAmount = allTransactions.reduce((acc, current): number => {
            if (acc >= amount) {
                suitable = true;
                return acc;
            }

            return acc + current.amount;
        }, 0);

        if (!suitable) throw new BadRequestException('INVALID_CREDENTIALS');

        return transactionAmount;
    }
}
