import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsController } from '../web/rest/lessons.controller';
import { LessonsRepository } from '../repository/lessons.repository';
import { LessonsService } from '../service/lessons.service';

@Module({
    imports: [TypeOrmModule.forFeature([LessonsRepository])],
    controllers: [LessonsController],
    providers: [LessonsService],
    exports: [LessonsService],
})
export class LessonsModule {}
