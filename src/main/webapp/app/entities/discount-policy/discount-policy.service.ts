import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDiscountPolicy } from 'app/shared/model/discount-policy.model';
import { ICustomerRegistration } from '../../shared/model/customer-registration.model';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IDiscountPolicy>;
type EntityArrayResponseType = HttpResponse<IDiscountPolicy[]>;

@Injectable({ providedIn: 'root' })
export class DiscountPolicyService {
  public resourceUrl = SERVER_API_URL + 'api/discount-policies';
  public discountPolicyUrl = SERVER_API_URL + 'api/discount/policy';
  constructor(protected http: HttpClient) {}

  create(discountPolicy: IDiscountPolicy): Observable<EntityResponseType> {
    return this.http.post<IDiscountPolicy>(this.resourceUrl, discountPolicy, { observe: 'response' });
  }

  update(discountPolicy: IDiscountPolicy): Observable<EntityResponseType> {
    return this.http.put<IDiscountPolicy>(this.resourceUrl, discountPolicy, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDiscountPolicy>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByBusinessTypeIdAndRegistrationNumber(businessTypeId: any, registrationNumber: any): Observable<EntityArrayResponseType> {
    return this.http.get<IDiscountPolicy[]>(this.discountPolicyUrl, {
      params: { businessTypeId, registrationNumber },
      observe: 'response',
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDiscountPolicy[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
