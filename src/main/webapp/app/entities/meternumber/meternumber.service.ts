import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IMeternumber } from 'app/shared/model/meternumber.model';

type EntityResponseType = HttpResponse<IMeternumber>;
type EntityArrayResponseType = HttpResponse<IMeternumber[]>;

@Injectable({ providedIn: 'root' })
export class MeternumberService {
  public resourceUrl = SERVER_API_URL + 'api/meternumbers';

  constructor(protected http: HttpClient) {}

  create(meternumber: IMeternumber): Observable<EntityResponseType> {
    return this.http.post<IMeternumber>(this.resourceUrl, meternumber, { observe: 'response' });
  }

  update(meternumber: IMeternumber): Observable<EntityResponseType> {
    return this.http.put<IMeternumber>(this.resourceUrl, meternumber, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMeternumber>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMeternumber[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
