import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICashReceipt, CashReceipt } from 'app/shared/model/cash-receipt.model';
import { CashReceiptService } from './cash-receipt.service';
import { CashReceiptComponent } from './cash-receipt.component';
import { CashReceiptDetailComponent } from './cash-receipt-detail.component';
import { CashReceiptUpdateComponent } from './cash-receipt-update.component';

@Injectable({ providedIn: 'root' })
export class CashReceiptResolve implements Resolve<ICashReceipt> {
  constructor(private service: CashReceiptService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICashReceipt> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((cashReceipt: HttpResponse<CashReceipt>) => {
          if (cashReceipt.body) {
            return of(cashReceipt.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CashReceipt());
  }
}

export const cashReceiptRoute: Routes = [
  {
    path: '',
    component: CashReceiptComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.cashReceipt.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CashReceiptDetailComponent,
    resolve: {
      cashReceipt: CashReceiptResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.cashReceipt.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CashReceiptUpdateComponent,
    resolve: {
      cashReceipt: CashReceiptResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.cashReceipt.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CashReceiptUpdateComponent,
    resolve: {
      cashReceipt: CashReceiptResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.cashReceipt.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
