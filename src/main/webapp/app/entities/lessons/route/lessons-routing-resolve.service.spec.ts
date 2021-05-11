jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILessons, Lessons } from '../lessons.model';
import { LessonsService } from '../service/lessons.service';

import { LessonsRoutingResolveService } from './lessons-routing-resolve.service';

describe('Service Tests', () => {
  describe('Lessons routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LessonsRoutingResolveService;
    let service: LessonsService;
    let resultLessons: ILessons | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LessonsRoutingResolveService);
      service = TestBed.inject(LessonsService);
      resultLessons = undefined;
    });

    describe('resolve', () => {
      it('should return ILessons returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLessons = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLessons).toEqual({ id: 123 });
      });

      it('should return new ILessons if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLessons = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLessons).toEqual(new Lessons());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLessons = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLessons).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
