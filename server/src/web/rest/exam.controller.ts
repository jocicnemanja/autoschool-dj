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
import { ExamDTO } from '../../service/dto/exam.dto';
import { ExamService } from '../../service/exam.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/exams')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('exams')
export class ExamController {
    logger = new Logger('ExamController');

    constructor(private readonly examService: ExamService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ExamDTO,
    })
    async getAll(@Req() req: Request): Promise<ExamDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.examService.findAndCount({
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
        type: ExamDTO,
    })
    async getOne(@Param('id') id: string): Promise<ExamDTO> {
        return await this.examService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create exam' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ExamDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() examDTO: ExamDTO): Promise<ExamDTO> {
        const created = await this.examService.save(examDTO);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Exam', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update exam' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ExamDTO,
    })
    async put(@Req() req: Request, @Body() examDTO: ExamDTO): Promise<ExamDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Exam', examDTO.id);
        return await this.examService.update(examDTO);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update exam with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ExamDTO,
    })
    async putId(@Req() req: Request, @Body() examDTO: ExamDTO): Promise<ExamDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Exam', examDTO.id);
        return await this.examService.update(examDTO);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete exam' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Exam', id);
        return await this.examService.deleteById(id);
    }
}
