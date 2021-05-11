import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PaymentDTO } from '../service/dto/payment.dto';
import { PaymentMapper } from '../service/mapper/payment.mapper';
import { PaymentRepository } from '../repository/payment.repository';

const relationshipNames = [];
relationshipNames.push('student');


@Injectable()
export class PaymentService {
    logger = new Logger('PaymentService');

    constructor(@InjectRepository(PaymentRepository) private paymentRepository: PaymentRepository) {}

    async findById(id: string): Promise<PaymentDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.paymentRepository.findOne(id, options);
        return PaymentMapper.fromEntityToDTO(result);
    }

    async findByfields(options: FindOneOptions<PaymentDTO>): Promise<PaymentDTO | undefined> {
        const result = await this.paymentRepository.findOne(options);
        return PaymentMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<PaymentDTO>): Promise<[PaymentDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.paymentRepository.findAndCount(options);
        const paymentDTO: PaymentDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((payment) => paymentDTO.push(PaymentMapper.fromEntityToDTO(payment)));
            resultList[0] = paymentDTO;
        }
        return resultList;
    }

    async save(paymentDTO: PaymentDTO): Promise<PaymentDTO | undefined> {
        const entity = PaymentMapper.fromDTOtoEntity(paymentDTO);
        const result = await this.paymentRepository.save(entity);
        return PaymentMapper.fromEntityToDTO(result);
    }

    async update(paymentDTO: PaymentDTO): Promise<PaymentDTO | undefined> {
        const entity = PaymentMapper.fromDTOtoEntity(paymentDTO);
        const result = await this.paymentRepository.save(entity);
        return PaymentMapper.fromEntityToDTO(result);
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.paymentRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
