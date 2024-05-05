import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICashReceipt } from 'app/shared/model/cash-receipt.model';
import { CashReceiptService } from './cash-receipt.service';

@Component({
  templateUrl: './cash-receipt-delete-dialog.component.html',
})
export class CashReceiptDeleteDialogComponent {
  cashReceipt?: ICashReceipt;

  constructor(
    protected cashReceiptService: CashReceiptService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cashReceiptService.delete(id).subscribe(() => {
      this.eventManager.broadcast('cashReceiptListModification');
      this.activeModal.close();
    });
  }
}
