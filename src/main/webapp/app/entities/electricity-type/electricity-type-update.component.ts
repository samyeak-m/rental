import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IElectricityType, ElectricityType } from 'app/shared/model/electricity-type.model';
import { ElectricityTypeService } from './electricity-type.service';
import { IBusinessType } from '../../shared/model/business-type.model';
import { IFloor } from '../../shared/model/floor.model';
import { BusinessTypeService } from '../business-type/business-type.service';
import { ICustomer } from '../../shared/model/customer.model';
import { IBlock } from '../../shared/model/block.model';
import { BlockService } from '../block/block.service';

@Component({
  selector: 'jhi-electricity-type-update',
  templateUrl: './electricity-type-update.component.html',
  styleUrls: ['electricity-type.scss'],
})
export class ElectricityTypeUpdateComponent implements OnInit {
  isSaving = false;
  businessType: IBusinessType[] = [];
  electricityTypeCode?: IElectricityType | null;
  blocks?: IBlock[] = [];

  editForm = this.fb.group({
    id: [],
    typeCode: [null, [Validators.required]],
    typeName: [null, [Validators.required]],
    rate: [null, [Validators.required]],
    remarks: [],
    businessTypeId: [null, [Validators.required]],
    businessTypeN: [],
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedById: [],
    updatedBy: [],
    updatedById: [],
    status: [],
  });

  constructor(
    protected electricityTypeService: ElectricityTypeService,
    protected activatedRoute: ActivatedRoute,
    protected businessTypeService: BusinessTypeService,
    protected blockService: BlockService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ electricityType }) => {
      this.blockService.query().subscribe((res: HttpResponse<IBlock[]>) => {
        this.blocks = res.body || [];
      });
      if (!electricityType.id) {
        const today = moment().startOf('day');
        electricityType.createdDate = today;
        electricityType.updatedDate = today;
        this.electricityTypeService.getLatestCode().subscribe((res: HttpResponse<IElectricityType>) => {
          this.electricityTypeCode = res.body || null;
          if (this.electricityTypeCode) {
            this.editForm.get(['typeCode'])!.setValue(this.electricityTypeCode.typeCode);
          }
        });
      }

      this.updateForm(electricityType);
      this.businessTypeService.queryAll().subscribe((res: HttpResponse<IBusinessType[]>) => (this.businessType = res.body || []));
    });
  }

  updateForm(electricityType: IElectricityType): void {
    this.editForm.patchValue({
      id: electricityType.id,
      typeCode: electricityType.typeCode,
      typeName: electricityType.typeName,
      rate: electricityType.rate,
      remarks: electricityType.remarks,
      businessTypeId: electricityType.businessTypeId,
      businessTypeN: electricityType.businessTypeN,
      createdDate: electricityType.createdDate ? electricityType.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: electricityType.updatedDate ? electricityType.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: electricityType.deleted,
      insertedBy: electricityType.insertedBy,
      insertedById: electricityType.insertedById,
      updatedBy: electricityType.updatedBy,
      updatedById: electricityType.updatedById,
      status: electricityType.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const electricityType = this.createFromForm();
    if (electricityType.id !== undefined) {
      this.subscribeToSaveResponse(this.electricityTypeService.update(electricityType));
    } else {
      this.subscribeToSaveResponse(this.electricityTypeService.create(electricityType));
    }
  }

  private createFromForm(): IElectricityType {
    return {
      ...new ElectricityType(),
      id: this.editForm.get(['id'])!.value,
      typeCode: this.editForm.get(['typeCode'])!.value,
      typeName: this.editForm.get(['typeName'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      businessTypeId: this.editForm.get(['businessTypeId'])!.value,
      businessTypeN: this.editForm.get(['businessTypeN'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? moment(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      deleted: this.editForm.get(['deleted'])!.value,
      insertedBy: this.editForm.get(['insertedBy'])!.value,
      insertedById: this.editForm.get(['insertedById'])!.value,
      updatedBy: this.editForm.get(['updatedBy'])!.value,
      updatedById: this.editForm.get(['updatedById'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IElectricityType>>): void {
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

  trackById(index: number, item: IBusinessType | IBlock): any {
    return item.id;
  }
}
