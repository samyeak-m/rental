import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IBusinessType, BusinessType } from 'app/shared/model/business-type.model';
import { BusinessTypeService } from './business-type.service';

@Component({
  selector: 'jhi-business-type-update',
  templateUrl: './business-type-update.component.html',
  styleUrls: ['business-type.scss'],
})
export class BusinessTypeUpdateComponent implements OnInit {
  isSaving = false;
  businessTypeCode?: IBusinessType | null;

  editForm = this.fb.group({
    id: [],
    typeCode: [null, [Validators.required]],
    typeName: [null, [Validators.required]],
    remarks: [],
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedById: [],
    updatedBy: [],
    updatedById: [],
    status: [],
  });

  constructor(protected businessTypeService: BusinessTypeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessType }) => {
      if (!businessType.id) {
        const today = moment().startOf('day');
        businessType.createdDate = today;
        businessType.updatedDate = today;
        this.businessTypeService.getLatestCode().subscribe((res: HttpResponse<IBusinessType>) => {
          this.businessTypeCode = res.body || null;
          if (this.businessTypeCode) {
            this.editForm.get(['typeCode'])!.setValue(this.businessTypeCode.typeCode);
          }
        });
      }
      this.updateForm(businessType);
    });
  }

  updateForm(businessType: IBusinessType): void {
    this.editForm.patchValue({
      id: businessType.id,
      typeCode: businessType.typeCode,
      typeName: businessType.typeName,
      remarks: businessType.remarks,
      createdDate: businessType.createdDate ? businessType.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: businessType.updatedDate ? businessType.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: businessType.deleted,
      insertedBy: businessType.insertedBy,
      insertedById: businessType.insertedById,
      updatedBy: businessType.updatedBy,
      updatedById: businessType.updatedById,
      status: businessType.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const businessType = this.createFromForm();
    if (businessType.id !== undefined) {
      this.subscribeToSaveResponse(this.businessTypeService.update(businessType));
    } else {
      this.subscribeToSaveResponse(this.businessTypeService.create(businessType));
    }
  }

  private createFromForm(): IBusinessType {
    return {
      ...new BusinessType(),
      id: this.editForm.get(['id'])!.value,
      typeCode: this.editForm.get(['typeCode'])!.value,
      typeName: this.editForm.get(['typeName'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessType>>): void {
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
}
