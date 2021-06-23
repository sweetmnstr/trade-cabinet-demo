export interface PartnerEntity {
    id: number;

    firstName: string;

    lastName: string;

    email: string;

    username: string;

    phone: string;

    languageCode: string;

    isTest: boolean;

    hasDeposited: boolean;

    balance: number;

    isVerified: boolean;

    isSuspended: boolean;

    statusName: string;

    statusGroupName: string;

    agentId: number;

    agentName: string;

    createdAt: Date;
}
