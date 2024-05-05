import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from '../../shared/constants/input.constants';

import { IIncrementpolicy, Incrementpolicy } from '../../shared/model/incrementpolicy.model';
import { IncrementpolicyService } from './incrementpolicy.service';
import { ICustomerRegistration } from '../../shared/model/customer-registration.model';
import { CustomerRegistrationService } from '../customer-registration/customer-registration.service';
import { IDiscountPolicy } from '../../shared/model/discount-policy.model';
import { IShutter } from '../../shared/model/shutter.model';
import { IServiceCharge } from '../../shared/model/service-charge.model';
import { ICustomer } from '../../shared/model/customer.model';
import { IElectricityType } from '../../shared/model/electricity-type.model';
import { IItemRate } from '../../shared/model/item-rate.model';
import { IBusinessType } from '../../shared/model/business-type.model';
type SelectableEntity = ICustomerRegistration;

@Component({
  selector: 'jhi-incrementpolicy-update',
  templateUrl: './incrementpolicy-update.component.html',
  styleUrls: ['incrementpolicy.scss'],
})
export class IncrementpolicyUpdateComponent implements OnInit {
  isSaving = false;
  disabled = true;
  customerRegistrations?: ICustomerRegistration[];
  editForm = this.fb.group({
    id: [],
    totalTime: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    policyType: [null, [Validators.required]],
    incrementType: [null, [Validators.required]],
    increment: [null, [Validators.required]],
    customerRegistrationId: [null, [Validators.required]],
    additionalType: [null, [Validators.required]],
    effectiveDateFrom: [null, [Validators.required]],
  });

  constructor(
    protected incrementpolicyService: IncrementpolicyService,
    protected customerRegistrationService: CustomerRegistrationService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ incrementpolicy }) => {
      if (!incrementpolicy.id) {
        const today = moment().startOf('day');
        incrementpolicy.startDate = today;
      } else {
        this.disabled = false;
      }
      this.customerRegistrationService.findAllActiveRegistrations().subscribe(res => {
        this.customerRegistrations = res.body || [];
      });
      this.updateForm(incrementpolicy);
    });
  }

  updateForm(incrementpolicy: IIncrementpolicy): void {
    this.editForm.patchValue({
      id: incrementpolicy.id,
      totalTime: incrementpolicy.totalTime,
      amount: incrementpolicy.amount,
      policyType: incrementpolicy.policyType,
      incrementType: incrementpolicy.incrementType,
      increment: incrementpolicy.increment,
      customerRegistrationId: incrementpolicy.customerRegistrationId,
      additionalType: incrementpolicy.additionalType,
      effectiveDateFrom: incrementpolicy.effectiveDateFrom,
    });
  }

  previousState(): void {
    window.history.back();
  }

  validateAmount(): void {
    this.disabled = false;
  }

  save(): void {
    this.isSaving = true;
    const incrementpolicy = this.createFromForm();
    if (incrementpolicy.id !== undefined) {
      this.subscribeToSaveResponse(this.incrementpolicyService.update(incrementpolicy));
    } else {
      this.subscribeToSaveResponse(this.incrementpolicyService.create(incrementpolicy));
    }
  }

  private createFromForm(): IIncrementpolicy {
    return {
      ...new Incrementpolicy(),
      id: this.editForm.get(['id'])!.value,
      totalTime: this.editForm.get(['totalTime'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      policyType: this.editForm.get(['policyType'])!.value,
      incrementType: this.editForm.get(['incrementType'])!.value,
      increment: this.editForm.get(['increment'])!.value,
      customerRegistrationId: this.editForm.get(['customerRegistrationId'])!.value,
      additionalType: this.editForm.get(['additionalType'])!.value,
      effectiveDateFrom: this.editForm.get(['effectiveDateFrom'])!.value,
    };
  }

  setAmount(): void {
    if (this.editForm.get(['incrementType'])!.value === 'PERCENTAGE') {
      if (this.editForm.get(['amount'])!.value > 100) {
        this.editForm.get(['amount'])?.setValue(100);
      }
    }
    const amount = String(this.editForm.get(['amount'])!.value);
    if (amount.startsWith('-')) {
      this.editForm.get(['amount'])?.setValue(1);
    }
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIncrementpolicy>>): void {
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
