import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamController } from '../web/rest/exam.controller';
import { ExamRepository } from '../repository/exam.repository';
import { ExamService } from '../service/exam.service';

@Module({
    imports: [TypeOrmModule.forFeature([ExamRepository])],
    controllers: [ExamController],
    providers: [ExamService],
    exports: [ExamService],
})
export class ExamModule {}
