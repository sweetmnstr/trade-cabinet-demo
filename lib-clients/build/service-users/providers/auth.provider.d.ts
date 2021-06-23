import { ILoginDto, IRefreshTokenDto, ISignupDto, UsersAuthContract } from "trade-cabinet-types";
import { UsersClient } from "../client";
export declare class UsersAuthProvider implements UsersAuthContract {
    protected client: UsersClient;
    constructor(client: UsersClient);
    protected api<T extends keyof UsersAuthContract, R extends ReturnType<UsersAuthContract[T]>>(path: T, params?: object): R;
    signin(body: ILoginDto): Promise<JWT.RefreshTokenInfo>;
    refreshTokens(body: IRefreshTokenDto): Promise<JWT.RefreshTokenInfo>;
    signout(body: IRefreshTokenDto): Promise<ISuccessMessageResponse>;
    signup(body: ISignupDto): Promise<JWT.RefreshTokenInfo>;
}
