import { Component, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-save-alert',
  templateUrl: './save-alert-entity.component.html',
})
export class SaveAlertEntityComponent {
  constructor(private router: Router, public activeModal: NgbModal) {}

  closeAlert(): void {
    this.activeModal.dismissAll();
  }
}
