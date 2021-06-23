declare namespace Express {
  interface Request {
    user: JWT.TokenPayload;
    realIp: string;
  }
}

declare namespace JWT {
  type UserType = "user" | "banned" | "admin";

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

declare interface ISuccessResponse<T> {
  status: "OK";
  data: T;
  timestamp: number;
}

declare interface IErrorResponse {
  status: "error";
  messages: (string | object)[];
  timestamp: number;
}

interface ISuccessMessageResponse {
  message?: string;
  success: boolean;
}

declare interface IReq {
  user: JWT.TokenPayload;
}

declare interface IReqBody<T> extends IReq {
  body: T;
}
