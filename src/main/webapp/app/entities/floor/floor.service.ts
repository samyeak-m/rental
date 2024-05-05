import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IFloor } from 'app/shared/model/floor.model';
import { IBill } from '../../shared/model/bill.model';

type EntityResponseType = HttpResponse<IFloor>;
type EntityArrayResponseType = HttpResponse<IFloor[]>;

@Injectable({ providedIn: 'root' })
export class FloorService {
  public resourceUrl = SERVER_API_URL + 'api/floors';

  constructor(protected http: HttpClient) {}

  create(floor: IFloor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(floor);
    return this.http
      .post<IFloor>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(floor: IFloor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(floor);
    return this.http
      .put<IFloor>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  uploadFile(uploadList: FormData): Observable<EntityResponseType> {
    return this.http.post<IFloor>(this.resourceUrl + '/upload', uploadList, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFloor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByFloorId(floorId?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<IBill[]>(this.resourceUrl + '/block', { params: { floorId }, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFloor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getLatestCode(): Observable<EntityResponseType> {
    return this.http
      .get<IFloor>(`${this.resourceUrl}/code`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(floor: IFloor): IFloor {
    const copy: IFloor = Object.assign({}, floor, {
      createdDate: floor.createdDate && floor.createdDate.isValid() ? floor.createdDate.toJSON() : undefined,
      updatedDate: floor.updatedDate && floor.updatedDate.isValid() ? floor.updatedDate.toJSON() : undefined,
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
      res.body.forEach((floor: IFloor) => {
        floor.createdDate = floor.createdDate ? moment(floor.createdDate) : undefined;
        floor.updatedDate = floor.updatedDate ? moment(floor.updatedDate) : undefined;
      });
    }
    return res;
  }
}
