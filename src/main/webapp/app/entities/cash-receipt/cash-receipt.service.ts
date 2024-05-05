import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICashReceipt } from 'app/shared/model/cash-receipt.model';
import * as FileSaver from 'file-saver';

type EntityResponseType = HttpResponse<ICashReceipt>;
type EntityArrayResponseType = HttpResponse<ICashReceipt[]>;

@Injectable({ providedIn: 'root' })
export class CashReceiptService {
  public resourceUrl = SERVER_API_URL + 'api/cash-receipts';
  public pdfUrl = SERVER_API_URL + 'api/generate/cash/receipt/bill';

  constructor(protected http: HttpClient) {}

  create(cashReceipt: ICashReceipt): Observable<EntityResponseType> {
    return this.http.post<ICashReceipt>(this.resourceUrl, cashReceipt, { observe: 'response' });
  }

  update(cashReceipt: ICashReceipt): Observable<EntityResponseType> {
    return this.http.put<ICashReceipt>(this.resourceUrl, cashReceipt, { observe: 'response' });
  }

  createPdf(id?: number): void {
    this.http.get(`${this.pdfUrl}/${id}`, { responseType: 'blob' }).subscribe((file: Blob) => {
      FileSaver.saveAs(file, 'cash-receipt' + '.pdf');
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICashReceipt>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICashReceipt[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
