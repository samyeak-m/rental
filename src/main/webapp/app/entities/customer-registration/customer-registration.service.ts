import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICustomerRegistration } from 'app/shared/model/customer-registration.model';
import { ICustomerRegistrationBill } from '../../shared/model/customer-registration-bill.model';
import { IBill } from '../../shared/model/bill.model';

type EntityResponseType = HttpResponse<ICustomerRegistration>;
type EntityArrayResponseType = HttpResponse<ICustomerRegistration[]>;
type CustomEntityResponseType = HttpResponse<ICustomerRegistrationBill>;
@Injectable({ providedIn: 'root' })
export class CustomerRegistrationService {
  public resourceUrl = SERVER_API_URL + 'api/customer-registrations';
  public registrationUrl = SERVER_API_URL + 'api/getlatestRegisNumber';
  public applicationUrl = SERVER_API_URL + 'api/getlatestapplicationnumber';
  public activeRegistrationsUrl = SERVER_API_URL + 'api/active/registrations';
  public billCustomerRegistrationUrl = SERVER_API_URL + 'api/customer/registration/bill';
  public searchUrl = SERVER_API_URL + 'api/findbycustomer';
  constructor(protected http: HttpClient) {}

  create(customerRegistration: ICustomerRegistration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customerRegistration);
    return this.http
      .post<ICustomerRegistration>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(customerRegistration: ICustomerRegistration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customerRegistration);
    return this.http
      .put<ICustomerRegistration>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICustomerRegistration>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  search(query?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<ICustomerRegistration[]>(this.resourceUrl + '/query', { params: { query }, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getLatestRegistrationNumber(): Observable<EntityResponseType> {
    return this.http
      .get<ICustomerRegistration>(this.registrationUrl, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  getLatestApplicationNumber(): Observable<EntityResponseType> {
    return this.http
      .get<ICustomerRegistration>(this.applicationUrl, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAllActiveRegistrations(): Observable<EntityArrayResponseType> {
    return this.http
      .get<ICustomerRegistration[]>(this.activeRegistrationsUrl, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  searchAllActiveRegistrations(query?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<ICustomerRegistration[]>(this.activeRegistrationsUrl + '/search', { params: { query }, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICustomerRegistration[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByCustomerId(customerId?: any): Observable<EntityResponseType> {
    return this.http
      .get<ICustomerRegistration>(this.searchUrl, { params: { customerId }, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(customerRegistration: ICustomerRegistration): ICustomerRegistration {
    const copy: ICustomerRegistration = Object.assign({}, customerRegistration, {
      advancementTillDate:
        customerRegistration.advancementTillDate && customerRegistration.advancementTillDate.isValid()
          ? customerRegistration.advancementTillDate.toJSON()
          : undefined,
      enteredDate:
        customerRegistration.enteredDate && customerRegistration.enteredDate.isValid()
          ? customerRegistration.enteredDate.toJSON()
          : undefined,
      approvedDate:
        customerRegistration.approvedDate && customerRegistration.approvedDate.isValid()
          ? customerRegistration.approvedDate.toJSON()
          : undefined,
      createdDate:
        customerRegistration.createdDate && customerRegistration.createdDate.isValid()
          ? customerRegistration.createdDate.toJSON()
          : undefined,
      updatedDate:
        customerRegistration.updatedDate && customerRegistration.updatedDate.isValid()
          ? customerRegistration.updatedDate.toJSON()
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.advancementTillDate = res.body.advancementTillDate ? moment(res.body.advancementTillDate) : undefined;
      res.body.enteredDate = res.body.enteredDate ? moment(res.body.enteredDate) : undefined;
      res.body.approvedDate = res.body.approvedDate ? moment(res.body.approvedDate) : undefined;
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? moment(res.body.updatedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((customerRegistration: ICustomerRegistration) => {
        customerRegistration.advancementTillDate = customerRegistration.advancementTillDate
          ? moment(customerRegistration.advancementTillDate)
          : undefined;
        customerRegistration.enteredDate = customerRegistration.enteredDate ? moment(customerRegistration.enteredDate) : undefined;
        customerRegistration.approvedDate = customerRegistration.approvedDate ? moment(customerRegistration.approvedDate) : undefined;
        customerRegistration.createdDate = customerRegistration.createdDate ? moment(customerRegistration.createdDate) : undefined;
        customerRegistration.updatedDate = customerRegistration.updatedDate ? moment(customerRegistration.updatedDate) : undefined;
      });
    }
    return res;
  }
}
