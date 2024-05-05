import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CashReceipt, ICashReceipt } from 'app/shared/model/cash-receipt.model';
import { CashReceiptService } from './cash-receipt.service';

@Component({
  selector: 'jhi-cash-receipt-detail',
  templateUrl: './cash-receipt-detail.component.html',
  styleUrls: ['cash-receiptdetail.scss'],
})
export class CashReceiptDetailComponent implements OnInit {
  cashReceipt: ICashReceipt | any = new CashReceipt();

  constructor(protected activatedRoute: ActivatedRoute, protected cashReceiptService: CashReceiptService) {}

  generatePdf(id?: number): void {
    this.cashReceiptService.createPdf(id);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cashReceipt }) => (this.cashReceipt = cashReceipt));
  }

  previousState(): void {
    window.history.back();
  }
}
