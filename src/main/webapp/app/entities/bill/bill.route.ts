import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBill, Bill } from 'app/shared/model/bill.model';
import { BillService } from './bill.service';
import { BillComponent } from './bill.component';
import { BillDetailComponent } from './bill-detail.component';
import { BillUpdateComponent } from './bill-update.component';
import { BillsUpdateComponent } from './bills-update.component';

@Injectable({ providedIn: 'root' })
export class BillResolve implements Resolve<IBill> {
  constructor(private service: BillService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBill> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((bill: HttpResponse<Bill>) => {
          if (bill.body) {
            return of(bill.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bill());
  }
}

export const billRoute: Routes = [
  {
    path: '',
    component: BillComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillDetailComponent,
    resolve: {
      bill: BillResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillUpdateComponent,
    resolve: {
      bill: BillResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'detail',
    component: BillsUpdateComponent,
    resolve: {
      bill: BillResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillUpdateComponent,
    resolve: {
      bill: BillResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
