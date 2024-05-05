import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IElectricityType, ElectricityType } from 'app/shared/model/electricity-type.model';
import { ElectricityTypeService } from './electricity-type.service';
import { ElectricityTypeComponent } from './electricity-type.component';
import { ElectricityTypeDetailComponent } from './electricity-type-detail.component';
import { ElectricityTypeUpdateComponent } from './electricity-type-update.component';

@Injectable({ providedIn: 'root' })
export class ElectricityTypeResolve implements Resolve<IElectricityType> {
  constructor(private service: ElectricityTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IElectricityType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((electricityType: HttpResponse<ElectricityType>) => {
          if (electricityType.body) {
            return of(electricityType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ElectricityType());
  }
}

export const electricityTypeRoute: Routes = [
  {
    path: '',
    component: ElectricityTypeComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.electricityType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ElectricityTypeDetailComponent,
    resolve: {
      electricityType: ElectricityTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.electricityType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ElectricityTypeUpdateComponent,
    resolve: {
      electricityType: ElectricityTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.electricityType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ElectricityTypeUpdateComponent,
    resolve: {
      electricityType: ElectricityTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.electricityType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
