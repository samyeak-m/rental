import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBill } from 'app/shared/model/bill.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { BillService } from './bill.service';
import { BillDeleteDialogComponent } from './bill-delete-dialog.component';
import { ICustomer } from '../../shared/model/customer.model';

@Component({
  selector: 'jhi-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['bill.scss'],
})
export class BillComponent implements OnInit, OnDestroy {
  query?: string;

  bills?: IBill[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  paymentStatus!: string | null;
  predicate!: string;
  ascending!: boolean;
  approvalStatus!: string | null;
  ngbPaginationPage = 1;
  showCustomForm = false;
  electricityStatus?: string;
  monthlyRentStatus?: string;
  serviceChargeStatus?: string;
  billAdjustStatus?: string;
  waterStatus?: string;
  tdsDeduct?: string;
  // popup: boolean | undefined;

  constructor(
    protected billService: BillService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    if (this.paymentStatus !== null) {
      this.billService.queryPaymentStatus(this.paymentStatus).subscribe(
        (res: HttpResponse<IBill[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
    } else {
      this.billService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<IBill[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
          () => this.onError()
        );
    }
  }

  showEditForm(): void {
    this.showCustomForm = true;
  }

  loadAll(paymentStatus: string | null): void {
    // this.popup= true;
    this.showCustomForm = false;
    this.paymentStatus = paymentStatus;
    if (this.paymentStatus) {
      this.billService.queryPaymentStatus(this.paymentStatus).subscribe((res: HttpResponse<IBill[]>) => {
        this.bills = res.body || [];
      });
    } else {
      this.billService.query().subscribe((res: HttpResponse<IBill[]>) => {
        this.bills = res.body || [];
      });
    }
    // this.handleNavigation();
    // this.registerChangeInBills();
  }
  reset(): void {
    this.billService.query().subscribe((res: HttpResponse<IBill[]>) => (this.bills = res.body || []));
  }

  filter(): boolean {
    if (!this.query) {
      return false;
    }
    this.billService.search(this.query).subscribe((res: HttpResponse<IBill[]>) => (this.bills = res.body || []));
    return true;
  }

  ngOnInit(): void {
    this.paymentStatus = null;
    this.handleNavigation();
    this.registerChangeInBills();
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

  trackId(index: number, item: IBill): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInBills(): void {
    this.eventSubscriber = this.eventManager.subscribe('billListModification', () => this.loadPage());
  }

  generatePdf(): void {
    this.billService.generatePdfForDetail(this.paymentStatus);
  }

  hideForm(): void {
    this.showCustomForm = false;
  }

  generateCustomPdf(): void {
    this.billService.generatePdfForDetailCustom(
      this.electricityStatus,
      this.monthlyRentStatus,
      this.serviceChargeStatus,
      this.waterStatus,
      this.billAdjustStatus,
      this.tdsDeduct
    );
  }

  delete(bill: IBill): void {
    const modalRef = this.modalService.open(BillDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bill = bill;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IBill[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/bill'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.bills = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
