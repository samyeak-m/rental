import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IItemRate, ItemRate } from 'app/shared/model/item-rate.model';
import { ItemRateService } from './item-rate.service';
import { ItemRateComponent } from './item-rate.component';
import { ItemRateDetailComponent } from './item-rate-detail.component';
import { ItemRateUpdateComponent } from './item-rate-update.component';

@Injectable({ providedIn: 'root' })
export class ItemRateResolve implements Resolve<IItemRate> {
  constructor(private service: ItemRateService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemRate> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((itemRate: HttpResponse<ItemRate>) => {
          if (itemRate.body) {
            return of(itemRate.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ItemRate());
  }
}

export const itemRateRoute: Routes = [
  {
    path: '',
    component: ItemRateComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.itemRate.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemRateDetailComponent,
    resolve: {
      itemRate: ItemRateResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.itemRate.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemRateUpdateComponent,
    resolve: {
      itemRate: ItemRateResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.itemRate.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemRateUpdateComponent,
    resolve: {
      itemRate: ItemRateResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.itemRate.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
