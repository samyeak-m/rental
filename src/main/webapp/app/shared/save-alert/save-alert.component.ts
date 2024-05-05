import { Component, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-save-alert',
  templateUrl: './save-alert.component.html',
})
export class SaveAlertComponent {
  constructor(private router: Router, public activeModal: NgbActiveModal) {}

  closeAlert(): void {
    this.activeModal.dismiss('cancel');
    this.router.navigate(['/']);
  }
}
