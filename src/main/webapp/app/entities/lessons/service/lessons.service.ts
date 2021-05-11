import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILessons, getLessonsIdentifier } from '../lessons.model';

export type EntityResponseType = HttpResponse<ILessons>;
export type EntityArrayResponseType = HttpResponse<ILessons[]>;

@Injectable({ providedIn: 'root' })
export class LessonsService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/lessons');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(lessons: ILessons): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lessons);
    return this.http
      .post<ILessons>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(lessons: ILessons): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lessons);
    return this.http
      .put<ILessons>(`${this.resourceUrl}/${getLessonsIdentifier(lessons) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(lessons: ILessons): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lessons);
    return this.http
      .patch<ILessons>(`${this.resourceUrl}/${getLessonsIdentifier(lessons) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILessons>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILessons[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLessonsToCollectionIfMissing(lessonsCollection: ILessons[], ...lessonsToCheck: (ILessons | null | undefined)[]): ILessons[] {
    const lessons: ILessons[] = lessonsToCheck.filter(isPresent);
    if (lessons.length > 0) {
      const lessonsCollectionIdentifiers = lessonsCollection.map(lessonsItem => getLessonsIdentifier(lessonsItem)!);
      const lessonsToAdd = lessons.filter(lessonsItem => {
        const lessonsIdentifier = getLessonsIdentifier(lessonsItem);
        if (lessonsIdentifier == null || lessonsCollectionIdentifiers.includes(lessonsIdentifier)) {
          return false;
        }
        lessonsCollectionIdentifiers.push(lessonsIdentifier);
        return true;
      });
      return [...lessonsToAdd, ...lessonsCollection];
    }
    return lessonsCollection;
  }

  protected convertDateFromClient(lessons: ILessons): ILessons {
    return Object.assign({}, lessons, {
      date: lessons.date?.isValid() ? lessons.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((lessons: ILessons) => {
        lessons.date = lessons.date ? dayjs(lessons.date) : undefined;
      });
    }
    return res;
  }
}
