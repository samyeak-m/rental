import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMeternumber } from 'app/shared/model/meternumber.model';
import { MeternumberService } from './meternumber.service';

@Component({
  templateUrl: './meternumber-delete-dialog.component.html',
})
export class MeternumberDeleteDialogComponent {
  meternumber?: IMeternumber;

  constructor(
    protected meternumberService: MeternumberService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.meternumberService.delete(id).subscribe(() => {
      this.eventManager.broadcast('meternumberListModification');
      this.activeModal.close();
    });
  }
}
