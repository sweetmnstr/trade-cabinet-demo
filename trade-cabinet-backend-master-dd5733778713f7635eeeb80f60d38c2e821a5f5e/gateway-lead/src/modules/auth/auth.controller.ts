import { Body, Controller, HttpCode, HttpStatus, NotImplementedException, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersAuthProvider } from 'lib-clients';
import { SuccessMessageResponse } from '../../common/responses/default.interfaces';
import { Public } from '../../lib/decorators/public-private.decorator';
import { RateLimited } from '../../lib/decorators/rate-limit.decorator';
import { RatelimitGuard } from '../../lib/guards/rate-limit.guard';
import { jwtAuth } from '../../lib/jwt';
import { LoginDto, RefreshTokenDto, SignupDto, TokenResponse } from './auth.dto';

@Controller('auth')
@Public()
@UseGuards(RatelimitGuard)
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly usersAuth: UsersAuthProvider) {}

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @RateLimited('signin')
    @ApiOperation({ summary: 'Authenticate user', description: 'Check response *Schema* for more details' })
    @ApiOkResponse({ type: TokenResponse })
    async signin(@Body() body: LoginDto): Promise<JWT.RefreshTokenRes> {
        const res = await this.usersAuth.signin(body);

        return jwtAuth.assignToken(res);
    }

    // IN-DEV
    // password/reset
    @Post('forget-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Sends email with token for password reset',
        description: 'This method isnt implemented due unknown state of mailer',
        deprecated: true,
    })
    forgetPasswordDeprecated(): never {
        throw new NotImplementedException('SOON');
    }

    /*     forgetPassword(
        @Body() { email }: ForgetPasswordDto
    ): Promise<SuccessMessageResponse> {
        const success = await this.usersAuth.forgetPassword(email);

        return { success, message: success ? 'Check your email' : 'Email not found' };
    } */

    @ApiOperation({
        summary: 'Get new *accessToken* by *refreshToken*',
        description: 'Check JWT expiration and refresh it by this method if needed',
    })
    @ApiOkResponse({ type: TokenResponse })
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @RateLimited('refreshToken')
    async refreshTokens(@Body() body: RefreshTokenDto): Promise<JWT.RefreshTokenRes> {
        const res = await this.usersAuth.refreshTokens(body);

        return jwtAuth.assignToken(res);
    }

    @Post('signout')
    @ApiOperation({
        summary: 'Check description',
        description: `Deletes *refreshToken*, dont forget to delete *accessToken* (due JWT lifetime) from client`,
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: SuccessMessageResponse })
    async signout(@Body() body: RefreshTokenDto): Promise<SuccessMessageResponse> {
        const res: SuccessMessageResponse = await this.usersAuth.signout(body);

        return res;
    }

    @Post('signup')
    @RateLimited('signin')
    @ApiOperation({
        summary: 'New user registration',
        description: 'Check example and schema',
    })
    @ApiOkResponse({ type: TokenResponse })
    async signup(@Body() body: SignupDto): Promise<JWT.RefreshTokenRes> {
        const res = await this.usersAuth.signup(body);

        return jwtAuth.assignToken(res);
    }
}
