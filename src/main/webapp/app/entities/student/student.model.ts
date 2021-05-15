import * as dayjs from 'dayjs';
import { IPayment } from 'app/entities/payment/payment.model';
import { ILessons } from 'app/entities/lessons/lessons.model';
import { IExam } from 'app/entities/exam/exam.model';

export interface IStudent {
  id?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  jmbg?: number | null;
  date?: dayjs.Dayjs | null;
  payments?: IPayment[] | null;
  lessons?: ILessons[] | null;
  exams?: IExam[] | null;
}

export class Student implements IStudent {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public middleName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public jmbg?: number | null,
    public date?: dayjs.Dayjs | null,
    public payments?: IPayment[] | null,
    public lessons?: ILessons[] | null,
    public exams?: IExam[] | null
  ) {}
}

export function getStudentIdentifier(student: IStudent): number | undefined {
  return student.id;
}
