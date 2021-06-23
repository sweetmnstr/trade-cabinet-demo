import UserType = JWT.UserType;

export interface ILoginDto {
    email: string;
    password: string;
}

export interface ILoginOperator {
    loginDTO: ILoginDto;

    userType: any;
}

export interface ISignupDto extends ILoginDto {
    firstName: string;

    lastName: string;

    phone: string;
}

export interface IRefreshTokenDto {
    refreshToken: string;
}

export interface ITokenResponse {
    refreshToken: string;

    accessToken: string;

    expiredAt: number;
}
