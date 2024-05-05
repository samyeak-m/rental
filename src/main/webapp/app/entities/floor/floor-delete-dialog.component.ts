import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFloor } from 'app/shared/model/floor.model';
import { FloorService } from './floor.service';

@Component({
  templateUrl: './floor-delete-dialog.component.html',
})
export class FloorDeleteDialogComponent {
  floor?: IFloor;

  constructor(protected floorService: FloorService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.floorService.delete(id).subscribe(() => {
      this.eventManager.broadcast('floorListModification');
      this.activeModal.close();
    });
  }
}
