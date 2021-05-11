import * as dayjs from 'dayjs';
import { IStudent } from 'app/entities/student/student.model';

export interface IPayment {
  id?: number;
  amount?: number | null;
  date?: dayjs.Dayjs | null;
  student?: IStudent | null;
}

export class Payment implements IPayment {
  constructor(public id?: number, public amount?: number | null, public date?: dayjs.Dayjs | null, public student?: IStudent | null) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
