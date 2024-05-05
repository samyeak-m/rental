import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBillParticulars } from 'app/shared/model/bill-particulars.model';
import { BillParticularsService } from './bill-particulars.service';

@Component({
  templateUrl: './bill-particulars-delete-dialog.component.html',
})
export class BillParticularsDeleteDialogComponent {
  billParticulars?: IBillParticulars;

  constructor(
    protected billParticularsService: BillParticularsService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.billParticularsService.delete(id).subscribe(() => {
      this.eventManager.broadcast('billParticularsListModification');
      this.activeModal.close();
    });
  }
}
