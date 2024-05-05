import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { DiscountPolicyComponent } from './discount-policy.component';
import { DiscountPolicyDetailComponent } from './discount-policy-detail.component';
import { DiscountPolicyUpdateComponent } from './discount-policy-update.component';
import { DiscountPolicyDeleteDialogComponent } from './discount-policy-delete-dialog.component';
import { discountPolicyRoute } from './discount-policy.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(discountPolicyRoute)],
  declarations: [
    DiscountPolicyComponent,
    DiscountPolicyDetailComponent,
    DiscountPolicyUpdateComponent,
    DiscountPolicyDeleteDialogComponent,
  ],
  entryComponents: [DiscountPolicyDeleteDialogComponent],
})
export class RentalUiDiscountPolicyModule {}
