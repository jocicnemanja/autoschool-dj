import { EntityRepository, Repository } from 'typeorm';
import { Exam } from '../domain/exam.entity';

@EntityRepository(Exam)
export class ExamRepository extends Repository<Exam> {}
