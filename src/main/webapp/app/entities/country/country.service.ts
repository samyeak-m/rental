import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICountry } from 'app/shared/model/country.model';

type EntityResponseType = HttpResponse<ICountry>;
type EntityArrayResponseType = HttpResponse<ICountry[]>;

@Injectable({ providedIn: 'root' })
export class CountryService {
  public resourceUrl = SERVER_API_URL + 'api/countries';

  constructor(protected http: HttpClient) {}

  create(country: ICountry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(country);
    return this.http
      .post<ICountry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(country: ICountry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(country);
    return this.http
      .put<ICountry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICountry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICountry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(country: ICountry): ICountry {
    const copy: ICountry = Object.assign({}, country, {
      createdDate: country.createdDate && country.createdDate.isValid() ? country.createdDate.toJSON() : undefined,
      updatedDate: country.updatedDate && country.updatedDate.isValid() ? country.updatedDate.toJSON() : undefined,
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
      res.body.forEach((country: ICountry) => {
        country.createdDate = country.createdDate ? moment(country.createdDate) : undefined;
        country.updatedDate = country.updatedDate ? moment(country.updatedDate) : undefined;
      });
    }
    return res;
  }
}
