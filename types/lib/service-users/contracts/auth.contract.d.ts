import { ILoginDto, IRefreshTokenDto, ISignupDto } from '../../gateway-users';

export interface UsersAuthContract {
    signin(body: ILoginDto): Promise<JWT.RefreshTokenInfo>;
    refreshTokens(body: IRefreshTokenDto): Promise<JWT.RefreshTokenInfo>;
    signout(body: IRefreshTokenDto): Promise<ISuccessMessageResponse>;
    signup(body: ISignupDto): Promise<JWT.RefreshTokenInfo>;
}
