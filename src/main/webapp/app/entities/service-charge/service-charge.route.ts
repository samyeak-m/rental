import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IServiceCharge, ServiceCharge } from 'app/shared/model/service-charge.model';
import { ServiceChargeService } from './service-charge.service';
import { ServiceChargeComponent } from './service-charge.component';
import { ServiceChargeDetailComponent } from './service-charge-detail.component';
import { ServiceChargeUpdateComponent } from './service-charge-update.component';

@Injectable({ providedIn: 'root' })
export class ServiceChargeResolve implements Resolve<IServiceCharge> {
  constructor(private service: ServiceChargeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IServiceCharge> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((serviceCharge: HttpResponse<ServiceCharge>) => {
          if (serviceCharge.body) {
            return of(serviceCharge.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ServiceCharge());
  }
}

export const serviceChargeRoute: Routes = [
  {
    path: '',
    component: ServiceChargeComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.serviceCharge.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceChargeDetailComponent,
    resolve: {
      serviceCharge: ServiceChargeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.serviceCharge.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceChargeUpdateComponent,
    resolve: {
      serviceCharge: ServiceChargeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.serviceCharge.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceChargeUpdateComponent,
    resolve: {
      serviceCharge: ServiceChargeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.serviceCharge.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
