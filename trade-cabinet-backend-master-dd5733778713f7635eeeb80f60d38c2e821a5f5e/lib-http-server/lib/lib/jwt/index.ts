import { UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export class JwtLib {
    constructor(private secret: string, private expire: string | number) {}
    protected verify<T>(token: string, secret: string): JWT.TokenDecoded<T> {
        try {
            const split = token.split("Bearer ");
            token = split[1] || split[0];

            const decoded = jwt.verify(token, secret) as JWT.TokenDecoded<T>;

            return decoded;
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new UnauthorizedException("TOKEN_EXPIRED");
            }

            throw new UnauthorizedException(error.message);
        }
    }

    getToken(data: JWT.TokenPayload): string {
        return jwt.sign({ data }, this.secret, { expiresIn: this.expire });
    }

    jwtVerify(token: string): JWT.TokenDecoded<JWT.TokenPayload> {
        return this.verify(token, this.secret);
    }

    assignToken(res: JWT.RefreshTokenInfo): JWT.RefreshTokenRes {
        return {
            accessToken: this.getToken(res.data),
            expiredAt: res.expiredAt,
            refreshToken: res.refreshToken,
        };
    }
}
