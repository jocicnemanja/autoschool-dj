import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from '../web/rest/student.controller';
import { StudentRepository } from '../repository/student.repository';
import { StudentService } from '../service/student.service';

@Module({
    imports: [TypeOrmModule.forFeature([StudentRepository])],
    controllers: [StudentController],
    providers: [StudentService],
    exports: [StudentService],
})
export class StudentModule {}
