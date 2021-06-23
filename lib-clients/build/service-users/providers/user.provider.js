"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersUserProvider = void 0;
class UsersUserProvider {
    constructor(client) {
        this.client = client;
    }
    api(path, params) {
        return this.client.request(`users.${path}`, params);
    }
    // getFull(): Promise<UserEntity> {
    //     return this.api('getFull');
    // }
    //
    // updateFull(body: IReqBody<IUserUpdateDto>): Promise<ISuccessMessageResponse> {
    //     return this.api('updateFull', body);
    // }
    updatePassword(body) {
        return this.api('updatePassword', body);
    }
    updateUser(body) {
        return this.api('updateUser', body);
    }
    getMe(body) {
        return this.api('getMe', body);
    }
    getBalance(body) {
        return this.api('getBalance', body);
    }
}
exports.UsersUserProvider = UsersUserProvider;
