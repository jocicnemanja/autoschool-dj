import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExam, getExamIdentifier } from '../exam.model';

export type EntityResponseType = HttpResponse<IExam>;
export type EntityArrayResponseType = HttpResponse<IExam[]>;

@Injectable({ providedIn: 'root' })
export class ExamService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/exams');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(exam: IExam): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exam);
    return this.http
      .post<IExam>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(exam: IExam): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exam);
    return this.http
      .put<IExam>(`${this.resourceUrl}/${getExamIdentifier(exam) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(exam: IExam): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exam);
    return this.http
      .patch<IExam>(`${this.resourceUrl}/${getExamIdentifier(exam) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IExam>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExam[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExamToCollectionIfMissing(examCollection: IExam[], ...examsToCheck: (IExam | null | undefined)[]): IExam[] {
    const exams: IExam[] = examsToCheck.filter(isPresent);
    if (exams.length > 0) {
      const examCollectionIdentifiers = examCollection.map(examItem => getExamIdentifier(examItem)!);
      const examsToAdd = exams.filter(examItem => {
        const examIdentifier = getExamIdentifier(examItem);
        if (examIdentifier == null || examCollectionIdentifiers.includes(examIdentifier)) {
          return false;
        }
        examCollectionIdentifiers.push(examIdentifier);
        return true;
      });
      return [...examsToAdd, ...examCollection];
    }
    return examCollection;
  }

  protected convertDateFromClient(exam: IExam): IExam {
    return Object.assign({}, exam, {
      date: exam.date?.isValid() ? exam.date.toJSON() : undefined,
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
      res.body.forEach((exam: IExam) => {
        exam.date = exam.date ? dayjs(exam.date) : undefined;
      });
    }
    return res;
  }
}
