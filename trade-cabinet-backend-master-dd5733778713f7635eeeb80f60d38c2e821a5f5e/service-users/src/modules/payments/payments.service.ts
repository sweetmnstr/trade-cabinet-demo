import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientTransaction } from '../../entities/client-transactions.entity';
import { Repository } from 'typeorm';
import { TransactionCardStateEnum } from '../../enums/TransactionCardState.enum';
import { TransactionCard } from '../../entities/transaction-card.entity';
import { TransactionClientTypeEnum } from '../../enums/TransactionClientType.enum';
import { TransactionClientStatusEnum } from '../../enums/TransactionClientStatus.enum';
import { ICreateTransaction, IGetId } from 'trade-cabinet-types';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(TransactionCard) private readonly transactionCardRepo: Repository<TransactionCard>,
        @InjectRepository(ClientTransaction) private readonly clientTransactionsRepo: Repository<ClientTransaction>
    ) {}

    async getAllCards(): Promise<TransactionCard[]> {
        const cards = await this.transactionCardRepo.find();

        if (!cards) throw new NotFoundException('CARDS_NOT_FOUND');

        return cards;
    }

    async getCardById(body: IGetId): Promise<TransactionCard> {
        const { id } = body;

        const card = await this.transactionCardRepo.findOne({ id });

        if (!card) throw new NotFoundException('CARD_NOT_FOUND');

        return card;
    }

    async deleteCard(body: IGetId): Promise<void> {
        const { id } = body;

        await this.transactionCardRepo.delete(id);
    }

    async createTransaction(cardInfoDTO: ICreateTransaction): Promise<void> {
        const { amount, cardNumber, expirationDate, cvv, cardHolder, authCode } = cardInfoDTO;

        const transactionCard = new TransactionCard();
        transactionCard.state = TransactionCardStateEnum.Init;
        transactionCard.amount = amount;
        transactionCard.cardHolder = cardHolder;
        transactionCard.cardNumber = cardNumber;
        transactionCard.expirationDate = expirationDate;
        transactionCard.cvv = cvv;
        transactionCard.authCode = authCode;

        const clientTransaction = new ClientTransaction();
        clientTransaction.type = TransactionClientTypeEnum.Card;
        clientTransaction.status = TransactionClientStatusEnum.Pending;
        clientTransaction.transactionCard = transactionCard;

        await this.clientTransactionsRepo.save(clientTransaction);
    }
}
