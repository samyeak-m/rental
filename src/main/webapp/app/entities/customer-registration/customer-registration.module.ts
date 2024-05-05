import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { CustomerRegistrationComponent } from './customer-registration.component';
import { CustomerRegistrationDetailComponent } from './customer-registration-detail.component';
import { CustomerRegistrationUpdateComponent } from './customer-registration-update.component';
import { CustomerRegistrationDeleteDialogComponent } from './customer-registration-delete-dialog.component';
import { customerRegistrationRoute } from './customer-registration.route';
import { ElectricityFillComponent } from '../electricity-fill/electricity-fill.component';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(customerRegistrationRoute)],
  declarations: [
    CustomerRegistrationComponent,
    CustomerRegistrationDetailComponent,
    CustomerRegistrationUpdateComponent,
    CustomerRegistrationDeleteDialogComponent,
    ElectricityFillComponent,
  ],
  entryComponents: [CustomerRegistrationDeleteDialogComponent],
})
export class RentalUiCustomerRegistrationModule {}
