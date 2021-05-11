import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentDTO } from '../../service/dto/payment.dto';
import { PaymentService } from '../../service/payment.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/payments')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('payments')
export class PaymentController {
    logger = new Logger('PaymentController');

    constructor(private readonly paymentService: PaymentService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PaymentDTO,
    })
    async getAll(@Req() req: Request): Promise<PaymentDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.paymentService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PaymentDTO,
    })
    async getOne(@Param('id') id: string): Promise<PaymentDTO> {
        return await this.paymentService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create payment' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PaymentDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() paymentDTO: PaymentDTO): Promise<PaymentDTO> {
        const created = await this.paymentService.save(paymentDTO);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Payment', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update payment' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PaymentDTO,
    })
    async put(@Req() req: Request, @Body() paymentDTO: PaymentDTO): Promise<PaymentDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Payment', paymentDTO.id);
        return await this.paymentService.update(paymentDTO);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update payment with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PaymentDTO,
    })
    async putId(@Req() req: Request, @Body() paymentDTO: PaymentDTO): Promise<PaymentDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Payment', paymentDTO.id);
        return await this.paymentService.update(paymentDTO);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete payment' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Payment', id);
        return await this.paymentService.deleteById(id);
    }
}
