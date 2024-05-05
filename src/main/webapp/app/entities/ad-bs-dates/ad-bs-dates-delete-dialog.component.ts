import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAdBsDates } from 'app/shared/model/ad-bs-dates.model';
import { AdBsDatesService } from './ad-bs-dates.service';

@Component({
  templateUrl: './ad-bs-dates-delete-dialog.component.html',
})
export class AdBsDatesDeleteDialogComponent {
  adBsDates?: IAdBsDates;

  constructor(protected adBsDatesService: AdBsDatesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.adBsDatesService.delete(id).subscribe(() => {
      this.eventManager.broadcast('adBsDatesListModification');
      this.activeModal.close();
    });
  }
}
