import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICustomer } from 'app/shared/model/customer.model';
import * as FileSaver from 'file-saver';
import { IFloor } from '../../shared/model/floor.model';

type EntityResponseType = HttpResponse<ICustomer>;
type EntityArrayResponseType = HttpResponse<ICustomer[]>;

@Injectable({ providedIn: 'root' })
export class CustomerService {
  public resourceUrl = SERVER_API_URL + 'api/customers';
  constructor(protected http: HttpClient) {}

  create(customerDTO: FormData): Observable<EntityResponseType> {
    return this.http.post<ICustomer>(this.resourceUrl, customerDTO, { observe: 'response' });
  }

  update(customerDTO: FormData): Observable<EntityResponseType> {
    return this.http.put<ICustomer>(this.resourceUrl, customerDTO, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICustomer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  uploadFile(uploadList: FormData): Observable<EntityResponseType> {
    return this.http.post<IFloor>(this.resourceUrl + '/upload', uploadList, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICustomer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  finadAll(): Observable<EntityArrayResponseType> {
    return this.http
      .get<ICustomer[]>(this.resourceUrl + '/all', { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  filter(query?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<ICustomer[]>(this.resourceUrl + '/filter', { params: { query }, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  downloadDocumentFile(id?: number, fileName?: string): void {
    this.http.get(`${this.resourceUrl + '/download/document'}/${id}`, { responseType: 'blob' }).subscribe((file: Blob) => {
      FileSaver.saveAs(file, fileName);
    });
  }

  downloadVatDocumentFile(id?: number, fileName?: string): void {
    this.http.get(`${this.resourceUrl + '/download/vat'}/${id}`, { responseType: 'blob' }).subscribe((file: Blob) => {
      FileSaver.saveAs(file, fileName);
    });
  }

  getLatestCode(): Observable<EntityResponseType> {
    return this.http
      .get<ICustomer>(`${this.resourceUrl}/code`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(customer: ICustomer): ICustomer {
    const copy: ICustomer = Object.assign({}, customer, {
      createdDate: customer.createdDate && customer.createdDate.isValid() ? customer.createdDate.toJSON() : undefined,
      updatedDate: customer.updatedDate && customer.updatedDate.isValid() ? customer.updatedDate.toJSON() : undefined,
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
      res.body.forEach((customer: ICustomer) => {
        customer.createdDate = customer.createdDate ? moment(customer.createdDate) : undefined;
        customer.updatedDate = customer.updatedDate ? moment(customer.updatedDate) : undefined;
      });
    }
    return res;
  }

  findCustomers(): Observable<EntityArrayResponseType> {
    return this.http
      .get<ICustomer[]>(this.resourceUrl, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
