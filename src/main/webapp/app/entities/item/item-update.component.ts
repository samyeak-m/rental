import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IItem, Item } from 'app/shared/model/item.model';
import { ItemService } from './item.service';
import { IBusinessType } from 'app/shared/model/business-type.model';
import { BusinessTypeService } from 'app/entities/business-type/business-type.service';
import * as moment from 'moment';
import { IShutter } from '../../shared/model/shutter.model';

@Component({
  selector: 'jhi-item-update',
  templateUrl: './item-update.component.html',
  styleUrls: ['item.scss'],
})
export class ItemUpdateComponent implements OnInit {
  isSaving = false;
  businessType: IBusinessType[] = [];
  itemCode?: IItem | null;

  editForm = this.fb.group({
    //group() is method of FormBuilder,this methods constructs new FormGroup instances
    id: [],
    name: [null, [Validators.required]], //All this Validators function are static function,So we can access them by name of class i.e "Validators.required" not by making its instances or objects
    code: [null, [Validators.required]],
    remarks: [],
    unit: [null, [Validators.required]],
    rateType: [null, [Validators.required]],
    rate: [null, [Validators.required]],
  });

  constructor(
    protected itemService: ItemService,
    protected businessTypeService: BusinessTypeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ item }) => {
      if (!item.id) {
        const today = moment().startOf('day');
        item.createdDate = today;
        item.updatedDate = today;
        this.itemService.getLatestCode().subscribe((res: HttpResponse<IItem>) => {
          this.itemCode = res.body || null;
          if (this.itemCode) {
            this.editForm.get(['code'])!.setValue(this.itemCode.code); //Set value is used to update all FormControls
          }
        });
      }
      this.updateForm(item);
      this.businessTypeService.query().subscribe((res: HttpResponse<IBusinessType[]>) => (this.businessType = res.body || []));
    });
  }

  updateForm(item: IItem): void {
    this.editForm.patchValue({
      //patchValue() is used to update all FormControls as well as Sub-Set of FormControls
      id: item.id,
      name: item.name,
      code: item.code,
      remarks: item.remarks,
      perUnit: item.perUnit,
      unit: item.unit,
      rateType: item.rateType,
      rate: item.rate,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const item = this.createFromForm();
    if (item.id !== undefined) {
      this.subscribeToSaveResponse(this.itemService.update(item));
    } else {
      this.subscribeToSaveResponse(this.itemService.create(item));
    }
  }

  private createFromForm(): IItem {
    return {
      ...new Item(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      rateType: this.editForm.get(['rateType'])!.value,
      rate: this.editForm.get(['rate'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItem>>): void {
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

  trackById(index: number, item: IBusinessType): any {
    return item.id;
  }
}
