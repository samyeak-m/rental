import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { ElectricityTypeComponent } from './electricity-type.component';
import { ElectricityTypeDetailComponent } from './electricity-type-detail.component';
import { ElectricityTypeUpdateComponent } from './electricity-type-update.component';
import { ElectricityTypeDeleteDialogComponent } from './electricity-type-delete-dialog.component';
import { electricityTypeRoute } from './electricity-type.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(electricityTypeRoute)],
  declarations: [
    ElectricityTypeComponent,
    ElectricityTypeDetailComponent,
    ElectricityTypeUpdateComponent,
    ElectricityTypeDeleteDialogComponent,
  ],
  entryComponents: [ElectricityTypeDeleteDialogComponent],
})
export class RentalUiElectricityTypeModule {}
