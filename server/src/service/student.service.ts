import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { StudentDTO } from '../service/dto/student.dto';
import { StudentMapper } from '../service/mapper/student.mapper';
import { StudentRepository } from '../repository/student.repository';

const relationshipNames = [];
relationshipNames.push('payments');
relationshipNames.push('lessons');
@Injectable()
export class StudentService {
    logger = new Logger('StudentService');

    constructor(@InjectRepository(StudentRepository) private studentRepository: StudentRepository) {}

    async findById(id: string): Promise<StudentDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.studentRepository.findOne(id, options);
        return StudentMapper.fromEntityToDTO(result);
    }

    async findByfields(options: FindOneOptions<StudentDTO>): Promise<StudentDTO | undefined> {
        const result = await this.studentRepository.findOne(options);
        return StudentMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<StudentDTO>): Promise<[StudentDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.studentRepository.findAndCount(options);
        const studentDTO: StudentDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((student) => studentDTO.push(StudentMapper.fromEntityToDTO(student)));
            resultList[0] = studentDTO;
        }
        return resultList;
    }

    async save(studentDTO: StudentDTO): Promise<StudentDTO | undefined> {
        const entity = StudentMapper.fromDTOtoEntity(studentDTO);
        const result = await this.studentRepository.save(entity);
        return StudentMapper.fromEntityToDTO(result);
    }

    async update(studentDTO: StudentDTO): Promise<StudentDTO | undefined> {
        const entity = StudentMapper.fromDTOtoEntity(studentDTO);
        const result = await this.studentRepository.save(entity);
        return StudentMapper.fromEntityToDTO(result);
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.studentRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
