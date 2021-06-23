export interface IUpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface IUpdateEmailDto {
    email: string;
}

export interface IUserUpdateDto {
    firstName?: string;

    lastName?: string;

    phone?: string;
}

export interface IBalanceDto {
    balance: number;
}

export interface IAddBalanceDto {
    id: number;
    amount: number;
}
