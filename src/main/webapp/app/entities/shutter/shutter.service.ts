import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IShutter } from 'app/shared/model/shutter.model';
import { IFloor } from '../../shared/model/floor.model';

type EntityResponseType = HttpResponse<IShutter>;
type EntityArrayResponseType = HttpResponse<IShutter[]>;

@Injectable({ providedIn: 'root' })
export class ShutterService {
  public resourceUrl = SERVER_API_URL + 'api/shutters';
  public expiredShutterUrl = SERVER_API_URL + 'api/getlistofexpiredshutters';
  constructor(protected http: HttpClient) {}

  create(shutter: IShutter): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shutter);
    return this.http
      .post<IShutter>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shutter: IShutter): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shutter);
    return this.http
      .put<IShutter>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShutter>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShutter[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  uploadFile(uploadList: FormData): Observable<EntityResponseType> {
    return this.http.post<IShutter>(this.resourceUrl + '/upload', uploadList, { observe: 'response' });
  }

  findByShutterNo(shutterNo?: any): Observable<EntityResponseType> {
    return this.http
      .get<IShutter>(this.resourceUrl + '/shutterno', { params: { shutterNo }, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  getLatestCode(): Observable<EntityResponseType> {
    return this.http
      .get<IShutter>(`${this.resourceUrl}/code`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  getLatestShutterNumber(): Observable<EntityResponseType> {
    return this.http
      .get<IShutter>(`${this.resourceUrl}/getlatestshutterno`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  getListOfExpiredShutters(): Observable<EntityArrayResponseType> {
    return this.http
      .get<IShutter[]>(this.expiredShutterUrl, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(shutter: IShutter): IShutter {
    const copy: IShutter = Object.assign({}, shutter, {
      createdDate: shutter.createdDate && shutter.createdDate.isValid() ? shutter.createdDate.toJSON() : undefined,
      updatedDate: shutter.updatedDate && shutter.updatedDate.isValid() ? shutter.updatedDate.toJSON() : undefined,
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
      res.body.forEach((shutter: IShutter) => {
        shutter.createdDate = shutter.createdDate ? moment(shutter.createdDate) : undefined;
        shutter.updatedDate = shutter.updatedDate ? moment(shutter.updatedDate) : undefined;
      });
    }
    return res;
  }
}
