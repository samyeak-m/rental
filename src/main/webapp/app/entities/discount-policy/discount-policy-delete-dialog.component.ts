import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDiscountPolicy } from 'app/shared/model/discount-policy.model';
import { DiscountPolicyService } from './discount-policy.service';

@Component({
  templateUrl: './discount-policy-delete-dialog.component.html',
})
export class DiscountPolicyDeleteDialogComponent {
  discountPolicy?: IDiscountPolicy;

  constructor(
    protected discountPolicyService: DiscountPolicyService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.discountPolicyService.delete(id).subscribe(() => {
      this.eventManager.broadcast('discountPolicyListModification');
      this.activeModal.close();
    });
  }
}
