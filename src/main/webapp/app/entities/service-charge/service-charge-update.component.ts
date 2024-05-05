import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IServiceCharge, ServiceCharge } from 'app/shared/model/service-charge.model';
import { ServiceChargeService } from './service-charge.service';
import { IBusinessType } from '../../shared/model/business-type.model';
import { BusinessTypeService } from '../business-type/business-type.service';
import { IElectricityType } from '../../shared/model/electricity-type.model';

@Component({
  selector: 'jhi-service-charge-update',
  templateUrl: './service-charge-update.component.html',
  styleUrls: ['service-charge.scss'],
})
export class ServiceChargeUpdateComponent implements OnInit {
  isSaving = false;
  businessType: IBusinessType[] = [];
  serviceChargeCode?: IServiceCharge | null;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
    rate: [null, [Validators.required]],
    remark: [],
    businessTypeId: [null, [Validators.required]],
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
    protected serviceChargeService: ServiceChargeService,
    protected activatedRoute: ActivatedRoute,
    protected businessTypeService: BusinessTypeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceCharge }) => {
      if (!serviceCharge.id) {
        const today = moment().startOf('day');
        serviceCharge.createdDate = today;
        serviceCharge.updatedDate = today;
        this.serviceChargeService.getLatestCode().subscribe((res: HttpResponse<IServiceCharge>) => {
          this.serviceChargeCode = res.body || null;
          if (this.serviceChargeCode) {
            this.editForm.get(['code'])!.setValue(this.serviceChargeCode.code);
          }
        });
      }

      this.updateForm(serviceCharge);
      this.businessTypeService.queryAll().subscribe((res: HttpResponse<IBusinessType[]>) => (this.businessType = res.body || []));
    });
  }

  updateForm(serviceCharge: IServiceCharge): void {
    this.editForm.patchValue({
      id: serviceCharge.id,
      code: serviceCharge.code,
      name: serviceCharge.name,
      rate: serviceCharge.rate,
      remark: serviceCharge.remark,
      businessTypeId: serviceCharge.businessTypeId,
      createdDate: serviceCharge.createdDate ? serviceCharge.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: serviceCharge.updatedDate ? serviceCharge.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: serviceCharge.deleted,
      insertedBy: serviceCharge.insertedBy,
      insertedById: serviceCharge.insertedById,
      updatedBy: serviceCharge.updatedBy,
      updatedById: serviceCharge.updatedById,
      status: serviceCharge.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceCharge = this.createFromForm();
    if (serviceCharge.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceChargeService.update(serviceCharge));
    } else {
      this.subscribeToSaveResponse(this.serviceChargeService.create(serviceCharge));
    }
  }

  private createFromForm(): IServiceCharge {
    return {
      ...new ServiceCharge(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      remark: this.editForm.get(['remark'])!.value,
      businessTypeId: this.editForm.get(['businessTypeId'])!.value,
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceCharge>>): void {
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
