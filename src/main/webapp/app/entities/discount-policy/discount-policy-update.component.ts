import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDiscountPolicy, DiscountPolicy } from 'app/shared/model/discount-policy.model';
import { DiscountPolicyService } from './discount-policy.service';
import { IOrganization } from 'app/shared/model/organization.model';
import { OrganizationService } from 'app/entities/organization/organization.service';
import { BusinessTypeService } from '../business-type/business-type.service';
import { IBusinessType } from '../../shared/model/business-type.model';
import { IShutter } from '../../shared/model/shutter.model';
import { IServiceCharge } from '../../shared/model/service-charge.model';
import { ICustomerRegistration } from '../../shared/model/customer-registration.model';
import { ICustomer } from '../../shared/model/customer.model';
import { IElectricityType } from '../../shared/model/electricity-type.model';
import { IItemRate } from '../../shared/model/item-rate.model';
type SelectableEntity = IBusinessType;

@Component({
  selector: 'jhi-discount-policy-update',
  templateUrl: './discount-policy-update.component.html',
  styleUrls: ['discount-policy.scss'],
})
export class DiscountPolicyUpdateComponent implements OnInit {
  isSaving = false;
  disabled = true;
  showEdit = false;
  discountPolicyId?: number | undefined;
  organizations: IOrganization[] = [];
  businessTypeList: IBusinessType[] = [];
  remainingBusinessTypes: IBusinessType[] = [];
  list: IBusinessType[] = [];
  discountPolicy: IDiscountPolicy | null = new DiscountPolicy();
  editForm = this.fb.group({
    id: [],
    name: [null, Validators.required],
    numberOfDays: [null, Validators.required],
    discount: [null, Validators.required],
    discountType: [null, Validators.required],
    policyType: [null, Validators.required],
    businessType: [null, Validators.required],
  });

  constructor(
    protected discountPolicyService: DiscountPolicyService,
    protected organizationService: OrganizationService,
    protected businessTypeService: BusinessTypeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discountPolicy }) => {
      this.updateForm(discountPolicy);
      this.businessTypeService.query().subscribe((res: HttpResponse<IBusinessType[]>) => {
        this.businessTypeList = res.body || [];
      });
      if (discountPolicy.id) {
        this.showEdit = true;
        this.businessTypeService.getBusinessTypeNotEqualToDiscountId(discountPolicy.id).subscribe((resp: HttpResponse<IBusinessType[]>) => {
          this.remainingBusinessTypes = resp.body || [];
        });
      }
    });
  }

  updateForm(discountPolicy: IDiscountPolicy): void {
    this.editForm.patchValue({
      id: discountPolicy.id,
      name: discountPolicy.name,
      numberOfDays: discountPolicy.numberOfDays,
      discount: discountPolicy.discount,
      discountType: discountPolicy.discountType,
      policyType: discountPolicy.policyType,
      businessType: discountPolicy.businessType,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discountPolicy = this.createFromForm();
    if (discountPolicy.id !== undefined) {
      this.subscribeToSaveResponse(this.discountPolicyService.update(discountPolicy));
    } else {
      this.subscribeToSaveResponse(this.discountPolicyService.create(discountPolicy));
    }
  }

  getBusinessType(): void {
    this.remainingBusinessTypes = [];
    this.businessTypeService.query().subscribe((res: HttpResponse<IBusinessType[]>) => {
      this.businessTypeList = res.body || [];
    });
    this.list = this.editForm.get(['businessType'])!.value;
    this.list.forEach(businessType => {
      this.businessTypeList.forEach((business, index) => {
        if (business.id === businessType.id) {
          this.businessTypeList.splice(index, 1);
        }
      });
    });
    this.businessTypeList.forEach(business => {
      this.remainingBusinessTypes.push(business);
    });
  }

  validateAmount(): void {
    this.disabled = false;
  }

  setDiscountAmount(): void {
    if (this.editForm.get(['discountType'])!.value === 'PERCENTAGE') {
      if (this.editForm.get(['discount'])!.value > 100) {
        this.editForm.get(['discount'])?.setValue(100);
      }
    }
    const discount = String(this.editForm.get(['discount'])!.value);
    if (discount.startsWith('-')) {
      this.editForm.get(['discount'])?.setValue(1);
    }
  }

  private createFromForm(): IDiscountPolicy {
    return {
      ...new DiscountPolicy(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      numberOfDays: this.editForm.get(['numberOfDays'])!.value,
      discount: this.editForm.get(['discount'])!.value,
      discountType: this.editForm.get(['discountType'])!.value,
      policyType: this.editForm.get(['policyType'])!.value,
      businessType: this.editForm.get(['businessType'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscountPolicy>>): void {
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
