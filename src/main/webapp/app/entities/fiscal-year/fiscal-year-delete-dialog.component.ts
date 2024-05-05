import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFiscalYear } from 'app/shared/model/fiscal-year.model';
import { FiscalYearService } from './fiscal-year.service';

@Component({
  templateUrl: './fiscal-year-delete-dialog.component.html',
})
export class FiscalYearDeleteDialogComponent {
  fiscalYear?: IFiscalYear;

  constructor(
    protected fiscalYearService: FiscalYearService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fiscalYearService.delete(id).subscribe(() => {
      this.eventManager.broadcast('fiscalYearListModification');
      this.activeModal.close();
    });
  }
}
