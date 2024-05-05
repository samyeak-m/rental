import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { ShutterComponent } from './shutter.component';
import { ShutterDetailComponent } from './shutter-detail.component';
import { ShutterUpdateComponent } from './shutter-update.component';
import { ShutterDeleteDialogComponent } from './shutter-delete-dialog.component';
import { shutterRoute } from './shutter.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(shutterRoute)],
  declarations: [ShutterComponent, ShutterDetailComponent, ShutterUpdateComponent, ShutterDeleteDialogComponent],
  entryComponents: [ShutterDeleteDialogComponent],
})
export class RentalUiShutterModule {}
