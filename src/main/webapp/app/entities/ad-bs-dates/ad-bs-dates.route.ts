import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IAdBsDates, AdBsDates } from 'app/shared/model/ad-bs-dates.model';
import { AdBsDatesService } from './ad-bs-dates.service';
import { AdBsDatesComponent } from './ad-bs-dates.component';
import { AdBsDatesDetailComponent } from './ad-bs-dates-detail.component';
import { AdBsDatesUpdateComponent } from './ad-bs-dates-update.component';

@Injectable({ providedIn: 'root' })
export class AdBsDatesResolve implements Resolve<IAdBsDates> {
  constructor(private service: AdBsDatesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdBsDates> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((adBsDates: HttpResponse<AdBsDates>) => {
          if (adBsDates.body) {
            return of(adBsDates.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AdBsDates());
  }
}

export const adBsDatesRoute: Routes = [
  {
    path: '',
    component: AdBsDatesComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.adBsDates.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdBsDatesDetailComponent,
    resolve: {
      adBsDates: AdBsDatesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.adBsDates.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdBsDatesUpdateComponent,
    resolve: {
      adBsDates: AdBsDatesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.adBsDates.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdBsDatesUpdateComponent,
    resolve: {
      adBsDates: AdBsDatesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.adBsDates.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
