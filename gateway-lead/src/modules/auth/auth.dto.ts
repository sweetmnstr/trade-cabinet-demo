import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID, Length } from 'class-validator';
import { ILoginDto, ISignupDto, IRefreshTokenDto, ITokenResponse } from 'trade-cabinet-types';
import { ToPhone } from '../../lib/decorators/transformers.decorator';

export class LoginDto implements ILoginDto {
    @ApiProperty({ example: 'test@test.com', description: 'Should be valid email with @ and domain' })
    @IsEmail()
    email: string;

    @ApiProperty({
        minLength: 6,
        maxLength: 18,
        example: '123456',
        description: 'There is no special validation, only min/max length',
    })
    @Length(6, 18)
    password: string;
}

export class SignupDto extends LoginDto implements ISignupDto {
    @ApiProperty({ example: 'Testname' })
    @Length(1, 25)
    firstName: string;

    @ApiProperty({ example: 'Testlast' })
    @Length(1, 25)
    lastName: string;

    @ApiProperty({ example: '+14158586273', description: 'Required to be in e164 format, check it before request' })
    @ToPhone
    @Length(1, 20)
    phone: string;
}

export class RefreshTokenDto implements IRefreshTokenDto {
    @ApiProperty()
    @IsUUID()
    refreshToken: string;

    // @IsNotEmpty()
    // fingerprint: string;
}

export class TokenResponse implements ITokenResponse {
    @ApiProperty({
        description: 'UUIDv4 user session, deletes 1st token after limit reached, jwt is alive anyway before expire',
        example: '3a124fa4-9de4-4bd6-b90a-b54d7fe97afd',
    })
    refreshToken: string;

    @ApiProperty({
        description: "Bearer token (JWT) stores inside user's id and type (admin | user) and expire date",
        example: 'xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxx',
    })
    accessToken: string;

    @ApiProperty({
        description: 'Unix timestamp of refreshToken life, before this date you should use /refresh-token method',
        example: 1601810548,
    })
    expiredAt: number;
}
