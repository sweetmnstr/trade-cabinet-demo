import { TransactionClientStatusEnum } from '../../service-users';
import { IUpdatePasswordDto } from '../../gateway-users';

export interface IAddClientAccountDto {
    externalId: number;
    accountNumber: number;
}

export interface IUpdateTransactionStatusDto {
    id: number;
    status: TransactionClientStatusEnum;
}
interface Request {
    user: JWT.TokenPayload;
    realIp: string;
}

export interface IChangePassword {
    passwords: IUpdatePasswordDto;
    request: Request;
}
