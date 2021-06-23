import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length, IsNumber, IsPositive } from 'class-validator';
import { IUpdatePasswordDto, IUserUpdateDto, IBalanceDto, IAddBalanceDto } from 'trade-cabinet-types';

export class UpdatePasswordDto implements IUpdatePasswordDto {
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

export class UpdateEmailDto {
    @ApiProperty({ description: 'User email used for login', example: 'test@test.com' })
    @IsEmail()
    email: string;
}

export class UserUpdateDto implements IUserUpdateDto {
    @Length(1, 50)
    @IsOptional()
    @ApiPropertyOptional({ example: 'TestFirst', minLength: 1, maxLength: 50 })
    firstName?: string;

    @Length(1, 50)
    @IsOptional()
    @ApiPropertyOptional({ example: 'TestSecond', minLength: 1, maxLength: 50 })
    lastName?: string;

    @ApiPropertyOptional({
        example: '+79251231233',
        description: 'Phone number in international format',
    })
    @Length(1, 20)
    @IsOptional()
    phone?: string;
}

export class BalanceDto implements IBalanceDto {
    @ApiProperty({ example: 150.5 })
    balance: number;
}

export class AddBalanceDto implements IAddBalanceDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    @IsPositive()
    @IsNumber()
    id: number;

    @ApiProperty({ example: 100.5 })
    @IsNumber()
    amount: number;
}
