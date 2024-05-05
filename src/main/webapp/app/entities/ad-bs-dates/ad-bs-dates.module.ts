import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RentalUiSharedModule } from 'app/shared/shared.module';
import { AdBsDatesComponent } from './ad-bs-dates.component';
import { AdBsDatesDetailComponent } from './ad-bs-dates-detail.component';
import { AdBsDatesUpdateComponent } from './ad-bs-dates-update.component';
import { AdBsDatesDeleteDialogComponent } from './ad-bs-dates-delete-dialog.component';
import { adBsDatesRoute } from './ad-bs-dates.route';

@NgModule({
  imports: [RentalUiSharedModule, RouterModule.forChild(adBsDatesRoute)],
  declarations: [AdBsDatesComponent, AdBsDatesDetailComponent, AdBsDatesUpdateComponent, AdBsDatesDeleteDialogComponent],
  entryComponents: [AdBsDatesDeleteDialogComponent],
})
export class RentalUiAdBsDatesModule {}
