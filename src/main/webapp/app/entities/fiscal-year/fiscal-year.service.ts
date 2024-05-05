import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IFiscalYear } from 'app/shared/model/fiscal-year.model';

type EntityResponseType = HttpResponse<IFiscalYear>;
type EntityArrayResponseType = HttpResponse<IFiscalYear[]>;

@Injectable({ providedIn: 'root' })
export class FiscalYearService {
  public resourceUrl = SERVER_API_URL + 'api/fiscal-years';

  constructor(protected http: HttpClient) {}

  create(fiscalYear: IFiscalYear): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fiscalYear);
    return this.http
      .post<IFiscalYear>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(fiscalYear: IFiscalYear): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fiscalYear);
    return this.http
      .put<IFiscalYear>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFiscalYear>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFiscalYear[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(fiscalYear: IFiscalYear): IFiscalYear {
    const copy: IFiscalYear = Object.assign({}, fiscalYear, {
      fiscalAdStart:
        fiscalYear.fiscalAdStart && fiscalYear.fiscalAdStart.isValid() ? fiscalYear.fiscalAdStart.format(DATE_FORMAT) : undefined,
      fiscalAdEnd: fiscalYear.fiscalAdEnd && fiscalYear.fiscalAdEnd.isValid() ? fiscalYear.fiscalAdEnd.format(DATE_FORMAT) : undefined,
      createdDate: fiscalYear.createdDate && fiscalYear.createdDate.isValid() ? fiscalYear.createdDate.toJSON() : undefined,
      updatedDate: fiscalYear.updatedDate && fiscalYear.updatedDate.isValid() ? fiscalYear.updatedDate.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fiscalAdStart = res.body.fiscalAdStart ? moment(res.body.fiscalAdStart) : undefined;
      res.body.fiscalAdEnd = res.body.fiscalAdEnd ? moment(res.body.fiscalAdEnd) : undefined;
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? moment(res.body.updatedDate) : undefined;
    }
    return res;
  }
  getAll(): Observable<EntityArrayResponseType> {
    return this.http
      .get<IFiscalYear[]>(this.resourceUrl, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((fiscalYear: IFiscalYear) => {
        fiscalYear.fiscalAdStart = fiscalYear.fiscalAdStart ? moment(fiscalYear.fiscalAdStart) : undefined;
        fiscalYear.fiscalAdEnd = fiscalYear.fiscalAdEnd ? moment(fiscalYear.fiscalAdEnd) : undefined;
        fiscalYear.createdDate = fiscalYear.createdDate ? moment(fiscalYear.createdDate) : undefined;
        fiscalYear.updatedDate = fiscalYear.updatedDate ? moment(fiscalYear.updatedDate) : undefined;
      });
    }
    return res;
  }
}
