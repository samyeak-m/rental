import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SaveAlertComponent } from '../../shared/save-alert/save-alert.component';
import { SaveAlertEntityComponent } from '../../shared/save-alert/save-alert-entity.component';

@Injectable({ providedIn: 'root' })
export class SaveAlertModalService {
  private isOpen = false;

  constructor(private modalService: NgbModal) {}

  open(): void {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    const modalRef: NgbModalRef = this.modalService.open(SaveAlertComponent);
    modalRef.result.finally(() => (this.isOpen = false));
  }

  saveAlert(): void {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    const modalRef: NgbModalRef = this.modalService.open(SaveAlertEntityComponent);
    modalRef.result.finally(() => (this.isOpen = false));
  }
}
