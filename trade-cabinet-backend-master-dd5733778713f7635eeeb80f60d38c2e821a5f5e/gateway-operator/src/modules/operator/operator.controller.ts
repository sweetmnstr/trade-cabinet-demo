import { Body, Controller, Get, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SuccessMessageResponse } from '../../common/responses/default.interfaces';
import { AddClientAccountDto, UpdatePasswordDto, AddBalanceDto, BalanceDto } from './operator.dto';
import {
    PartnerEntity,
    IClientTransactions,
    IClientAccount,
    IUpdateTransactionStatusDto,
    IGetId,
} from 'trade-cabinet-types';
import { OperatorProvider } from 'lib-clients';
import { RateLimited } from '../../lib/decorators/rate-limit.decorator';
import { UserType } from '../../lib/decorators/user-type.decorator';
import { createLogger } from '../../common/logger';

const adminLogger = createLogger('Admin');

@ApiBearerAuth()
@ApiTags('Operator')
@Controller('operator')
export class OperatorController {
    constructor(private readonly operatorService: OperatorProvider) {}

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
        await this.operatorService.updatePassword({ body, user: req.user });

        return { success: true, message: 'Password changed' };
    }

    @Patch('/update-transaction ')
    @ApiOperation({
        summary: 'Update transaction status',
        deprecated: true,
    })
    @ApiBadRequestResponse({
        description: 'Returns on password validation or problems with 3rd party API',
    })
    @ApiOkResponse({ type: SuccessMessageResponse })
    async updateTransactionStatus(@Body() body: IUpdateTransactionStatusDto): Promise<SuccessMessageResponse> {
        await this.operatorService.updateTransactionStatus(body);

        return { success: true, message: 'Transaction Status changed' };
    }

    @Get('/get-all-clients')
    @ApiOperation({
        summary: 'Gets all clients',
        deprecated: true,
    })
    @ApiBadRequestResponse({
        description: 'Returns on empty client',
    })
    @ApiOkResponse({ type: SuccessMessageResponse })
    async getAllPartners(): Promise<PartnerEntity[]> {
        return await this.operatorService.getAllPartners();
    }

    @Post('/get-client-by-id')
    @ApiOperation({
        summary: 'Gets all client by id',
        deprecated: true,
    })
    @ApiBadRequestResponse({
        description: 'Returns on empty client',
    })
    @ApiOkResponse({ type: SuccessMessageResponse })
    async getPartner(@Body() body: IGetId): Promise<PartnerEntity> {
        return await this.operatorService.getPartner(body);
    }

    @Post('/get-partners-transaction')
    async getClientsTransaction(@Body() body: IGetId): Promise<IClientTransactions[]> {
        return await this.operatorService.getClientsTransaction(body);
    }

    @Post('/add-clients-account')
    @ApiOperation({
        summary: "Adds a new client's ",
        deprecated: true,
    })
    @ApiOkResponse({ type: SuccessMessageResponse })
    async addClientsAccount(@Body() body: AddClientAccountDto): Promise<IClientAccount> {
        return await this.operatorService.addClientsAccount(body);
    }

    @Get('/get-all-transactions')
    @ApiOperation({
        summary: 'Gets all transactions',
        deprecated: true,
    })
    @ApiBadRequestResponse({
        description: 'Returns on empty transaction',
    })
    @ApiOkResponse({ type: SuccessMessageResponse })
    async getAllTransactions(): Promise<IClientTransactions[]> {
        return await this.operatorService.getAllTransactions();
    }

    @Post('/get-transaction-status-by-id')
    @ApiOperation({
        summary: 'Gets transaction by id',
        deprecated: true,
    })
    @ApiBadRequestResponse({
        description: 'Returns on empty transaction',
    })
    @ApiOkResponse({ type: SuccessMessageResponse })
    async getTransactionStatusById(@Body() body: { id: number }): Promise<IClientTransactions> {
        return await this.operatorService.getTransactionStatusById(body);
    }

    @Post('/addBalance')
    @RateLimited('withdrawal')
    @UserType('admin')
    @ApiTags('Admin')
    @ApiOperation({
        summary: 'Add balance to user',
        description: `Admin method to add \`balance = balance + yourValue\` balance manually,
                    \nBig negative values can throw **UNSIGNED DECIMAL** exception`,
        deprecated: true,
    })
    @ApiBearerAuth('Admin')
    async addBalance(@Body() body: AddBalanceDto, @Req() req: Request): Promise<SuccessMessageResponse> {
        await this.operatorService.addBalance({ body, user: req.user });

        adminLogger.warn(`Admin:${req.user.id} added ${body.amount} to userId:${body.id} balance`);

        return { success: true };
    }

    @Get('/balance')
    @ApiOperation({
        summary: 'Get authorized user balance',
        description: 'Use this method after purchases or refills, its separated from /me for stability',
        deprecated: true,
    })
    @ApiOkResponse({ type: BalanceDto })
    async getBalance(@Body() body: IGetId): Promise<BalanceDto> {
        return await this.operatorService.getBalance(body);
    }
}
