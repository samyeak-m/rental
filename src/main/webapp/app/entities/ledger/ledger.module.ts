import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { LedgerComponent } from './ledger.component';
import { LedgerDetailComponent } from './ledger-detail.component';
import { LedgerUpdateComponent } from './ledger-update.component';
import { LedgerDeleteDialogComponent } from './ledger-delete-dialog.component';
import { ledgerRoute } from './ledger.route';
import { ElectricityLedgerComponent } from './electricity-ledger.component';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(ledgerRoute)],
  declarations: [LedgerComponent, LedgerDetailComponent, LedgerUpdateComponent, LedgerDeleteDialogComponent, ElectricityLedgerComponent],
  entryComponents: [LedgerDeleteDialogComponent],
})
export class RentalUiLedgerModule {}
