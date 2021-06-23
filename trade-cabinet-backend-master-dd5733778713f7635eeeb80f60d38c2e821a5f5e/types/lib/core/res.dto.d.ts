export namespace ResDto {
    interface SuccessResponse<T> {
        status: 'OK';
        data: T;
        timestamp: number;
    }

    interface ErrorResponse {
        status: 'error';
        messages: (string | object)[];
        timestamp: number;
    }

    interface SuccessMessageResponse {
        message?: string;
        success: boolean;
    }

    interface UserBrowser {
        fingerprint: string;
        ip: string;
    }
}
