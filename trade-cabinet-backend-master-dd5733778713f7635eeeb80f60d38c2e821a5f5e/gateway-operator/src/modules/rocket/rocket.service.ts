import { Injectable } from '@nestjs/common';

@Injectable()
export class RocketService {
    constructor() {}

    async sendMessage(_txt: string, _chatId: number | string): Promise<number> {
        return 0;
    }
}
