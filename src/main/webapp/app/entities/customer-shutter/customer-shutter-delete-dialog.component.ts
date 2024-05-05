import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICustomerShutter } from 'app/shared/model/customer-shutter.model';
import { CustomerShutterService } from './customer-shutter.service';

@Component({
  templateUrl: './customer-shutter-delete-dialog.component.html',
})
export class CustomerShutterDeleteDialogComponent {
  customerShutter?: ICustomerShutter;

  constructor(
    protected customerShutterService: CustomerShutterService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.customerShutterService.delete(id).subscribe(() => {
      this.eventManager.broadcast('customerShutterListModification');
      this.activeModal.close();
    });
  }
}
