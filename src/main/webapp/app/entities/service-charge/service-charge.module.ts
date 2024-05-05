import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { ServiceChargeComponent } from './service-charge.component';
import { ServiceChargeDetailComponent } from './service-charge-detail.component';
import { ServiceChargeUpdateComponent } from './service-charge-update.component';
import { ServiceChargeDeleteDialogComponent } from './service-charge-delete-dialog.component';
import { serviceChargeRoute } from './service-charge.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(serviceChargeRoute)],
  declarations: [ServiceChargeComponent, ServiceChargeDetailComponent, ServiceChargeUpdateComponent, ServiceChargeDeleteDialogComponent],
  entryComponents: [ServiceChargeDeleteDialogComponent],
})
export class RentalUiServiceChargeModule {}
