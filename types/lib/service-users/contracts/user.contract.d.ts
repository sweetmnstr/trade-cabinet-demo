import { IAddBalanceDto, IBalanceDto, IGetId, IUpdatePasswordDto, IUserUpdateDto } from '../../gateway-users';
import { UserEntity } from '../entities';

export interface UsersUserContract {
    // getFull(): Promise<UserEntity>;
    // updateFull(body: IReqBody<IUserUpdateDto>): Promise<ISuccessMessageResponse>;
    getMe(req: IReq): Promise<IUserUpdateDto | undefined>;
    getBalance(req: IReq): Promise<IBalanceDto>;
    updatePassword(data: IReqBody<IUpdatePasswordDto>): Promise<ISuccessMessageResponse>;
    updateUser(data: IReqBody<IUserUpdateDto>): Promise<ISuccessMessageResponse>;
    // getPublicKey(id: IGetId): Promise<string>;
}
