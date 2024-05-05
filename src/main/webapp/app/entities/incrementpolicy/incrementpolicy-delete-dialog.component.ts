import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IIncrementpolicy } from 'app/shared/model/incrementpolicy.model';
import { IncrementpolicyService } from './incrementpolicy.service';

@Component({
  templateUrl: './incrementpolicy-delete-dialog.component.html',
})
export class IncrementpolicyDeleteDialogComponent {
  incrementpolicy?: IIncrementpolicy;

  constructor(
    protected incrementpolicyService: IncrementpolicyService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.incrementpolicyService.delete(id).subscribe(() => {
      this.eventManager.broadcast('incrementpolicyListModification');
      this.activeModal.close();
    });
  }
}
