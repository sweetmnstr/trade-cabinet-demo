import { IBalanceDto, IUpdatePasswordDto, IUserUpdateDto, UsersUserContract } from 'trade-cabinet-types';
import { UsersClient } from '../client';

export class UsersUserProvider implements UsersUserContract {
    constructor(protected client: UsersClient) {}

    protected api<T extends keyof UsersUserContract, R extends ReturnType<UsersUserContract[T]>>(
        path: T,
        params?: object
    ): R {
        return this.client.request(`users.${path}`, params) as R;
    }
    // getFull(): Promise<UserEntity> {
    //     return this.api('getFull');
    // }
    //
    // updateFull(body: IReqBody<IUserUpdateDto>): Promise<ISuccessMessageResponse> {
    //     return this.api('updateFull', body);
    // }

    updatePassword(body: IReqBody<IUpdatePasswordDto>): Promise<ISuccessMessageResponse> {
        return this.api('updatePassword', body);
    }

    updateUser(body: IReqBody<IUserUpdateDto>): Promise<ISuccessMessageResponse> {
        return this.api('updateUser', body);
    }

    getMe(body: IReq): Promise<IUserUpdateDto> {
        return this.api('getMe', body);
    }
    getBalance(body: IReq): Promise<IBalanceDto> {
        return this.api('getBalance', body);
    }
    // getPublicKey(body: IGetId): Promise<string> {
    //     return this.api('getPublicKey', body);
    // }
}
