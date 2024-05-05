import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IBillParticulars } from 'app/shared/model/bill-particulars.model';
import { IElectricityType } from '../../shared/model/electricity-type.model';

type EntityResponseType = HttpResponse<IBillParticulars>;
type EntityArrayResponseType = HttpResponse<IBillParticulars[]>;

@Injectable({ providedIn: 'root' })
export class BillParticularsService {
  public resourceUrl = SERVER_API_URL + 'api/bill-particulars';

  constructor(protected http: HttpClient) {}

  create(billParticulars: IBillParticulars): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(billParticulars);
    return this.http
      .post<IBillParticulars>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(billParticulars: IBillParticulars): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(billParticulars);
    return this.http
      .put<IBillParticulars>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBillParticulars>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBillParticulars[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  getLatestCode(): Observable<EntityResponseType> {
    return this.http
      .get<IBillParticulars>(`${this.resourceUrl}/code`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(billParticulars: IBillParticulars): IBillParticulars {
    const copy: IBillParticulars = Object.assign({}, billParticulars, {
      createdDate: billParticulars.createdDate && billParticulars.createdDate.isValid() ? billParticulars.createdDate.toJSON() : undefined,
      updatedDate: billParticulars.updatedDate && billParticulars.updatedDate.isValid() ? billParticulars.updatedDate.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? moment(res.body.updatedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((billParticulars: IBillParticulars) => {
        billParticulars.createdDate = billParticulars.createdDate ? moment(billParticulars.createdDate) : undefined;
        billParticulars.updatedDate = billParticulars.updatedDate ? moment(billParticulars.updatedDate) : undefined;
      });
    }
    return res;
  }
}
