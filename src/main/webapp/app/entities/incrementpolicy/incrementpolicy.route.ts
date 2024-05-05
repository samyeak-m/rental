import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IIncrementpolicy, Incrementpolicy } from 'app/shared/model/incrementpolicy.model';
import { IncrementpolicyService } from './incrementpolicy.service';
import { IncrementpolicyComponent } from './incrementpolicy.component';
import { IncrementpolicyDetailComponent } from './incrementpolicy-detail.component';
import { IncrementpolicyUpdateComponent } from './incrementpolicy-update.component';

@Injectable({ providedIn: 'root' })
export class IncrementpolicyResolve implements Resolve<IIncrementpolicy> {
  constructor(private service: IncrementpolicyService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIncrementpolicy> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((incrementpolicy: HttpResponse<Incrementpolicy>) => {
          if (incrementpolicy.body) {
            return of(incrementpolicy.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Incrementpolicy());
  }
}

export const incrementpolicyRoute: Routes = [
  {
    path: '',
    component: IncrementpolicyComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.incrementpolicy.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IncrementpolicyDetailComponent,
    resolve: {
      incrementpolicy: IncrementpolicyResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.incrementpolicy.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IncrementpolicyUpdateComponent,
    resolve: {
      incrementpolicy: IncrementpolicyResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.incrementpolicy.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IncrementpolicyUpdateComponent,
    resolve: {
      incrementpolicy: IncrementpolicyResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.incrementpolicy.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
