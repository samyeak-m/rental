import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { BillCustomer, IBillCustomer } from '../../shared/model/bill-customer.model';
import { BillService } from './bill.service';
import { Authority } from '../../shared/constants/authority.constants';
import { UserRouteAccessService } from '../../core/auth/user-route-access-service';
import { BillCustomerComponent } from './bill-customer.component';
import { BillComponent } from './bill.component';

@Injectable({ providedIn: 'root' })
export class BillCustomerResolve implements Resolve<IBillCustomer> {
  constructor(private service: BillService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBillCustomer> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.findByCustomerId(id).pipe(
        flatMap((customer: HttpResponse<BillCustomer>) => {
          if (customer.body) {
            return of(customer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BillCustomer());
  }
}

export const billCustomerRoute: Routes = [
  {
    path: '',
    component: BillComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.customer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/billview',
    component: BillCustomerComponent,
    resolve: {
      billCustomer: BillCustomerResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.customer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
