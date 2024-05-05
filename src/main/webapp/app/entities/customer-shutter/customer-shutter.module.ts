import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { CustomerShutterComponent } from './customer-shutter.component';
import { CustomerShutterDetailComponent } from './customer-shutter-detail.component';
import { CustomerShutterUpdateComponent } from './customer-shutter-update.component';
import { CustomerShutterDeleteDialogComponent } from './customer-shutter-delete-dialog.component';
import { customerShutterRoute } from './customer-shutter.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(customerShutterRoute)],
  declarations: [
    CustomerShutterComponent,
    CustomerShutterDetailComponent,
    CustomerShutterUpdateComponent,
    CustomerShutterDeleteDialogComponent,
  ],
  entryComponents: [CustomerShutterDeleteDialogComponent],
})
export class RentalUiCustomerShutterModule {}
