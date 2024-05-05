import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { MeternumberComponent } from './meternumber.component';
import { MeternumberDetailComponent } from './meternumber-detail.component';
import { MeternumberUpdateComponent } from './meternumber-update.component';
import { MeternumberDeleteDialogComponent } from './meternumber-delete-dialog.component';
import { meternumberRoute } from './meternumber.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(meternumberRoute)],
  declarations: [MeternumberComponent, MeternumberDetailComponent, MeternumberUpdateComponent, MeternumberDeleteDialogComponent],
  entryComponents: [MeternumberDeleteDialogComponent],
})
export class RentalUiMeternumberModule {}
