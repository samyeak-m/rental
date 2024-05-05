import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IShutter } from 'app/shared/model/shutter.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ShutterService } from './shutter.service';
import { ShutterDeleteDialogComponent } from './shutter-delete-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { IFloor } from '../../shared/model/floor.model';

@Component({
  selector: 'jhi-shutter',
  templateUrl: './shutter.component.html',
  styleUrls: ['shutter.scss'],
})
export class ShutterComponent implements OnInit, OnDestroy {
  shutters?: IShutter[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  currentFile?: File;
  isSaving = false;

  editForm = this.fb.group({
    content: [null, [Validators.required]],
  });

  constructor(
    protected shutterService: ShutterService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  selectFile(event?: any): void {
    this.currentFile = event.target.files[0];
    this.editForm.patchValue({
      content: this.currentFile,
    });
    this.editForm.get('content')?.updateValueAndValidity();
  }

  private createFromForm(): FormData {
    const formData: any = new FormData();
    formData.append('content', this.editForm.get('content')?.value);
    return formData;
  }

  save(): void {
    const uploadList = this.createFromForm();
    this.subscribeToSaveResponse(this.shutterService.uploadFile(uploadList));
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

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    this.shutterService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IShutter[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.registerChangeInShutters();
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

  trackId(index: number, item: IShutter): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInShutters(): void {
    this.eventSubscriber = this.eventManager.subscribe('shutterListModification', () => this.loadPage());
  }

  delete(shutter: IShutter): void {
    const modalRef = this.modalService.open(ShutterDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.shutter = shutter;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IShutter[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/shutter'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.shutters = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
