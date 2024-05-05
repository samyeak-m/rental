import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICustomerShutter } from 'app/shared/model/customer-shutter.model';
import { IShutter } from '../../shared/model/shutter.model';

type EntityResponseType = HttpResponse<ICustomerShutter>;
type EntityArrayResponseType = HttpResponse<ICustomerShutter[]>;

@Injectable({ providedIn: 'root' })
export class CustomerShutterService {
  public resourceUrl = SERVER_API_URL + 'api/customer-shutters';

  constructor(protected http: HttpClient) {}

  create(customerShutter: ICustomerShutter): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customerShutter);
    return this.http
      .post<ICustomerShutter>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(customerShutter: ICustomerShutter): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customerShutter);
    return this.http
      .put<ICustomerShutter>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByShutterNo(shutterNo?: any): Observable<EntityResponseType> {
    return this.http
      .get<ICustomerShutter>(this.resourceUrl + '/shutterno', { params: { shutterNo }, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICustomerShutter>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICustomerShutter[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(customerShutter: ICustomerShutter): ICustomerShutter {
    const copy: ICustomerShutter = Object.assign({}, customerShutter, {
      // effectiveDateFrom:
      //   customerShutter.effectiveDateFrom && customerShutter.effectiveDateFrom
      //     ? customerShutter.effectiveDateFrom.toJSON()
      //     : undefined,
      // effectiveDateTo:
      //   customerShutter.effectiveDateTo && customerShutter.effectiveDateTo? customerShutter.effectiveDateTo.toJSON() : undefined,
      createdDate: customerShutter.createdDate && customerShutter.createdDate.isValid() ? customerShutter.createdDate.toJSON() : undefined,
      updatedDate: customerShutter.updatedDate && customerShutter.updatedDate.isValid() ? customerShutter.updatedDate.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      // res.body.effectiveDateFrom = res.body.effectiveDateFrom ? moment(res.body.effectiveDateFrom) : undefined;
      // res.body.effectiveDateTo = res.body.effectiveDateTo ? moment(res.body.effectiveDateTo) : undefined;
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? moment(res.body.updatedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((customerShutter: ICustomerShutter) => {
        // customerShutter.effectiveDateFrom = customerShutter.effectiveDateFrom ?  moment(customerShutter.effectiveDateFrom) : undefined;
        // customerShutter.effectiveDateTo = customerShutter.effectiveDateTo ? moment(customerShutter.effectiveDateTo) : undefined;
        customerShutter.createdDate = customerShutter.createdDate ? moment(customerShutter.createdDate) : undefined;
        customerShutter.updatedDate = customerShutter.updatedDate ? moment(customerShutter.updatedDate) : undefined;
      });
    }
    return res;
  }
}
