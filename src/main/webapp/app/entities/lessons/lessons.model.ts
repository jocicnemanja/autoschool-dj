import * as dayjs from 'dayjs';
import { IStudent } from 'app/entities/student/student.model';

export interface ILessons {
  id?: number;
  date?: dayjs.Dayjs | null;
  type?: string | null;
  amount?: number | null;
  student?: IStudent | null;
}

export class Lessons implements ILessons {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public type?: string | null,
    public amount?: number | null,
    public student?: IStudent | null
  ) {}
}

export function getLessonsIdentifier(lessons: ILessons): number | undefined {
  return lessons.id;
}
