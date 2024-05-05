import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ICustomerShutter, CustomerShutter } from 'app/shared/model/customer-shutter.model';
import { CustomerShutterService } from './customer-shutter.service';

@Component({
  selector: 'jhi-customer-shutter-update',
  templateUrl: './customer-shutter-update.component.html',
  styleUrls: ['customer-shutter.scss'],
})
export class CustomerShutterUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    effectiveDateFrom: [null, [Validators.required]],
    effectiveDateTo: [null, [Validators.required]],
    customerId: [],
    customerN: [],
    shutterId: [],
    shutterN: [],
    customerRegistrationId: [],
    customerRegistrationN: [],
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
    protected customerShutterService: CustomerShutterService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerShutter }) => {
      if (!customerShutter.id) {
        const today = moment().startOf('day');
        // customerShutter.effectiveDateFrom = today;
        // customerShutter.effectiveDateTo = today;
        customerShutter.createdDate = today;
        customerShutter.updatedDate = today;
      }

      this.updateForm(customerShutter);
    });
  }

  updateForm(customerShutter: ICustomerShutter): void {
    this.editForm.patchValue({
      id: customerShutter.id,
      effectiveDateFrom: customerShutter.effectiveDateFrom,
      effectiveDateTo: customerShutter.effectiveDateTo,
      customerId: customerShutter.customerId,
      customerN: customerShutter.customerN,
      shutterId: customerShutter.shutterId,
      shutterN: customerShutter.shutterN,
      customerRegistrationId: customerShutter.customerRegistrationId,
      customerRegistrationN: customerShutter.customerRegistrationN,
      createdDate: customerShutter.createdDate ? customerShutter.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: customerShutter.updatedDate ? customerShutter.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: customerShutter.deleted,
      insertedBy: customerShutter.insertedBy,
      insertedById: customerShutter.insertedById,
      updatedBy: customerShutter.updatedBy,
      updatedById: customerShutter.updatedById,
      status: customerShutter.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customerShutter = this.createFromForm();
    if (customerShutter.id !== undefined) {
      this.subscribeToSaveResponse(this.customerShutterService.update(customerShutter));
    } else {
      this.subscribeToSaveResponse(this.customerShutterService.create(customerShutter));
    }
  }

  private createFromForm(): ICustomerShutter {
    return {
      ...new CustomerShutter(),
      id: this.editForm.get(['id'])!.value,
      effectiveDateFrom: this.editForm.get(['effectiveDateFrom'])!.value,

      effectiveDateTo: this.editForm.get(['effectiveDateTo'])!.value,

      customerId: this.editForm.get(['customerId'])!.value,
      customerN: this.editForm.get(['customerN'])!.value,
      shutterId: this.editForm.get(['shutterId'])!.value,
      shutterN: this.editForm.get(['shutterN'])!.value,
      customerRegistrationId: this.editForm.get(['customerRegistrationId'])!.value,
      customerRegistrationN: this.editForm.get(['customerRegistrationN'])!.value,
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomerShutter>>): void {
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
