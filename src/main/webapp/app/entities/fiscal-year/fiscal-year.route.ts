import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IFiscalYear, FiscalYear } from 'app/shared/model/fiscal-year.model';
import { FiscalYearService } from './fiscal-year.service';
import { FiscalYearComponent } from './fiscal-year.component';
import { FiscalYearDetailComponent } from './fiscal-year-detail.component';
import { FiscalYearUpdateComponent } from './fiscal-year-update.component';
import { AdBsDatesService } from '../ad-bs-dates/ad-bs-dates.service';
import { AdBsDates } from '../../shared/model/ad-bs-dates.model';

@Injectable({ providedIn: 'root' })
export class FiscalYearResolve implements Resolve<IFiscalYear> {
  fiscalYR: IFiscalYear = new FiscalYear();
  fiscalBsStart?: string;
  fiscalBsEnd?: number;
  bsEnd?: string;

  constructor(private service: FiscalYearService, private adBsDateService: AdBsDatesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFiscalYear> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((fiscalYear: HttpResponse<FiscalYear>) => {
          if (fiscalYear.body) {
            return of(fiscalYear.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    } else{
      return this.adBsDateService.verifyFiscal().pipe(
        flatMap((relateBsAd: HttpResponse<AdBsDates>) => {
          if (relateBsAd.body) {
            if (relateBsAd.body.id) {
              this.fiscalYR.fiscalBsEnd = relateBsAd.body.bsDate?.substring(0,4);
              this.fiscalYR.fiscalBsStart = relateBsAd.body.lastBS?.substring(0,4);
              this.fiscalYR.canGenerate = relateBsAd.body.canGen;
              return of(this.fiscalYR);
            } else {
              return of(new FiscalYear());
            }
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FiscalYear());
  }
}
export const fiscalYearRoute: Routes = [
  {
    path: '',
    component: FiscalYearComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'rentalUiApp.fiscalYear.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FiscalYearDetailComponent,
    resolve: {
      fiscalYear: FiscalYearResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.fiscalYear.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FiscalYearUpdateComponent,
    resolve: {
      fiscalYear: FiscalYearResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.fiscalYear.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FiscalYearUpdateComponent,
    resolve: {
      fiscalYear: FiscalYearResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'rentalUiApp.fiscalYear.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
