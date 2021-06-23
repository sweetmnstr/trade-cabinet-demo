import { Body, Controller, Get, Patch, Put, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SuccessMessageResponse } from '../../common/responses/default.interfaces';
import { BalanceDto, UpdatePasswordDto, UserUpdateDto } from './user.dto';
import { UsersUserProvider } from 'lib-clients';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UsersUserProvider) {}

    @Put('/update-password')
    @ApiOperation({
        summary: 'Update password',
        description: 'IMPORTANT: Logout user on success! User must relog-in after changing password!',
        deprecated: true,
    })
    @ApiBadRequestResponse({
        description: 'Returns on password validation or problems with 3rd party API',
    })
    @ApiOkResponse({ type: SuccessMessageResponse })
    async updatePassword(@Body() body: UpdatePasswordDto, @Req() req: Request): Promise<SuccessMessageResponse> {
        await this.userService.updatePassword({ body, user: req.user });

        return { success: true, message: 'Password changed' };
    }

    @Get('/me')
    @ApiOperation({ summary: 'Get user info', description: 'Get user info, except email, due security purposes' })
    @ApiOkResponse({ type: UserUpdateDto })
    getMe(@Req() req: Request): Promise<UserUpdateDto> {
        return this.userService.getMe({ user: req.user });
    }

    @Patch('/me')
    @ApiOperation({
        summary: 'Update user info',
        description: 'This method updates info fields, that not linked with security',
    })
    @ApiOkResponse({ type: SuccessMessageResponse })
    async updateUser(@Body() body: UserUpdateDto, @Req() req: Request): Promise<SuccessMessageResponse> {
        await this.userService.updateUser({ body, user: req.user });
        return { success: true };
    }

    @Get('/balance')
    @ApiOperation({
        summary: 'Get authorized user balance',
        description: 'Use this method after purchases or refills, its separated from /me for stability',
        deprecated: true,
    })
    @ApiOkResponse({ type: BalanceDto })
    async getBalance(@Req() req: Request): Promise<BalanceDto> {
        return await this.userService.getBalance({ user: req.user });
    }

    // async getPublicKey(@Body() body: IGetId): Promise<string> {
    //     return await this.userService.getPublicKey(body);
    // }
}
