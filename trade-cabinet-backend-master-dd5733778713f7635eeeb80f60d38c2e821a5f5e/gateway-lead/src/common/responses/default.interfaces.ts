import { ApiProperty } from '@nestjs/swagger';

export class SuccessMessageResponse {
    @ApiProperty()
    message?: string;

    @ApiProperty()
    success: boolean;
}
