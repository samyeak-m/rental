import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMeternumber, Meternumber } from 'app/shared/model/meternumber.model';
import { MeternumberService } from './meternumber.service';
import { MeternumberComponent } from './meternumber.component';
import { MeternumberDetailComponent } from './meternumber-detail.component';
import { MeternumberUpdateComponent } from './meternumber-update.component';

@Injectable({ providedIn: 'root' })
export class MeternumberResolve implements Resolve<IMeternumber> {
  constructor(private service: MeternumberService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMeternumber> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((meternumber: HttpResponse<Meternumber>) => {
          if (meternumber.body) {
            return of(meternumber.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Meternumber());
  }
}

export const meternumberRoute: Routes = [
  {
    path: '',
    component: MeternumberComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.meternumber.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MeternumberDetailComponent,
    resolve: {
      meternumber: MeternumberResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.meternumber.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MeternumberUpdateComponent,
    resolve: {
      meternumber: MeternumberResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.meternumber.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MeternumberUpdateComponent,
    resolve: {
      meternumber: MeternumberResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.meternumber.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
