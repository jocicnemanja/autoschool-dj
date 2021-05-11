import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IStudent } from '../student.model';
import { ILessons } from 'app/entities/lessons/lessons.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentDeleteDialogComponent } from 'app/entities/payment/delete/payment-delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonsDeleteDialogComponent } from 'app/entities/lessons/delete/lessons-delete-dialog.component';
import { LessonsType } from '../../lessons/lessons.enum';

@Component({
  selector: 'jhi-student-detail',
  templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
  student: IStudent | null = null;
  lessons?: ILessons[] | null;
  predicate!: string;
  ascending!: boolean;
  lessonsType = LessonsType;
  drivingHours = 0;
  theoreticalHours = 0;
  totalPaidAmount = 0;
  debitAmount = 0;
  studentDebitAmount = 0;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    protected router: Router,
    protected studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.studentService.find(student.id as number).subscribe(data => {
        // eslint-disable-next-line no-console
        console.log(data);
        this.student = data.body;
        this.calculate();
      });
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
        this.studentService.find(this.student.id as number).subscribe(data => {
          this.student = data.body;
          this.calculate();
        });
      }
    });
  }

  deletePayment(paymentForDelete: IPayment): void {
    const modalRef = this.modalService.open(PaymentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.payment = paymentForDelete;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted' && this.student?.payments) {
        this.studentService.find(this.student.id as number).subscribe(data => {
          this.student = data.body;
          this.calculate();
        });
      }
    });
  }

  trackId(index: number, item: IStudent | ILessons | IPayment): number {
    return item.id!;
  }

  createNewPayment(student: IStudent): void {
    this.router.navigate(['payment/new', { ...student }]);
  }

  createNewLessons(student: IStudent): void {
    this.router.navigate(['lessons/new', { ...student }]);
  }

  calculate(): void {
    this.drivingHours = 0;
    this.theoreticalHours = 0;
    this.totalPaidAmount = 0;
    this.debitAmount = 0;

    this.student?.lessons?.forEach(lessons => {
      if (lessons.type === this.lessonsType.DRIVING) {
        this.drivingHours += lessons.amount ?? 0;
        this.debitAmount += (lessons.amount ?? 0) * 1000;
      } else if (lessons.type === this.lessonsType.THEORETICAL) {
        this.theoreticalHours += lessons.amount ?? 0;
        this.debitAmount += (lessons.amount ?? 0) * 325;
      }
    });

    this.student?.payments?.forEach(payment => {
      this.totalPaidAmount += payment.amount ?? 0;
    });

    this.studentDebitAmount = this.debitAmount - this.totalPaidAmount;
    if (this.studentDebitAmount <= 0) {
      this.studentDebitAmount = 0;
    }
  }
}
