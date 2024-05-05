import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBillParticulars, BillParticulars } from 'app/shared/model/bill-particulars.model';
import { BillParticularsService } from './bill-particulars.service';
import { BillParticularsComponent } from './bill-particulars.component';
import { BillParticularsDetailComponent } from './bill-particulars-detail.component';
import { BillParticularsUpdateComponent } from './bill-particulars-update.component';

@Injectable({ providedIn: 'root' })
export class BillParticularsResolve implements Resolve<IBillParticulars> {
  constructor(private service: BillParticularsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBillParticulars> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((billParticulars: HttpResponse<BillParticulars>) => {
          if (billParticulars.body) {
            return of(billParticulars.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BillParticulars());
  }
}

export const billParticularsRoute: Routes = [
  {
    path: '',
    component: BillParticularsComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.billParticulars.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillParticularsDetailComponent,
    resolve: {
      billParticulars: BillParticularsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.billParticulars.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillParticularsUpdateComponent,
    resolve: {
      billParticulars: BillParticularsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.billParticulars.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillParticularsUpdateComponent,
    resolve: {
      billParticulars: BillParticularsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.billParticulars.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
