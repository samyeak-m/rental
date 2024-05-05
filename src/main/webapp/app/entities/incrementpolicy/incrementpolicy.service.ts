import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IIncrementpolicy } from 'app/shared/model/incrementpolicy.model';

type EntityResponseType = HttpResponse<IIncrementpolicy>;
type EntityArrayResponseType = HttpResponse<IIncrementpolicy[]>;

@Injectable({ providedIn: 'root' })
export class IncrementpolicyService {
  public resourceUrl = SERVER_API_URL + 'api/increment-policies';

  constructor(protected http: HttpClient) {}

  create(incrementpolicy: IIncrementpolicy): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(incrementpolicy);
    return this.http
      .post<IIncrementpolicy>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(incrementpolicy: IIncrementpolicy): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(incrementpolicy);
    return this.http
      .put<IIncrementpolicy>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIncrementpolicy>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIncrementpolicy[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(incrementpolicy: IIncrementpolicy): IIncrementpolicy {
    const copy: IIncrementpolicy = Object.assign({}, incrementpolicy, {
      /* startDate: incrementpolicy.startDate && incrementpolicy.startDate.isValid() ? incrementpolicy.startDate.toJSON() : undefined,*/
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      /*res.body.startDate = res.body.startDate ? moment(res.body.startDate) : undefined;*/
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((incrementpolicy: IIncrementpolicy) => {
        /*incrementpolicy.startDate = incrementpolicy.startDate ? moment(incrementpolicy.startDate) : undefined;*/
      });
    }
    return res;
  }
}
