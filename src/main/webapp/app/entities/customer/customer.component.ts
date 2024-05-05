import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Customer, ICustomer } from 'app/shared/model/customer.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { CustomerService } from './customer.service';
import { CustomerDeleteDialogComponent } from './customer-delete-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { IFloor } from '../../shared/model/floor.model';

@Component({
  selector: 'jhi-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['customer.scss'],
})
export class CustomerComponent implements OnInit, OnDestroy {
  query?: string;
  customer?: ICustomer | any = new Customer();
  customers?: ICustomer[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  currentFile?: File;
  isSaving = false;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  editForm = this.fb.group({
    content: [null, [Validators.required]],
  });

  constructor(
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    this.customerService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ICustomer[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
  }

  private createFromForm(): FormData {
    const formData: any = new FormData();
    formData.append('content', this.editForm.get('content')?.value);
    return formData;
  }

  selectFile(event?: any): void {
    this.currentFile = event.target.files[0];
    this.editForm.patchValue({
      content: this.currentFile,
    });
    this.editForm.get('content')?.updateValueAndValidity();
  }

  save(): void {
    const uploadList = this.createFromForm();
    this.subscribeToSaveResponse(this.customerService.uploadFile(uploadList));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFloor>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    window.location.reload();
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.registerChangeInCustomers();
  }

  filter(): boolean {
    if (!this.query) {
      return false;
    }
    this.customerService.filter(this.query).subscribe((res: HttpResponse<ICustomer[]>) => (this.customers = res.body || []));
    return true;
  }

  reset(): void {
    this.customerService.query().subscribe((res: HttpResponse<ICustomer[]>) => (this.customers = res.body || []));
  }

  downloadDocumentFile(id?: number): void {
    if (id) {
      this.customerService.find(id).subscribe((res: HttpResponse<ICustomer>) => {
        this.customer = res.body;
        this.customerService.downloadDocumentFile(id, this.customer.documentName);
      });
    }
  }

  downloadVatDocumentFile(id?: number): void {
    if (id) {
      this.customerService.find(id).subscribe((res: HttpResponse<ICustomer>) => {
        this.customer = res.body;
        this.customerService.downloadVatDocumentFile(id, this.customer.vatFileName);
      });
    }
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

  trackId(index: number, item: ICustomer): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInCustomers(): void {
    this.eventSubscriber = this.eventManager.subscribe('customerListModification', () => this.loadPage());
  }

  delete(customer: ICustomer): void {
    const modalRef = this.modalService.open(CustomerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.customer = customer;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: ICustomer[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/customer'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.customers = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
