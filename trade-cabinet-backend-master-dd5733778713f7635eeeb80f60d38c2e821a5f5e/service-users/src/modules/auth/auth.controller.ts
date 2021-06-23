import { MSClass, MSMethod, RpcCode, RpcException } from 'lib-rpc';
import { ILoginDto, ILoginOperator, IRefreshTokenDto, ISignupDto, UsersAuthContract } from 'trade-cabinet-types';
import { AuthService } from './auth.service';

@MSClass('auth')
export class AuthController implements UsersAuthContract {
    constructor(private readonly authService: AuthService) {}

    @MSMethod()
    signin(body: ILoginDto): Promise<JWT.RefreshTokenInfo> {
        return this.authService.login(body);
    }

    @MSMethod()
    signinOperator(body: ILoginOperator): Promise<JWT.RefreshTokenInfo> {
        return this.authService.loginOperator(body);
    }

    @MSMethod()
    refreshTokens({ refreshToken }: IRefreshTokenDto): Promise<JWT.RefreshTokenInfo> {
        return this.authService.refreshTokens(refreshToken);
    }

    @MSMethod()
    async signout(body: IRefreshTokenDto): Promise<ISuccessMessageResponse> {
        const success = await this.authService.logout(body.refreshToken);

        return { message: success ? 'Logged out' : 'Token not found', success };
    }

    private handleSignupError(err: Error): never {
        if (err instanceof Error) {
            if (typeof err.message === 'string' && err.message.includes('email is already registered')) {
                throw new RpcException(RpcCode.ALREADY_EXISTS, 'Already registered in platform');
            }
        }

        throw err;
    }

    @MSMethod()
    async signup(body: ISignupDto): Promise<JWT.RefreshTokenInfo> {
        const res = await this.authService.signup(body).catch((err) => this.handleSignupError(err));

        return res;
    }
}
