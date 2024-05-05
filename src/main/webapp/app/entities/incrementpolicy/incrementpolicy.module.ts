import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { IncrementpolicyComponent } from './incrementpolicy.component';
import { IncrementpolicyDetailComponent } from './incrementpolicy-detail.component';
import { IncrementpolicyUpdateComponent } from './incrementpolicy-update.component';
import { IncrementpolicyDeleteDialogComponent } from './incrementpolicy-delete-dialog.component';
import { incrementpolicyRoute } from './incrementpolicy.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(incrementpolicyRoute)],
  declarations: [
    IncrementpolicyComponent,
    IncrementpolicyDetailComponent,
    IncrementpolicyUpdateComponent,
    IncrementpolicyDeleteDialogComponent,
  ],
  entryComponents: [IncrementpolicyDeleteDialogComponent],
})
export class RentalUiIncrementpolicyModule {}
