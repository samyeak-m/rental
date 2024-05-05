import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IBlock } from 'app/shared/model/block.model';
import { IDiscountPolicy } from '../../shared/model/discount-policy.model';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IBlock>;
type EntityArrayResponseType = HttpResponse<IBlock[]>;

@Injectable({ providedIn: 'root' })
export class BlockService {
  public resourceUrl = SERVER_API_URL + 'api/blocks';
  public blockFilterUrl = SERVER_API_URL + 'api/blocks/not/equal/floor';

  constructor(protected http: HttpClient) {}

  create(block: IBlock): Observable<EntityResponseType> {
    return this.http.post<IBlock>(this.resourceUrl, block, { observe: 'response' });
  }

  update(block: IBlock): Observable<EntityResponseType> {
    return this.http.put<IBlock>(this.resourceUrl, block, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlock>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBlocksNotEqualToFloorId(floorId: string): Observable<EntityArrayResponseType> {
    return this.http.get<IDiscountPolicy[]>(this.blockFilterUrl, { params: { floorId }, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlock[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
