import { EntityRepository, Repository } from 'typeorm';
import { Lessons } from '../domain/lessons.entity';

@EntityRepository(Lessons)
export class LessonsRepository extends Repository<Lessons> {}
