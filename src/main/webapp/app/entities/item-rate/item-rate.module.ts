import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { ItemRateComponent } from './item-rate.component';
import { ItemRateDetailComponent } from './item-rate-detail.component';
import { ItemRateUpdateComponent } from './item-rate-update.component';
import { ItemRateDeleteDialogComponent } from './item-rate-delete-dialog.component';
import { itemRateRoute } from './item-rate.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(itemRateRoute)],
  declarations: [ItemRateComponent, ItemRateDetailComponent, ItemRateUpdateComponent, ItemRateDeleteDialogComponent],
  entryComponents: [ItemRateDeleteDialogComponent],
})
export class RentalUiItemRateModule {}
