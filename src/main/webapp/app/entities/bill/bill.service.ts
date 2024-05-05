import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, createRequestOptionStatus } from 'app/shared/util/request-util';
import { IBill } from 'app/shared/model/bill.model';
import { IBillCustomer } from '../../shared/model/bill-customer.model';
import * as FileSaver from 'file-saver';
import { IFloorBlockShutter } from '../../shared/model/floorblock-shutter.model';
import { ICustomShutterElectricityBill } from '../../shared/model/custom-shutter-bill.model';
import { ICustomerRegistrationBill } from '../../shared/model/customer-registration-bill.model';
import { ICustomer } from '../../shared/model/customer.model';
import { IShutterElectricity } from '../../shared/model/shutter-electricity.model';

type EntityResponseType = HttpResponse<IBill>;
type EntityShutterElectricity = HttpResponse<IShutterElectricity>;
type EntityBillCustomer = HttpResponse<IBillCustomer>;
type EntityArrayResponseType = HttpResponse<IBill[]>;
type EntityCustomArrayResponseType = HttpResponse<IFloorBlockShutter[]>;
type EntityElectricityArray = HttpResponse<ICustomShutterElectricityBill>;

@Injectable({ providedIn: 'root' })
export class BillService {
  public resourceUrl = SERVER_API_URL + 'api/bills';
  public billProcessUrl = SERVER_API_URL + 'api/process/bill';
  public billReportUrl = SERVER_API_URL + 'api/customer/bill';
  public customerRegistrationBill = SERVER_API_URL + 'api/customer/registration/bills';
  public billPaymentUrl = SERVER_API_URL + 'api/bill/paymentstatus';
  public pdfUrl = SERVER_API_URL + 'api/generate/bill';
  public electricityShutterUrl = SERVER_API_URL + 'api/shutter';

  public electricityBillPdf = SERVER_API_URL + 'api/generate/electricity/ledger/pdf';
  constructor(protected http: HttpClient) {}

  create(bill: IBill): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bill);
    return this.http
      .post<IBill>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  createCustomerRegistratiobBill(bill: ICustomerRegistrationBill): Observable<EntityBillCustomer> {
    return this.http.post<ICustomerRegistrationBill>(this.customerRegistrationBill, bill, { observe: 'response' });
  }

  update(bill: IBill): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bill);
    return this.http
      .put<IBill>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  saveElectricityBills(customerRegistrationBill: ICustomShutterElectricityBill): Observable<EntityElectricityArray> {
    return this.http.post<ICustomShutterElectricityBill>(this.electricityShutterUrl + '/electricities', customerRegistrationBill, {
      observe: 'response',
    });
  }

  saveElectricityBill(shutterElectricity: IShutterElectricity): Observable<EntityShutterElectricity> {
    return this.http.post<IShutterElectricity>(this.electricityShutterUrl + '/electricity', shutterElectricity, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBill>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByCustomerId(customerId: number): Observable<EntityBillCustomer> {
    return this.http
      .get<IBillCustomer>(`${this.billReportUrl}/${customerId}`, {
        observe: 'response',
      })
      .pipe(map((res: EntityBillCustomer) => this.convertBillCustomerDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBill[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  search(query?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<IBill[]>(this.resourceUrl + '/query', { params: { query }, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getLatestCustomerMonth(customerId?: any): Observable<EntityResponseType> {
    return this.http
      .get<IBill>(this.resourceUrl + '/customer', { params: { customerId }, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByShutterNoAndMonth(shutterNo?: any, month?: any): Observable<EntityResponseType> {
    return this.http
      .get<IBill>(this.electricityShutterUrl + '/shutterno', { params: { shutterNo, month }, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  processDiscountAmount(bill: IBill): Observable<EntityResponseType> {
    return this.http
      .put<IBill>(this.billProcessUrl + '/discount', bill, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByCustomerIdAndMonth(customerId?: any, month?: any): Observable<EntityResponseType> {
    return this.http
      .get<IBill>(this.resourceUrl + '/customer/month', { params: { customerId, month }, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  createPdf(id?: number): void {
    this.http.get(`${this.pdfUrl}/${id}`, { responseType: 'blob' }).subscribe((file: Blob) => {
      FileSaver.saveAs(file, 'bill' + '.pdf');
    });
  }

  generatePdfForDetail(paymentStatus?: any): void {
    this.http.get(this.pdfUrl + '/detail/pdf', { params: { paymentStatus }, responseType: 'blob' }).subscribe((file: Blob) => {
      FileSaver.saveAs(file, 'billdetail' + '.pdf');
    });
  }

  generatePdfForDetailCustom(
    electricityStatus?: any,
    monthlyRentStatus?: any,
    serviceChargeStatus?: any,
    waterStatus?: any,
    billAdjust?: any,
    tdsDeduct?: any
  ): void {
    this.http
      .get(this.pdfUrl + '/custom/detail/pdf', {
        params: { electricityStatus, monthlyRentStatus, serviceChargeStatus, waterStatus, billAdjust, tdsDeduct },
        responseType: 'blob',
      })
      .subscribe((file: Blob) => {
        FileSaver.saveAs(file, 'billdetail' + '.pdf');
      });
  }

  generateElectricityPdf(customerId?: any, filterBy?: any, month?: any, fiscalYearId?: any, fromDate?: any, endDate?: any): void {
    this.http
      .get(this.electricityBillPdf, {
        params: { customerId, filterBy, month, fiscalYearId, fromDate, endDate },
        responseType: 'blob',
      })
      .subscribe((file: Blob) => {
        FileSaver.saveAs(file, 'ElectricityLedger' + '.pdf');
      });
  }

  findBillByCustomerIdAndPaymentStatus(customerId?: any): Observable<EntityResponseType> {
    return this.http
      .get<IBill>(this.billPaymentUrl, { params: { customerId }, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  pay(bill: IBill): Observable<EntityResponseType> {
    return this.http
      .put<IBill>(this.billProcessUrl + '/payment', bill, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  adjust(bill: IBill): Observable<EntityResponseType> {
    return this.http
      .put<IBill>(this.billProcessUrl + '/adjust', bill, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  filter(
    customerId?: any,
    filterBy?: any,
    month?: any,
    fiscalYearId?: any,
    fromDate?: any,
    toDate?: any
  ): Observable<EntityCustomArrayResponseType> {
    return this.http.get<IFloorBlockShutter[]>(this.resourceUrl + '/filter', {
      params: { customerId, filterBy, month, fiscalYearId, fromDate, toDate },
      observe: 'response',
    });
  }

  findAll(): Observable<EntityCustomArrayResponseType> {
    return this.http.get<IFloorBlockShutter[]>(this.resourceUrl + '/floors/blocks', { observe: 'response' });
  }

  queryPaymentStatus(paymentStatus?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<IBill[]>(this.resourceUrl + '/status', { params: { paymentStatus }, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(bill: IBill): IBill {
    const copy: IBill = Object.assign({}, bill, {
      createdDate: bill.createdDate && bill.createdDate.isValid() ? bill.createdDate.toJSON() : undefined,
      updatedDate: bill.updatedDate && bill.updatedDate.isValid() ? bill.updatedDate.toJSON() : undefined,
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
  protected convertBillCustomerDateFromServer(res: EntityBillCustomer): EntityBillCustomer {
    if (res.body) {
      res.body.bills.forEach((bill: IBill) => {
        bill.createdDate = bill.createdDate ? moment(bill.createdDate) : undefined;
        bill.updatedDate = bill.updatedDate ? moment(bill.updatedDate) : undefined;
      });
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bill: IBill) => {
        bill.createdDate = bill.createdDate ? moment(bill.createdDate) : undefined;
        bill.updatedDate = bill.updatedDate ? moment(bill.updatedDate) : undefined;
      });
    }
    return res;
  }
}
