import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILessons, Lessons } from '../lessons.model';

import { LessonsService } from './lessons.service';

describe('Service Tests', () => {
  describe('Lessons Service', () => {
    let service: LessonsService;
    let httpMock: HttpTestingController;
    let elemDefault: ILessons;
    let expectedResult: ILessons | ILessons[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LessonsService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        type: 'AAAAAAA',
        amount: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Lessons', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Lessons()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Lessons', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
            type: 'BBBBBB',
            amount: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Lessons', () => {
        const patchObject = Object.assign(
          {
            amount: 1,
          },
          new Lessons()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Lessons', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
            type: 'BBBBBB',
            amount: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Lessons', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLessonsToCollectionIfMissing', () => {
        it('should add a Lessons to an empty array', () => {
          const lessons: ILessons = { id: 123 };
          expectedResult = service.addLessonsToCollectionIfMissing([], lessons);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(lessons);
        });

        it('should not add a Lessons to an array that contains it', () => {
          const lessons: ILessons = { id: 123 };
          const lessonsCollection: ILessons[] = [
            {
              ...lessons,
            },
            { id: 456 },
          ];
          expectedResult = service.addLessonsToCollectionIfMissing(lessonsCollection, lessons);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Lessons to an array that doesn't contain it", () => {
          const lessons: ILessons = { id: 123 };
          const lessonsCollection: ILessons[] = [{ id: 456 }];
          expectedResult = service.addLessonsToCollectionIfMissing(lessonsCollection, lessons);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(lessons);
        });

        it('should add only unique Lessons to an array', () => {
          const lessonsArray: ILessons[] = [{ id: 123 }, { id: 456 }, { id: 33029 }];
          const lessonsCollection: ILessons[] = [{ id: 123 }];
          expectedResult = service.addLessonsToCollectionIfMissing(lessonsCollection, ...lessonsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const lessons: ILessons = { id: 123 };
          const lessons2: ILessons = { id: 456 };
          expectedResult = service.addLessonsToCollectionIfMissing([], lessons, lessons2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(lessons);
          expect(expectedResult).toContain(lessons2);
        });

        it('should accept null and undefined values', () => {
          const lessons: ILessons = { id: 123 };
          expectedResult = service.addLessonsToCollectionIfMissing([], null, lessons, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(lessons);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
