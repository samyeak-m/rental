import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBusinessType } from 'app/shared/model/business-type.model';
import { BusinessTypeService } from './business-type.service';

@Component({
  templateUrl: './business-type-delete-dialog.component.html',
})
export class BusinessTypeDeleteDialogComponent {
  businessType?: IBusinessType;

  constructor(
    protected businessTypeService: BusinessTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.businessTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('businessTypeListModification');
      this.activeModal.close();
    });
  }
}
