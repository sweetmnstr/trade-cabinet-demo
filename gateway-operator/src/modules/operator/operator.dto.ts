import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Length } from 'class-validator';
import { TransactionClientStatusEnum } from 'trade-cabinet-types';

export class UpdatePasswordDto {
    @ApiProperty({
        minLength: 6,
        maxLength: 18,
    })
    @Length(6, 18)
    // oldPassword
    currentPassword: string;

    @ApiProperty({
        minLength: 6,
        maxLength: 18,
    })
    @Length(6, 18)
    newPassword: string;
}

export class BalanceDto {
    @ApiProperty({ example: 150.5 })
    balance: number;
}

export class AddBalanceDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    @IsPositive()
    @IsNumber()
    id: number;

    @ApiProperty({ example: 100.5 })
    @IsNumber()
    amount: number;
}
export class AddClientAccountDto {
    @ApiProperty({ example: 1 })
    @IsPositive()
    @IsNumber()
    externalId: number;
    accountNumber: number;
}

export class UpdateTransactionStatusDto {
    @ApiProperty({ example: 1 })
    @IsPositive()
    @IsNumber()
    id: number;
    status: TransactionClientStatusEnum;
}
