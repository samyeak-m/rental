import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICustomerShutter, CustomerShutter } from 'app/shared/model/customer-shutter.model';
import { CustomerShutterService } from './customer-shutter.service';
import { CustomerShutterComponent } from './customer-shutter.component';
import { CustomerShutterDetailComponent } from './customer-shutter-detail.component';
import { CustomerShutterUpdateComponent } from './customer-shutter-update.component';

@Injectable({ providedIn: 'root' })
export class CustomerShutterResolve implements Resolve<ICustomerShutter> {
  constructor(private service: CustomerShutterService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomerShutter> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((customerShutter: HttpResponse<CustomerShutter>) => {
          if (customerShutter.body) {
            return of(customerShutter.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CustomerShutter());
  }
}

export const customerShutterRoute: Routes = [
  {
    path: '',
    component: CustomerShutterComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.customerShutter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerShutterDetailComponent,
    resolve: {
      customerShutter: CustomerShutterResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.customerShutter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerShutterUpdateComponent,
    resolve: {
      customerShutter: CustomerShutterResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.customerShutter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerShutterUpdateComponent,
    resolve: {
      customerShutter: CustomerShutterResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.customerShutter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
