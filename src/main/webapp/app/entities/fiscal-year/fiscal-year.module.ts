import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { FiscalYearComponent } from './fiscal-year.component';
import { FiscalYearDetailComponent } from './fiscal-year-detail.component';
import { FiscalYearUpdateComponent } from './fiscal-year-update.component';
import { FiscalYearDeleteDialogComponent } from './fiscal-year-delete-dialog.component';
import { fiscalYearRoute } from './fiscal-year.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(fiscalYearRoute)],
  declarations: [FiscalYearComponent, FiscalYearDetailComponent, FiscalYearUpdateComponent, FiscalYearDeleteDialogComponent],
  entryComponents: [FiscalYearDeleteDialogComponent],
})
export class RentalUiFiscalYearModule {}
