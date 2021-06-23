import { Injectable } from "@nestjs/common";
import { ILoginDto, IRefreshTokenDto, ISignupDto, UsersAuthContract } from "trade-cabinet-types";
import { UsersClient } from "../client";

@Injectable()
export class UsersAuthProvider implements UsersAuthContract {
    constructor(protected client: UsersClient) {}

    protected api<T extends keyof UsersAuthContract, R extends ReturnType<UsersAuthContract[T]>>(
        path: T,
        params?: object
    ): R {
        return this.client.request(`auth.${path}`, params) as R;
    }

    signin(body: ILoginDto): Promise<JWT.RefreshTokenInfo> {
        return this.api("signin", body);
    }
    refreshTokens(body: IRefreshTokenDto): Promise<JWT.RefreshTokenInfo> {
        return this.api("refreshTokens", body);
    }
    signout(body: IRefreshTokenDto): Promise<ISuccessMessageResponse> {
        return this.api("signout", body);
    }
    signup(body: ISignupDto): Promise<JWT.RefreshTokenInfo> {
        return this.api("signup", body);
    }
}
