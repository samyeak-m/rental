import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICustomerRegistration } from 'app/shared/model/customer-registration.model';
import { CustomerRegistrationService } from './customer-registration.service';

@Component({
  templateUrl: './customer-registration-delete-dialog.component.html',
})
export class CustomerRegistrationDeleteDialogComponent {
  customerRegistration?: ICustomerRegistration;

  constructor(
    protected customerRegistrationService: CustomerRegistrationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.customerRegistrationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('customerRegistrationListModification');
      this.activeModal.close();
    });
  }
}
