import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { BusinessTypeComponent } from './business-type.component';
import { BusinessTypeDetailComponent } from './business-type-detail.component';
import { BusinessTypeUpdateComponent } from './business-type-update.component';
import { BusinessTypeDeleteDialogComponent } from './business-type-delete-dialog.component';
import { businessTypeRoute } from './business-type.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(businessTypeRoute)],
  declarations: [BusinessTypeComponent, BusinessTypeDetailComponent, BusinessTypeUpdateComponent, BusinessTypeDeleteDialogComponent],
  entryComponents: [BusinessTypeDeleteDialogComponent],
})
export class RentalUiBusinessTypeModule {}
