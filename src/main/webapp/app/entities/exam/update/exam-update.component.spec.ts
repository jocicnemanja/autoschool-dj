jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ExamService } from '../service/exam.service';
import { IExam, Exam } from '../exam.model';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

import { ExamUpdateComponent } from './exam-update.component';

describe('Component Tests', () => {
  describe('Exam Management Update Component', () => {
    let comp: ExamUpdateComponent;
    let fixture: ComponentFixture<ExamUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let examService: ExamService;
    let studentService: StudentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExamUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ExamUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExamUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      examService = TestBed.inject(ExamService);
      studentService = TestBed.inject(StudentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Student query and add missing value', () => {
        const exam: IExam = { id: 456 };
        const student: IStudent = { id: 68248 };
        exam.student = student;

        const studentCollection: IStudent[] = [{ id: 17290 }];
        spyOn(studentService, 'query').and.returnValue(of(new HttpResponse({ body: studentCollection })));
        const additionalStudents = [student];
        const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
        spyOn(studentService, 'addStudentToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        expect(studentService.query).toHaveBeenCalled();
        expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(studentCollection, ...additionalStudents);
        expect(comp.studentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const exam: IExam = { id: 456 };
        const student: IStudent = { id: 25976 };
        exam.student = student;

        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(exam));
        expect(comp.studentsSharedCollection).toContain(student);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exam = { id: 123 };
        spyOn(examService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: exam }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(examService.update).toHaveBeenCalledWith(exam);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exam = new Exam();
        spyOn(examService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: exam }));
        saveSubject.complete();

        // THEN
        expect(examService.create).toHaveBeenCalledWith(exam);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exam = { id: 123 };
        spyOn(examService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(examService.update).toHaveBeenCalledWith(exam);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackStudentById', () => {
        it('Should return tracked Student primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackStudentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
