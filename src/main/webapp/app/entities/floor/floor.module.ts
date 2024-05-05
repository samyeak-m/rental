import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { FloorComponent } from './floor.component';
import { FloorDetailComponent } from './floor-detail.component';
import { FloorUpdateComponent } from './floor-update.component';
import { FloorDeleteDialogComponent } from './floor-delete-dialog.component';
import { floorRoute } from './floor.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(floorRoute)],
  declarations: [FloorComponent, FloorDetailComponent, FloorUpdateComponent, FloorDeleteDialogComponent],
  entryComponents: [FloorDeleteDialogComponent],
})
export class RentalUiFloorModule {}
