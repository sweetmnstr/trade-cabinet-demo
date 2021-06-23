import { MSClass, MSMethod } from 'lib-rpc';
import { IBalanceDto, IUpdatePasswordDto, IUserUpdateDto, UsersUserContract } from 'trade-cabinet-types';
import { UserService } from './user.service';

@MSClass('users')
export class UserController implements UsersUserContract {
    constructor(private readonly userService: UserService) {}

    // @MSMethod()
    // async getFull({ req }): Promise<UserEntity> {
    //     const { id } = req.user;
    //     return this.userService.getFull(id);
    // }

    @MSMethod()
    async updateUser({ body, user }: IReqBody<IUserUpdateDto>): Promise<ISuccessMessageResponse> {
        const { id } = user;
        //const res =
        await this.userService.updateUser(body, id);

        return { success: true };
    }

    @MSMethod()
    async updatePassword({ body, user }: IReqBody<IUpdatePasswordDto>): Promise<ISuccessMessageResponse> {
        await this.userService.changePassword(body, user);
        //await this.actionService.create(req.user.id, 'UPD:PASS', req.realIp);

        return { success: true };
    }

    @MSMethod()
    async getMe(req: IReq): Promise<IUserUpdateDto | undefined> {
        return await this.userService.getMe(req);
    }

    @MSMethod()
    async getBalance(req: IReq): Promise<IBalanceDto> {
        const balance = await this.userService.getBalance(req.user.id);
        return { balance };
    }

    // @MSMethod()
    // async getPublicKey(body: IGetId): Promise<string> {
    //     return await this.userService.getPublicKey(body);
    // }
}
