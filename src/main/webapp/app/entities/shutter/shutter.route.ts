import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IShutter, Shutter } from 'app/shared/model/shutter.model';
import { ShutterService } from './shutter.service';
import { ShutterComponent } from './shutter.component';
import { ShutterDetailComponent } from './shutter-detail.component';
import { ShutterUpdateComponent } from './shutter-update.component';

@Injectable({ providedIn: 'root' })
export class ShutterResolve implements Resolve<IShutter> {
  constructor(private service: ShutterService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShutter> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((shutter: HttpResponse<Shutter>) => {
          if (shutter.body) {
            return of(shutter.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Shutter());
  }
}

export const shutterRoute: Routes = [
  {
    path: '',
    component: ShutterComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.shutter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShutterDetailComponent,
    resolve: {
      shutter: ShutterResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.shutter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShutterUpdateComponent,
    resolve: {
      shutter: ShutterResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.shutter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShutterUpdateComponent,
    resolve: {
      shutter: ShutterResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.shutter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
