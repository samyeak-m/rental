import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IElectricityType } from 'app/shared/model/electricity-type.model';
import { ElectricityTypeService } from './electricity-type.service';

@Component({
  templateUrl: './electricity-type-delete-dialog.component.html',
})
export class ElectricityTypeDeleteDialogComponent {
  electricityType?: IElectricityType;

  constructor(
    protected electricityTypeService: ElectricityTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.electricityTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('electricityTypeListModification');
      this.activeModal.close();
    });
  }
}
