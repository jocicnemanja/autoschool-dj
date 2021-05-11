import { EntityRepository, Repository } from 'typeorm';
import { Student } from '../domain/student.entity';

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {}
