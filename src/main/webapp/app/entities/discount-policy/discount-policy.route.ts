import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IDiscountPolicy, DiscountPolicy } from 'app/shared/model/discount-policy.model';
import { DiscountPolicyService } from './discount-policy.service';
import { DiscountPolicyComponent } from './discount-policy.component';
import { DiscountPolicyDetailComponent } from './discount-policy-detail.component';
import { DiscountPolicyUpdateComponent } from './discount-policy-update.component';

@Injectable({ providedIn: 'root' })
export class DiscountPolicyResolve implements Resolve<IDiscountPolicy> {
  constructor(private service: DiscountPolicyService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDiscountPolicy> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((discountPolicy: HttpResponse<DiscountPolicy>) => {
          if (discountPolicy.body) {
            return of(discountPolicy.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DiscountPolicy());
  }
}

export const discountPolicyRoute: Routes = [
  {
    path: '',
    component: DiscountPolicyComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.discountPolicy.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiscountPolicyDetailComponent,
    resolve: {
      discountPolicy: DiscountPolicyResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.discountPolicy.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiscountPolicyUpdateComponent,
    resolve: {
      discountPolicy: DiscountPolicyResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.discountPolicy.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiscountPolicyUpdateComponent,
    resolve: {
      discountPolicy: DiscountPolicyResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.discountPolicy.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
