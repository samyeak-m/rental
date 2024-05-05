import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IItemRate } from 'app/shared/model/item-rate.model';

type EntityResponseType = HttpResponse<IItemRate>;
type EntityArrayResponseType = HttpResponse<IItemRate[]>;

@Injectable({ providedIn: 'root' })
export class ItemRateService {
  public resourceUrl = SERVER_API_URL + 'api/item-rates';
  public searchUrl = SERVER_API_URL + 'api/item/rate';
  constructor(protected http: HttpClient) {}

  create(itemRate: IItemRate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itemRate);
    return this.http
      .post<IItemRate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(itemRate: IItemRate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itemRate);
    return this.http
      .put<IItemRate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IItemRate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByItemRate(itemRate?: any): Observable<EntityResponseType> {
    return this.http
      .get<IItemRate>(this.resourceUrl + '/findbyrate', {
        params: { itemRate },
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByBusinessTypeId(businessTypeId?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<IItemRate[]>(this.searchUrl, {
        params: { businessTypeId },
        observe: 'response',
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IItemRate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(itemRate: IItemRate): IItemRate {
    const copy: IItemRate = Object.assign({}, itemRate, {
      createdDate: itemRate.createdDate && itemRate.createdDate.isValid() ? itemRate.createdDate.toJSON() : undefined,
      updatedDate: itemRate.updatedDate && itemRate.updatedDate.isValid() ? itemRate.updatedDate.toJSON() : undefined,
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
      res.body.forEach((itemRate: IItemRate) => {
        itemRate.createdDate = itemRate.createdDate ? moment(itemRate.createdDate) : undefined;
        itemRate.updatedDate = itemRate.updatedDate ? moment(itemRate.updatedDate) : undefined;
      });
    }
    return res;
  }

  // findByItemRateId(id: number):Observable<EntityArrayResponseType> {
  //   return this.http
  //     .get<IItemRate[]>(`${this.resourceUrl}/${id}`,{observe:'response'})
  //     .pipe(map( (res: EntityArrayResponseType)=>  res));
  //
  // }
}
