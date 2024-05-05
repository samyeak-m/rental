import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IFloor, Floor } from 'app/shared/model/floor.model';
import { FloorService } from './floor.service';
import { FloorComponent } from './floor.component';
import { FloorDetailComponent } from './floor-detail.component';
import { FloorUpdateComponent } from './floor-update.component';

@Injectable({ providedIn: 'root' })
export class FloorResolve implements Resolve<IFloor> {
  constructor(private service: FloorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFloor> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((floor: HttpResponse<Floor>) => {
          if (floor.body) {
            return of(floor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Floor());
  }
}

export const floorRoute: Routes = [
  {
    path: '',
    component: FloorComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.floor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FloorDetailComponent,
    resolve: {
      floor: FloorResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.floor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FloorUpdateComponent,
    resolve: {
      floor: FloorResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.floor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FloorUpdateComponent,
    resolve: {
      floor: FloorResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.floor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
