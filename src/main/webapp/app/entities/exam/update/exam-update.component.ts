import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IExam, Exam } from '../exam.model';
import { ExamService } from '../service/exam.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { ExamType } from 'app/entities/exam/exam.enum';

@Component({
  selector: 'jhi-exam-update',
  templateUrl: './exam-update.component.html',
})
export class ExamUpdateComponent implements OnInit {
  isSaving = false;
  examType = ExamType;
  studentsSharedCollection: IStudent[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    date: [],
    student: [],
  });

  constructor(
    protected examService: ExamService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exam }) => {
      if (exam) {
        this.updateForm(exam);
      } else {
        const today = dayjs().startOf('day');

        this.editForm = this.fb.group({
          id: [],
          type: [],
          date: [today],
          student: [this.activatedRoute.snapshot.params],
        });
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exam = this.createFromForm();
    if (exam.id) {
      this.subscribeToSaveResponse(this.examService.update(exam));
    } else {
      delete exam.id;
      this.subscribeToSaveResponse(this.examService.create(exam));
    }
  }

  trackStudentById(index: number, item: IStudent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExam>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(exam: IExam): void {
    this.editForm.patchValue({
      id: exam.id,
      type: exam.type,
      date: exam.date ? exam.date.format(DATE_TIME_FORMAT) : null,
      student: exam.student,
    });

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing(this.studentsSharedCollection, exam.student);
  }

  protected createFromForm(): IExam {
    return {
      ...new Exam(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      student: this.editForm.get(['student'])!.value,
    };
  }
}
