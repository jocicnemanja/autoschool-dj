import * as dayjs from 'dayjs';
import { IStudent } from 'app/entities/student/student.model';

export interface IExam {
  id?: number;
  type?: string | null;
  date?: dayjs.Dayjs | null;
  student?: IStudent | null;
}

export class Exam implements IExam {
  constructor(public id?: number, public type?: string | null, public date?: dayjs.Dayjs | null, public student?: IStudent | null) {}
}

export function getExamIdentifier(exam: IExam): number | undefined {
  return exam.id;
}
