import { IBalanceDto, IUpdatePasswordDto, IUserUpdateDto, UsersUserContract } from 'trade-cabinet-types';
import { UsersClient } from '../client';
export declare class UsersUserProvider implements UsersUserContract {
    protected client: UsersClient;
    constructor(client: UsersClient);
    protected api<T extends keyof UsersUserContract, R extends ReturnType<UsersUserContract[T]>>(path: T, params?: object): R;
    updatePassword(body: IReqBody<IUpdatePasswordDto>): Promise<ISuccessMessageResponse>;
    updateUser(body: IReqBody<IUserUpdateDto>): Promise<ISuccessMessageResponse>;
    getMe(body: IReq): Promise<IUserUpdateDto>;
    getBalance(body: IReq): Promise<IBalanceDto>;
}
