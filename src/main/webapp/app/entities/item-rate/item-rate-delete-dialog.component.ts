import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IItemRate } from 'app/shared/model/item-rate.model';
import { ItemRateService } from './item-rate.service';

@Component({
  templateUrl: './item-rate-delete-dialog.component.html',
})
export class ItemRateDeleteDialogComponent {
  itemRate?: IItemRate;

  constructor(protected itemRateService: ItemRateService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemRateService.delete(id).subscribe(() => {
      this.eventManager.broadcast('itemRateListModification');
      this.activeModal.close();
    });
  }
}
