import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ad-bs-dates',
        loadChildren: () => import('./ad-bs-dates/ad-bs-dates.module').then(m => m.RentalUiAdBsDatesModule),
      },
      {
        path: 'fiscal-year',
        loadChildren: () => import('./fiscal-year/fiscal-year.module').then(m => m.RentalUiFiscalYearModule),
      },
      {
        path: 'organization',
        loadChildren: () => import('./organization/organization.module').then(m => m.RentalUiOrganizationModule),
      },
      {
        path: 'country',
        loadChildren: () => import('./country/country.module').then(m => m.RentalUiCountryModule),
      },
      {
        path: 'floor',
        loadChildren: () => import('./floor/floor.module').then(m => m.RentalUiFloorModule),
      },
      {
        path: 'shutter',
        loadChildren: () => import('./shutter/shutter.module').then(m => m.RentalUiShutterModule),
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.RentalUiCustomerModule),
      },
      {
        path: 'electricity-type',
        loadChildren: () => import('./electricity-type/electricity-type.module').then(m => m.RentalUiElectricityTypeModule),
      },
      {
        path: 'business-type',
        loadChildren: () => import('./business-type/business-type.module').then(m => m.RentalUiBusinessTypeModule),
      },
      {
        path: 'bill-particulars',
        loadChildren: () => import('./bill-particulars/bill-particulars.module').then(m => m.RentalUiBillParticularsModule),
      },
      {
        path: 'service-charge',
        loadChildren: () => import('./service-charge/service-charge.module').then(m => m.RentalUiServiceChargeModule),
      },
      {
        path: 'customer-registration',
        loadChildren: () => import('./customer-registration/customer-registration.module').then(m => m.RentalUiCustomerRegistrationModule),
      },
      {
        path: 'customer-shutter',
        loadChildren: () => import('./customer-shutter/customer-shutter.module').then(m => m.RentalUiCustomerShutterModule),
      },
      {
        path: 'item',
        loadChildren: () => import('./item/item.module').then(m => m.RentalUiItemModule),
      },
      {
        path: 'bill',
        loadChildren: () => import('./bill/bill.module').then(m => m.RentalUiBillModule),
      },
      {
        path: 'item-rate',
        loadChildren: () => import('./item-rate/item-rate.module').then(m => m.RentalUiItemRateModule),
      },
      {
        path: 'cash-receipt',
        loadChildren: () => import('./cash-receipt/cash-receipt.module').then(m => m.RentalUiCashReceiptModule),
      },
      {
        path: 'discount-policy',
        loadChildren: () => import('./discount-policy/discount-policy.module').then(m => m.RentalUiDiscountPolicyModule),
      },
      {
        path: 'ledger',
        loadChildren: () => import('./ledger/ledger.module').then(m => m.RentalUiLedgerModule),
      },

      {
        path: 'incrementpolicy',
        loadChildren: () => import('./incrementpolicy/incrementpolicy.module').then(m => m.RentalUiIncrementpolicyModule),
      },
      {
        path: 'notification',
        loadChildren: () => import('./notification/notification.module').then(m => m.RentalUiNotificationModule),
      },
      {
        path: 'block',
        loadChildren: () => import('./block/block.module').then(m => m.RentalUiBlockModule),
      },
      {
        path: 'meternumber',
        loadChildren: () => import('./meternumber/meternumber.module').then(m => m.RentalUiMeternumberModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class RentalUiEntityModule {}
