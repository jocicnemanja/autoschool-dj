import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStudent } from '../student.model';
import { ILessons } from 'app/entities/lessons/lessons.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentDeleteDialogComponent } from 'app/entities/payment/delete/payment-delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonsDeleteDialog } from '../../../../../../test/javascript/e2e/entities/lessons/lessons.page-object';
import { LessonsDeleteDialogComponent } from 'app/entities/lessons/delete/lessons-delete-dialog.component';

@Component({
  selector: 'jhi-student-detail',
  templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
  student: IStudent | null = null;
  lessons?: ILessons[] | null;
  predicate!: string;
  ascending!: boolean;

  constructor(protected activatedRoute: ActivatedRoute, protected modalService: NgbModal) {}

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

  deleteLessons(lessonsForDelete: ILessons): void {
    const modalRef = this.modalService.open(LessonsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.lessons = lessonsForDelete;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted' && this.student?.lessons) {
        this.student.lessons = this.student.lessons.filter(lessons => lessons.id !== lessonsForDelete.id);
      }
    });
  }

  deletePayment(paymentForDelete: IPayment): void {
    const modalRef = this.modalService.open(PaymentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.payment = paymentForDelete;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted' && this.student?.payments) {
        this.student.payments = this.student.payments.filter(payment => payment.id !== paymentForDelete.id);
      }
    });
  }

  trackId(index: number, item: IStudent | ILessons | IPayment): number {
    return item.id!;
  }
}
