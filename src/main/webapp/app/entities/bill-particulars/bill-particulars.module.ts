import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { BillParticularsComponent } from './bill-particulars.component';
import { BillParticularsDetailComponent } from './bill-particulars-detail.component';
import { BillParticularsUpdateComponent } from './bill-particulars-update.component';
import { BillParticularsDeleteDialogComponent } from './bill-particulars-delete-dialog.component';
import { billParticularsRoute } from './bill-particulars.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(billParticularsRoute)],
  declarations: [
    BillParticularsComponent,
    BillParticularsDetailComponent,
    BillParticularsUpdateComponent,
    BillParticularsDeleteDialogComponent,
  ],
  entryComponents: [BillParticularsDeleteDialogComponent],
})
export class RentalUiBillParticularsModule {}
