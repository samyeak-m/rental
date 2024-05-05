import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { CashReceiptComponent } from './cash-receipt.component';
import { CashReceiptDetailComponent } from './cash-receipt-detail.component';
import { CashReceiptUpdateComponent } from './cash-receipt-update.component';
import { CashReceiptDeleteDialogComponent } from './cash-receipt-delete-dialog.component';
import { cashReceiptRoute } from './cash-receipt.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(cashReceiptRoute)],
  declarations: [CashReceiptComponent, CashReceiptDetailComponent, CashReceiptUpdateComponent, CashReceiptDeleteDialogComponent],
  entryComponents: [CashReceiptDeleteDialogComponent],
})
export class RentalUiCashReceiptModule {}
