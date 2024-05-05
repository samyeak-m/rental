import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBill } from 'app/shared/model/bill.model';
import { BillService } from './bill.service';

@Component({
  templateUrl: './bill-delete-dialog.component.html',
})
export class BillDeleteDialogComponent {
  bill?: IBill;

  constructor(protected billService: BillService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.billService.delete(id).subscribe(() => {
      this.eventManager.broadcast('billListModification');
      this.activeModal.close();
    });
  }
}
