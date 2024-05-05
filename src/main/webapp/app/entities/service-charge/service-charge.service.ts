import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IServiceCharge } from 'app/shared/model/service-charge.model';

type EntityResponseType = HttpResponse<IServiceCharge>;
type EntityArrayResponseType = HttpResponse<IServiceCharge[]>;

@Injectable({ providedIn: 'root' })
export class ServiceChargeService {
  public resourceUrl = SERVER_API_URL + 'api/service-charges';
  public searchUrl = SERVER_API_URL + 'api/service/charges/businesstype';

  constructor(protected http: HttpClient) {}

  create(serviceCharge: IServiceCharge): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceCharge);
    return this.http
      .post<IServiceCharge>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(serviceCharge: IServiceCharge): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceCharge);
    return this.http
      .put<IServiceCharge>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IServiceCharge>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IServiceCharge[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  getLatestCode(): Observable<EntityResponseType> {
    return this.http
      .get<IServiceCharge>(`${this.resourceUrl}/code`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByBusinessTypeId(businessTypeId?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<IServiceCharge[]>(this.searchUrl, {
        params: { businessTypeId },
        observe: 'response',
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(serviceCharge: IServiceCharge): IServiceCharge {
    const copy: IServiceCharge = Object.assign({}, serviceCharge, {
      createdDate: serviceCharge.createdDate && serviceCharge.createdDate.isValid() ? serviceCharge.createdDate.toJSON() : undefined,
      updatedDate: serviceCharge.updatedDate && serviceCharge.updatedDate.isValid() ? serviceCharge.updatedDate.toJSON() : undefined,
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
      res.body.forEach((serviceCharge: IServiceCharge) => {
        serviceCharge.createdDate = serviceCharge.createdDate ? moment(serviceCharge.createdDate) : undefined;
        serviceCharge.updatedDate = serviceCharge.updatedDate ? moment(serviceCharge.updatedDate) : undefined;
      });
    }
    return res;
  }
}
