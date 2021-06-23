export interface IGetId {
    id: number;
}

export interface I3DSecure {
    code: string;
    paymentId: number;
}

export interface ICreateTransaction {
    amount: number;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    cardHolder: string;
    authCode: string;
}
