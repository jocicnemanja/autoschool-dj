jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LessonsService } from '../service/lessons.service';
import { ILessons, Lessons } from '../lessons.model';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

import { LessonsUpdateComponent } from './lessons-update.component';

describe('Component Tests', () => {
  describe('Lessons Management Update Component', () => {
    let comp: LessonsUpdateComponent;
    let fixture: ComponentFixture<LessonsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let lessonsService: LessonsService;
    let studentService: StudentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LessonsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LessonsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LessonsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      lessonsService = TestBed.inject(LessonsService);
      studentService = TestBed.inject(StudentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Student query and add missing value', () => {
        const lessons: ILessons = { id: 456 };
        const student: IStudent = { id: 68046 };
        lessons.student = student;

        const studentCollection: IStudent[] = [{ id: 75458 }];
        spyOn(studentService, 'query').and.returnValue(of(new HttpResponse({ body: studentCollection })));
        const additionalStudents = [student];
        const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
        spyOn(studentService, 'addStudentToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ lessons });
        comp.ngOnInit();

        expect(studentService.query).toHaveBeenCalled();
        expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(studentCollection, ...additionalStudents);
        expect(comp.studentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const lessons: ILessons = { id: 456 };
        const student: IStudent = { id: 47073 };
        lessons.student = student;

        activatedRoute.data = of({ lessons });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(lessons));
        expect(comp.studentsSharedCollection).toContain(student);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const lessons = { id: 123 };
        spyOn(lessonsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ lessons });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: lessons }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(lessonsService.update).toHaveBeenCalledWith(lessons);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const lessons = new Lessons();
        spyOn(lessonsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ lessons });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: lessons }));
        saveSubject.complete();

        // THEN
        expect(lessonsService.create).toHaveBeenCalledWith(lessons);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const lessons = { id: 123 };
        spyOn(lessonsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ lessons });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(lessonsService.update).toHaveBeenCalledWith(lessons);
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
