declare namespace Express {
    interface Request {
        user: JWT.TokenPayload;
        realIp: string;
    }
}
