import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IAdBsDates } from 'app/shared/model/ad-bs-dates.model';

type EntityResponseType = HttpResponse<IAdBsDates>;
type EntityArrayResponseType = HttpResponse<IAdBsDates[]>;

@Injectable({ providedIn: 'root' })
export class AdBsDatesService {
  public resourceUrl = SERVER_API_URL + 'api/ad-bs-dates';
  public searchUrl = SERVER_API_URL + 'api/related/date';
   public fiscalUrl= SERVER_API_URL +'api/ad/bs/date/verifyFiscal';

  constructor(protected http: HttpClient) {}

  create(adBsDates: IAdBsDates): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adBsDates);
    return this.http
      .post<IAdBsDates>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(adBsDates: IAdBsDates): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adBsDates);
    return this.http
      .put<IAdBsDates>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAdBsDates>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByAdDate(adDate: any): Observable<EntityResponseType> {
    return this.http
      .get<IAdBsDates>(`${this.searchUrl}`, { params: { adDate }, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAdBsDates[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  verifyFiscal(): Observable<EntityResponseType> {
    return this.http
      .get<IAdBsDates>(this.fiscalUrl, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(adBsDates: IAdBsDates): IAdBsDates {
    const copy: IAdBsDates = Object.assign({}, adBsDates, {
      adDate: adBsDates.adDate && adBsDates.adDate.isValid() ? adBsDates.adDate.format(DATE_FORMAT) : undefined,
      createdDate: adBsDates.createdDate && adBsDates.createdDate.isValid() ? adBsDates.createdDate.toJSON() : undefined,
      updatedDate: adBsDates.updatedDate && adBsDates.updatedDate.isValid() ? adBsDates.updatedDate.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.adDate = res.body.adDate ? moment(res.body.adDate) : undefined;
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? moment(res.body.updatedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((adBsDates: IAdBsDates) => {
        adBsDates.adDate = adBsDates.adDate ? moment(adBsDates.adDate) : undefined;
        adBsDates.createdDate = adBsDates.createdDate ? moment(adBsDates.createdDate) : undefined;
        adBsDates.updatedDate = adBsDates.updatedDate ? moment(adBsDates.updatedDate) : undefined;
      });
    }
    return res;
  }

  queryFiscalMonth(fiscalYearId?: any, month?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<IAdBsDates[]>(this.resourceUrl + '/fiscalMonths', { params: { fiscalYearId, month }, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
