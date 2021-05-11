import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStudent } from '../student.model';
import { ILessons } from 'app/entities/lessons/lessons.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IPayment } from 'app/entities/payment/payment.model';

@Component({
  selector: 'jhi-student-detail',
  templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
  student: IStudent | null = null;
  lessons?: ILessons[] | null;
  predicate!: string;
  ascending!: boolean;
  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.student = student;
      // eslint-disable-next-line no-console
      console.log('aaaaaa', this.student);
    });
  }

  previousState(): void {
    window.history.back();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  delete(lessons: ILessons) {
    return true;
  }

  trackId(index: number, item: IStudent | ILessons | IPayment): number {
    return item.id!;
  }
}
