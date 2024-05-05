import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { BillComponent } from './bill.component';
import { BillDetailComponent } from './bill-detail.component';
import { BillUpdateComponent } from './bill-update.component';
import { BillDeleteDialogComponent } from './bill-delete-dialog.component';
import { billRoute } from './bill.route';
import { billCustomerRoute } from './bill.customer.route';
import { BillCustomerComponent } from './bill-customer.component';
import { BillsUpdateComponent } from './bills-update.component';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(billRoute), RouterModule.forChild(billCustomerRoute)],
  declarations: [
    BillComponent,
    BillCustomerComponent,
    BillDetailComponent,
    BillUpdateComponent,
    BillDeleteDialogComponent,
    BillsUpdateComponent,
  ],
  entryComponents: [BillDeleteDialogComponent],
})
export class RentalUiBillModule {}
