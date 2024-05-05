import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILedger } from 'app/shared/model/ledger.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { LedgerService } from './ledger.service';
import { LedgerDeleteDialogComponent } from './ledger-delete-dialog.component';
import { ICustomer } from '../../shared/model/customer.model';
import { IFiscalYear } from '../../shared/model/fiscal-year.model';
import { FiscalYearService } from '../fiscal-year/fiscal-year.service';
import { AdBsDatesService } from '../ad-bs-dates/ad-bs-dates.service';
import { IAdBsDates } from '../../shared/model/ad-bs-dates.model';
import { CustomerService } from '../customer/customer.service';
import { LedgerType } from '../../shared/model/enumerations/ledger-type.model';

@Component({
  selector: 'jhi-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['ledger.scss'],
})
export class LedgerComponent implements OnInit, OnDestroy {
  ledgers?: ILedger[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  customers?: ICustomer[] = [];
  customerId?: string | null;
  ledgerType?: string | null;
  filterBy?: string;
  showMonth?: boolean;
  showDate?: boolean;
  createdDate?: string | null;
  month?: string | null;
  fromDate?: string | any;
  toDate?: string | any;
  fiscalYearId?: string | null;
  fiscalYears?: IFiscalYear[] = [];
  fiscalYear?: IFiscalYear | null;
  relateMonths?: IAdBsDates[] = [];
  isSearch?: boolean = false;

  constructor(
    protected ledgerService: LedgerService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected fiscalYearService: FiscalYearService,
    protected relateBsAdService: AdBsDatesService,
    protected customerService: CustomerService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    this.ledgerService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ILedger[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.registerChangeInLedgers();
    this.fiscalYearService.getAll().subscribe((res: HttpResponse<IFiscalYear[]>) => (this.fiscalYears = res.body || []));
    this.customerService.findCustomers().subscribe((res: HttpResponse<ICustomer[]>) => {
      this.customers = res.body || [];
      // this.customers?.sort((a, b) => a.name!.localeCompare(b.name!));
    });
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    }).subscribe();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ILedger): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInLedgers(): void {
    this.eventSubscriber = this.eventManager.subscribe('ledgerListModification', () => this.loadPage());
  }

  delete(ledger: ILedger): void {
    const modalRef = this.modalService.open(LedgerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ledger = ledger;
  }

  filter(): void {
    this.ledgerService
      .filter(this.customerId, this.ledgerType, this.fromDate, this.toDate, this.month, this.createdDate, this.fiscalYearId)
      .subscribe((res: HttpResponse<ILedger[]>) => {
        this.ledgers = res.body || [];
        this.ledgers.forEach(ledger => {
          if (ledger.ledgerType === LedgerType.BILL_CREATED) {
            ledger.isLedgerCreated = true;
          } else {
            ledger.isLedgerCreated = false;
          }
        });
      });
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: ILedger[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/ledger'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.ledgers = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  showMonthOrNot(): void {
    if (this.filterBy === 'MONTH') {
      this.showMonth = true;
      this.showDate = false;
    } else if (this.filterBy === 'DATE') {
      this.showMonth = false;
      this.showDate = true;
    } else {
      this.showMonth = false;
      this.month = '';
      this.fromDate = null;
      this.toDate = null;
      this.resetFiscal();
    }
  }

  resetFiscal(): void {
    this.fiscalYearId = null;
    this.fiscalYears = [];
    this.fiscalYearService.getAll().subscribe((res: HttpResponse<IFiscalYear[]>) => (this.fiscalYears = res.body || []));
  }

  getFromToFiscal(): void {
    this.fromDate = null;
    this.toDate = null;
    if (this.fiscalYears) {
      if (this.fiscalYears.length > 0) {
        this.fiscalYears.forEach(fiscal => {
          if (fiscal.id === this.fiscalYearId) {
            this.fiscalYear = fiscal;
          }
        });
      }

      if (this.fiscalYear) {
        if (this.showMonth) {
          this.relateBsAdService.queryFiscalMonth(this.fiscalYearId, this.month).subscribe((res: HttpResponse<IAdBsDates[]>) => {
            this.relateMonths = res.body || [];
            this.fromDate = this.relateMonths[0].bsDate;
            this.toDate = this.relateMonths[this.relateMonths.length - 1].bsDate;
          });
        } else {
          this.fromDate = this.fiscalYear.fiscalBsStart;
          this.toDate = this.fiscalYear.fiscalBsEnd;
        }
      }
    }
  }

  // search() {
  //
  // }

  resetSearch(): void {
    this.isSearch = false;
    this.fiscalYearId = null;
    this.month = null;
    this.showMonth = false;
    this.customerId = null;
    this.filterBy = '';
    this.fromDate = null;
    this.toDate = null;
    this.ngOnInit();
  }
}
