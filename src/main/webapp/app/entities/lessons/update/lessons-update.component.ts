import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ILessons, Lessons } from '../lessons.model';
import { LessonsService } from '../service/lessons.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { LessonsType } from '../lessons.enum';

@Component({
  selector: 'jhi-lessons-update',
  templateUrl: './lessons-update.component.html',
})
export class LessonsUpdateComponent implements OnInit {
  isSaving = false;

  studentsSharedCollection: IStudent[] = [];
  lessonsType = LessonsType;

  editForm = this.fb.group({
    id: [],
    date: [],
    type: [],
    amount: [],
    student: [],
  });

  constructor(
    protected lessonsService: LessonsService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lessons }) => {
      if (lessons) {
        this.updateForm(lessons);
      } else {
        const today = dayjs().startOf('day');

        this.editForm = this.fb.group({
          id: [],
          amount: [],
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
    const lessons = this.createFromForm();
    if (lessons.id) {
      this.subscribeToSaveResponse(this.lessonsService.update(lessons));
    } else {
      delete lessons.id;
      this.subscribeToSaveResponse(this.lessonsService.create(lessons));
    }
  }

  trackStudentById(index: number, item: IStudent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILessons>>): void {
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

  protected updateForm(lessons: ILessons): void {
    this.editForm.patchValue({
      id: lessons.id,
      date: lessons.date ? lessons.date.format(DATE_TIME_FORMAT) : null,
      type: lessons.type,
      amount: lessons.amount,
      student: lessons.student,
    });

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing(this.studentsSharedCollection, lessons.student);
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing(students, this.editForm.get('student')!.value))
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }

  protected createFromForm(): ILessons {
    return {
      ...new Lessons(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      type: this.editForm.get(['type'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      student: this.editForm.get(['student'])!.value,
    };
  }
}
