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
import { LessonsDTO } from '../../service/dto/lessons.dto';
import { LessonsService } from '../../service/lessons.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/lessons')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('lessons')
export class LessonsController {
    logger = new Logger('LessonsController');

    constructor(private readonly lessonsService: LessonsService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: LessonsDTO,
    })
    async getAll(@Req() req: Request): Promise<LessonsDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.lessonsService.findAndCount({
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
        type: LessonsDTO,
    })
    async getOne(@Param('id') id: string): Promise<LessonsDTO> {
        return await this.lessonsService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create lessons' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: LessonsDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() lessonsDTO: LessonsDTO): Promise<LessonsDTO> {
        const created = await this.lessonsService.save(lessonsDTO);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Lessons', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update lessons' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: LessonsDTO,
    })
    async put(@Req() req: Request, @Body() lessonsDTO: LessonsDTO): Promise<LessonsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Lessons', lessonsDTO.id);
        return await this.lessonsService.update(lessonsDTO);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update lessons with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: LessonsDTO,
    })
    async putId(@Req() req: Request, @Body() lessonsDTO: LessonsDTO): Promise<LessonsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Lessons', lessonsDTO.id);
        return await this.lessonsService.update(lessonsDTO);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete lessons' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Lessons', id);
        return await this.lessonsService.deleteById(id);
    }
}
