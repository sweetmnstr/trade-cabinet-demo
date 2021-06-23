declare namespace Express {
    interface Request {
        user: JWT.TokenPayload;
        realIp: string;
    }
}

declare namespace JWT {
    type UserType = 'user' | 'banned' | 'admin';

    interface TokenPayload {
        id: number;
        userType: UserType;
    }

    interface ResetPassToken {
        email: string;
    }

    interface TokenDecoded<T> {
        exp: number;
        iat: number;
        sub: string;
        data: T;
    }

    interface RefreshTokenInfo {
        data: TokenPayload;
        expiredAt: number;
        refreshToken: string;
    }

    interface RefreshTokenRes {
        accessToken: string;
        expiredAt: number;
        refreshToken: string;
    }
}
