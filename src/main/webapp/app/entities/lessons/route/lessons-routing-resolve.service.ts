import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILessons, Lessons } from '../lessons.model';
import { LessonsService } from '../service/lessons.service';

@Injectable({ providedIn: 'root' })
export class LessonsRoutingResolveService implements Resolve<ILessons> {
  constructor(protected service: LessonsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILessons> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lessons: HttpResponse<Lessons>) => {
          if (lessons.body) {
            return of(lessons.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Lessons());
  }
}
