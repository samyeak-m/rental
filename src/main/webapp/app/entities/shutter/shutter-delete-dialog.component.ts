import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShutter } from 'app/shared/model/shutter.model';
import { ShutterService } from './shutter.service';

@Component({
  templateUrl: './shutter-delete-dialog.component.html',
})
export class ShutterDeleteDialogComponent {
  shutter?: IShutter;

  constructor(protected shutterService: ShutterService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shutterService.delete(id).subscribe(() => {
      this.eventManager.broadcast('shutterListModification');
      this.activeModal.close();
    });
  }
}
