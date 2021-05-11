import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { LessonsDTO } from '../service/dto/lessons.dto';
import { LessonsMapper } from '../service/mapper/lessons.mapper';
import { LessonsRepository } from '../repository/lessons.repository';

const relationshipNames = [];
relationshipNames.push('student');

@Injectable()
export class LessonsService {
    logger = new Logger('LessonsService');

    constructor(@InjectRepository(LessonsRepository) private lessonsRepository: LessonsRepository) {}

    async findById(id: string): Promise<LessonsDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.lessonsRepository.findOne(id, options);
        return LessonsMapper.fromEntityToDTO(result);
    }

    async findByfields(options: FindOneOptions<LessonsDTO>): Promise<LessonsDTO | undefined> {
        const result = await this.lessonsRepository.findOne(options);
        return LessonsMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<LessonsDTO>): Promise<[LessonsDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.lessonsRepository.findAndCount(options);
        const lessonsDTO: LessonsDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((lessons) => lessonsDTO.push(LessonsMapper.fromEntityToDTO(lessons)));
            resultList[0] = lessonsDTO;
        }
        return resultList;
    }

    async save(lessonsDTO: LessonsDTO): Promise<LessonsDTO | undefined> {
        const entity = LessonsMapper.fromDTOtoEntity(lessonsDTO);
        const result = await this.lessonsRepository.save(entity);
        return LessonsMapper.fromEntityToDTO(result);
    }

    async update(lessonsDTO: LessonsDTO): Promise<LessonsDTO | undefined> {
        const entity = LessonsMapper.fromDTOtoEntity(lessonsDTO);
        const result = await this.lessonsRepository.save(entity);
        return LessonsMapper.fromEntityToDTO(result);
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.lessonsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
