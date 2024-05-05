import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICustomerRegistration, CustomerRegistration } from 'app/shared/model/customer-registration.model';
import { CustomerRegistrationService } from './customer-registration.service';
import { CustomerRegistrationComponent } from './customer-registration.component';
import { CustomerRegistrationDetailComponent } from './customer-registration-detail.component';
import { CustomerRegistrationUpdateComponent } from './customer-registration-update.component';
import { AdBsDatesService } from '../ad-bs-dates/ad-bs-dates.service';
import { FiscalYear, IFiscalYear } from '../../shared/model/fiscal-year.model';
import { IAdBsDates } from '../../shared/model/ad-bs-dates.model';
import { ElectricityFillComponent } from '../electricity-fill/electricity-fill.component';

@Injectable({ providedIn: 'root' })
export class CustomerRegistrationResolve implements Resolve<ICustomerRegistration> {
  fiscalYR: IFiscalYear = new FiscalYear();
  customerRegistration: ICustomerRegistration = new CustomerRegistration();
  fiscalBsStart?: string;
  fiscalBsEnd?: number;
  bsEnd?: string;
  constructor(private service: CustomerRegistrationService, private adBsDateService: AdBsDatesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomerRegistration> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((customerRegistration: HttpResponse<CustomerRegistration>) => {
          if (customerRegistration.body) {
            return of(customerRegistration.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    } else {
      return this.adBsDateService.verifyFiscal().pipe(
        flatMap((relateBsAd: HttpResponse<IAdBsDates>) => {
          if (relateBsAd.body) {
            if (relateBsAd.body.id) {
              this.customerRegistration.fiscalBsEnd = relateBsAd.body.bsDate?.substring(0, 4);
              this.customerRegistration.fiscalBsStart = relateBsAd.body.lastBS?.substring(0, 4);
              return of(this.customerRegistration);
            } else {
              return of(new CustomerRegistration());
            }
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CustomerRegistration());
  }
}

export const customerRegistrationRoute: Routes = [
  {
    path: '',
    component: CustomerRegistrationComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.customerRegistration.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerRegistrationDetailComponent,
    resolve: {
      customerRegistration: CustomerRegistrationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.customerRegistration.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerRegistrationUpdateComponent,
    resolve: {
      customerRegistration: CustomerRegistrationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.customerRegistration.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'fill-electricity',
    component: ElectricityFillComponent,
    resolve: {
      customerRegistration: CustomerRegistrationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.customerRegistration.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerRegistrationUpdateComponent,
    resolve: {
      customerRegistration: CustomerRegistrationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.customerRegistration.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
