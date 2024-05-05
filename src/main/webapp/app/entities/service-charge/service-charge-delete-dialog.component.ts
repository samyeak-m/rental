import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IServiceCharge } from 'app/shared/model/service-charge.model';
import { ServiceChargeService } from './service-charge.service';

@Component({
  templateUrl: './service-charge-delete-dialog.component.html',
})
export class ServiceChargeDeleteDialogComponent {
  serviceCharge?: IServiceCharge;

  constructor(
    protected serviceChargeService: ServiceChargeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceChargeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('serviceChargeListModification');
      this.activeModal.close();
    });
  }
}
