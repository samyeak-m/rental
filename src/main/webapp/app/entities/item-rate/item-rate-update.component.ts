import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IItemRate, ItemRate } from 'app/shared/model/item-rate.model';
import { ItemRateService } from './item-rate.service';
import { ItemService } from '../item/item.service';
import { IItem } from '../../shared/model/item.model';
type SelectableEntity = IItem;

@Component({
  selector: 'jhi-item-rate-update',
  templateUrl: './item-rate-update.component.html',
  styleUrls: ['item-rate.scss'],
})
export class ItemRateUpdateComponent implements OnInit {
  isSaving = false;
  itemList?: IItem[];
  editForm = this.fb.group({
    id: [],
    rateType: [null, [Validators.required]],
    unit: [],
    rate: [null, [Validators.required]],
    remarks: [],
    itemId: [null, [Validators.required]],
    itemN: [],
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedById: [],
    updatedBy: [],
    updatedById: [],
    status: [],
    perUnit: [],
  });

  constructor(
    protected itemRateService: ItemRateService,
    protected itemService: ItemService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemRate }) => {
      if (!itemRate.id) {
        const today = moment().startOf('day');
        itemRate.createdDate = today;
        itemRate.updatedDate = today;
      }

      this.itemService.query().subscribe(res => {
        this.itemList = res.body || [];
      });
      this.updateForm(itemRate);
    });
  }

  updateForm(itemRate: IItemRate): void {
    this.editForm.patchValue({
      id: itemRate.id,
      rateType: itemRate.rateType,
      unit: itemRate.unit,
      rate: itemRate.rate,
      remarks: itemRate.remarks,
      itemId: itemRate.itemId,
      itemN: itemRate.itemN,
      createdDate: itemRate.createdDate ? itemRate.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: itemRate.updatedDate ? itemRate.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: itemRate.deleted,
      insertedBy: itemRate.insertedBy,
      insertedById: itemRate.insertedById,
      updatedBy: itemRate.updatedBy,
      updatedById: itemRate.updatedById,
      status: itemRate.status,
      perUnit: itemRate.perUnit,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemRate = this.createFromForm();
    if (itemRate.id !== undefined) {
      this.subscribeToSaveResponse(this.itemRateService.update(itemRate));
    } else {
      this.subscribeToSaveResponse(this.itemRateService.create(itemRate));
    }
  }

  private createFromForm(): IItemRate {
    return {
      ...new ItemRate(),
      id: this.editForm.get(['id'])!.value,
      rateType: this.editForm.get(['rateType'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      itemId: this.editForm.get(['itemId'])!.value,
      itemN: this.editForm.get(['itemN'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? moment(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      perUnit: this.editForm.get(['perUnit'])!.value,
      deleted: this.editForm.get(['deleted'])!.value,
      insertedBy: this.editForm.get(['insertedBy'])!.value,
      insertedById: this.editForm.get(['insertedById'])!.value,
      updatedBy: this.editForm.get(['updatedBy'])!.value,
      updatedById: this.editForm.get(['updatedById'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemRate>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
