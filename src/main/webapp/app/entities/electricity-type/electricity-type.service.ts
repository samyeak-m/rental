import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IElectricityType } from 'app/shared/model/electricity-type.model';
import { IServiceCharge } from '../../shared/model/service-charge.model';

type EntityResponseType = HttpResponse<IElectricityType>;
type EntityArrayResponseType = HttpResponse<IElectricityType[]>;

@Injectable({ providedIn: 'root' })
export class ElectricityTypeService {
  public resourceUrl = SERVER_API_URL + 'api/electricity-types';
  private searchUrl = SERVER_API_URL + 'api/electricity/types/businesstype';

  constructor(protected http: HttpClient) {}

  create(electricityType: IElectricityType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(electricityType);
    return this.http
      .post<IElectricityType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(electricityType: IElectricityType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(electricityType);
    return this.http
      .put<IElectricityType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IElectricityType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IElectricityType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  getLatestCode(): Observable<EntityResponseType> {
    return this.http
      .get<IElectricityType>(`${this.resourceUrl}/code`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(electricityType: IElectricityType): IElectricityType {
    const copy: IElectricityType = Object.assign({}, electricityType, {
      createdDate: electricityType.createdDate && electricityType.createdDate.isValid() ? electricityType.createdDate.toJSON() : undefined,
      updatedDate: electricityType.updatedDate && electricityType.updatedDate.isValid() ? electricityType.updatedDate.toJSON() : undefined,
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
      res.body.forEach((electricityType: IElectricityType) => {
        electricityType.createdDate = electricityType.createdDate ? moment(electricityType.createdDate) : undefined;
        electricityType.updatedDate = electricityType.updatedDate ? moment(electricityType.updatedDate) : undefined;
      });
    }
    return res;
  }

  findByBusinessTypeId(businessTypeId?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<IServiceCharge[]>(this.searchUrl, {
        params: { businessTypeId },
        observe: 'response',
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
