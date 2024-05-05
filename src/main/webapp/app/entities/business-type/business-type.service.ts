import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IBusinessType } from 'app/shared/model/business-type.model';
import { IDiscountPolicy } from '../../shared/model/discount-policy.model';

type EntityResponseType = HttpResponse<IBusinessType>;
type EntityArrayResponseType = HttpResponse<IBusinessType[]>;

@Injectable({ providedIn: 'root' })
export class BusinessTypeService {
  public resourceUrl = SERVER_API_URL + 'api/business-types';
  public discountUrl = SERVER_API_URL + 'api/business/type/notequal/discountpolicy';

  constructor(protected http: HttpClient) {}

  create(businessType: IBusinessType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(businessType);
    return this.http
      .post<IBusinessType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(businessType: IBusinessType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(businessType);
    return this.http
      .put<IBusinessType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  getBusinessTypeNotEqualToDiscountId(discountPolicyId: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<IDiscountPolicy[]>(this.discountUrl, { params: { discountPolicyId }, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBusinessType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    //For pageable
    const options = createRequestOption(req);
    return this.http
      .get<IBusinessType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  queryAll(): Observable<EntityArrayResponseType> {
    //For Non-pageable
    return this.http
      .get<IBusinessType[]>(this.resourceUrl + '/all', { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getLatestCode(): Observable<EntityResponseType> {
    return this.http
      .get<IBusinessType>(`${this.resourceUrl}/code`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(businessType: IBusinessType): IBusinessType {
    const copy: IBusinessType = Object.assign({}, businessType, {
      createdDate: businessType.createdDate && businessType.createdDate.isValid() ? businessType.createdDate.toJSON() : undefined,
      updatedDate: businessType.updatedDate && businessType.updatedDate.isValid() ? businessType.updatedDate.toJSON() : undefined,
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
      res.body.forEach((businessType: IBusinessType) => {
        businessType.createdDate = businessType.createdDate ? moment(businessType.createdDate) : undefined;
        businessType.updatedDate = businessType.updatedDate ? moment(businessType.updatedDate) : undefined;
      });
    }
    return res;
  }
}
