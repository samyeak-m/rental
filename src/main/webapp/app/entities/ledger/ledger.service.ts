import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ILedger } from 'app/shared/model/ledger.model';
import { ICustomerRegistration } from '../../shared/model/customer-registration.model';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { IShutter } from '../../shared/model/shutter.model';

type EntityResponseType = HttpResponse<ILedger>;
type EntityArrayResponseType = HttpResponse<ILedger[]>;

@Injectable({ providedIn: 'root' })
export class LedgerService {
  public resourceUrl = SERVER_API_URL + 'api/ledgers';
  public searchUrl = SERVER_API_URL + 'api/ledger/filter';
  constructor(protected http: HttpClient) {}

  create(ledger: ILedger): Observable<EntityResponseType> {
    return this.http.post<ILedger>(this.resourceUrl, ledger, { observe: 'response' });
  }

  update(ledger: ILedger): Observable<EntityResponseType> {
    return this.http.put<ILedger>(this.resourceUrl, ledger, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILedger>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILedger[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  filter(
    customerId?: any,
    ledgerType?: any,
    fromDate?: any,
    toDate?: any,
    month?: any,
    createdDate?: any,
    fiscalYearId?: any
  ): Observable<EntityArrayResponseType> {
    return this.http
      .get<ILedger[]>(this.searchUrl, {
        params: { customerId, ledgerType, fromDate, toDate, month, createdDate, fiscalYearId },
        observe: 'response',
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ledger: ILedger) => {
        ledger.createdDate = ledger.createdDate ? moment(ledger.createdDate) : undefined;
        ledger.updatedDate = ledger.updatedDate ? moment(ledger.updatedDate) : undefined;
      });
    }
    return res;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? moment(res.body.updatedDate) : undefined;
    }
    return res;
  }
}
