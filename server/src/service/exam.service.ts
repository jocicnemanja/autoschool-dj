import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ExamDTO } from '../service/dto/exam.dto';
import { ExamMapper } from '../service/mapper/exam.mapper';
import { ExamRepository } from '../repository/exam.repository';

const relationshipNames = [];
relationshipNames.push('student');

@Injectable()
export class ExamService {
    logger = new Logger('ExamService');

    constructor(@InjectRepository(ExamRepository) private examRepository: ExamRepository) {}

    async findById(id: string): Promise<ExamDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.examRepository.findOne(id, options);
        return ExamMapper.fromEntityToDTO(result);
    }

    async findByfields(options: FindOneOptions<ExamDTO>): Promise<ExamDTO | undefined> {
        const result = await this.examRepository.findOne(options);
        return ExamMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ExamDTO>): Promise<[ExamDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.examRepository.findAndCount(options);
        const examDTO: ExamDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((exam) => examDTO.push(ExamMapper.fromEntityToDTO(exam)));
            resultList[0] = examDTO;
        }
        return resultList;
    }

    async save(examDTO: ExamDTO): Promise<ExamDTO | undefined> {
        const entity = ExamMapper.fromDTOtoEntity(examDTO);
        const result = await this.examRepository.save(entity);
        return ExamMapper.fromEntityToDTO(result);
    }

    async update(examDTO: ExamDTO): Promise<ExamDTO | undefined> {
        const entity = ExamMapper.fromDTOtoEntity(examDTO);
        const result = await this.examRepository.save(entity);
        return ExamMapper.fromEntityToDTO(result);
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.examRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
