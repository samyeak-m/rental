import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IBill, Bill } from 'app/shared/model/bill.model';
import { BillService } from './bill.service';
import { CustomerService } from '../customer/customer.service';
import { FiscalYearService } from '../fiscal-year/fiscal-year.service';
import { ICustomer } from '../../shared/model/customer.model';
import { IFiscalYear } from '../../shared/model/fiscal-year.model';
import { IShutter } from '../../shared/model/shutter.model';
import { IServiceCharge } from '../../shared/model/service-charge.model';
import { CustomerRegistration, ICustomerRegistration } from '../../shared/model/customer-registration.model';
import { ElectricityType, IElectricityType } from '../../shared/model/electricity-type.model';
import { IItemRate, ItemRate } from '../../shared/model/item-rate.model';
import { IBusinessType } from '../../shared/model/business-type.model';
import { CustomerRegistrationService } from '../customer-registration/customer-registration.service';
import { ItemRateService } from '../item-rate/item-rate.service';
import { ElectricityTypeService } from '../electricity-type/electricity-type.service';
import { SaveAlertModalService } from '../../core/alert/save-alert-modal.service';
type SelectableEntity = IFiscalYear | ICustomer | ICustomerRegistration;

@Component({
  selector: 'jhi-bill-update',
  templateUrl: './bill-update.component.html',
  styleUrls: ['bill.scss'],
})
export class BillUpdateComponent implements OnInit {
  isSaving = false;
  isDisabled = true;
  hide = false;
  insertedById?: number;
  customer: ICustomer[] = [];
  fiscalYear: IFiscalYear[] = [];
  customerRegistration: ICustomerRegistration | any = new CustomerRegistration();
  bill: IBill | any = new Bill();
  month?: string | null;
  itemRate: IItemRate | any = new ItemRate();
  electricityType: IElectricityType | any = new ElectricityType();
  editForm = this.fb.group({
    id: [],
    createdDate: [],
    updatedDate: [],
    totalArea: [null, [Validators.required]],
    monthlyRate: [null, [Validators.required]],
    serviceChargeRate: [null, [Validators.required]],
    serviceChargeAmount: [],
    waterRate: [null, [Validators.required]],
    waterAmount: [],
    waterFromUnit: [],
    waterFillUnit: [],
    electricityRate: [null, [Validators.required]],
    electricityFromUnit: [null, [Validators.required]],
    electricityToUnit: [null, [Validators.required]],
    discountAmount: [],
    fineAmount: [],
    month: [null, [Validators.required]],
    paymentStatus: [],
    customerId: [],
    customerN: [],
    fiscalYearId: [],
    fiscalYearN: [],
  });

  constructor(
    protected billService: BillService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected customerService: CustomerService,
    protected fiscalYearService: FiscalYearService,
    protected customerRegistrationService: CustomerRegistrationService,
    protected itemRateService: ItemRateService,
    protected electricityTypeService: ElectricityTypeService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bill }) => {
      if (!bill.id) {
        const today = moment().startOf('day');
        bill.createdDate = today;
        bill.updatedDate = today;
        this.hide = false;
      }
      if (bill.id) {
        this.isDisabled = false;
        if (bill.waterFromUnit === null && bill.waterFillUnit === null) {
          this.hide = true;
        }
        this.customerRegistrationService.findByCustomerId(bill.customerId).subscribe((res: HttpResponse<ICustomerRegistration>) => {
          this.customerRegistration = res.body;
          this.editForm.get(['totalArea'])?.setValue(this.customerRegistration?.totalArea);
          this.editForm.get(['monthlyRate'])?.setValue(this.customerRegistration?.monthlyRate);
          this.editForm.get(['serviceChargeRate'])?.setValue(this.customerRegistration?.serviceChargeRate);
          this.editForm.get(['waterRate'])?.setValue(this.customerRegistration?.itemRate);
          this.editForm.get(['electricityRate'])?.setValue(this.customerRegistration?.electricityRate);
          const itemRate = this.editForm.get(['waterRate'])!.value;
          this.itemRateService.findByItemRate(itemRate).subscribe((resp: HttpResponse<IItemRate>) => {
            this.itemRate = resp.body;
            this.hide = this.itemRate.rateType === 'FIXED_RATE';
          });
        });
      }
      this.insertedById = bill.insertedById;
      this.updateForm(bill);
      this.customerService.query().subscribe((res: HttpResponse<ICustomer[]>) => (this.customer = res.body || []));
      this.fiscalYearService.query().subscribe((res: HttpResponse<IFiscalYear[]>) => (this.fiscalYear = res.body || []));
    });
  }

  updateForm(bill: IBill): void {
    this.editForm.patchValue({
      id: bill.id,
      createdDate: bill.createdDate ? bill.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: bill.updatedDate ? bill.updatedDate.format(DATE_TIME_FORMAT) : null,
      totalArea: bill.totalArea,
      monthlyRate: bill.monthlyRate,
      serviceChargeRate: bill.serviceChargeRate,
      serviceChargeAmount: bill.serviceChargeAmount,
      waterRate: bill.waterRate,
      waterAmount: bill.waterAmount,
      waterFromUnit: bill.waterFromUnit,
      waterFillUnit: bill.waterFillUnit,
      electricityRate: bill.electricityRate,
      electricityFromUnit: bill.electricityFromUnit,
      electricityToUnit: bill.electricityToUnit,
      discountAmount: bill.discountAmount,
      fineAmount: bill.fineAmount,
      month: bill.month,
      paymentStatus: bill.paymentStatus,
      customerId: bill.customerId,
      customerN: bill.customerN,
      insertedById: bill.insertedById,
      insertedBy: bill.insertedBy,
      updatedById: bill.updatedById,
      updatedBy: bill.updatedBy,
    });
  }
  findByCustomerId(): void {
    const customerId = this.editForm.get(['customerId'])!.value;
    this.customerRegistrationService.findByCustomerId(customerId).subscribe((res: HttpResponse<ICustomerRegistration>) => {
      this.customerRegistration = res.body;
      this.editForm.get(['totalArea'])?.setValue(this.customerRegistration?.totalArea);
      this.editForm.get(['monthlyRate'])?.setValue(this.customerRegistration?.monthlyRate);
      this.editForm.get(['serviceChargeRate'])?.setValue(this.customerRegistration?.serviceChargeRate);
      this.editForm.get(['waterRate'])?.setValue(this.customerRegistration?.itemRate);
      this.editForm.get(['electricityRate'])?.setValue(this.customerRegistration?.electricityRate);

      if (this.customerRegistration) {
        this.isDisabled = false;
      }
      const itemRate = this.editForm.get(['waterRate'])!.value;
      this.itemRateService.findByItemRate(itemRate).subscribe((resp: HttpResponse<IItemRate>) => {
        this.itemRate = resp.body;
        this.hide = this.itemRate.rateType === 'FIXED_RATE';
      });
    });
    this.billService.getLatestCustomerMonth(customerId).subscribe((res: HttpResponse<IBill>) => {
      this.bill = res.body;
      this.editForm.get(['month'])?.setValue(this.bill?.month);
    });
  }
  findByItemId(): void {
    const itemRate = this.editForm.get(['waterRate'])!.value;
    this.itemRateService.findByItemRate(itemRate).subscribe((res: HttpResponse<IItemRate>) => {
      this.itemRate = res.body;
      this.hide = this.itemRate.rateType === 'FIXED_RATE';
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bill = this.createFromForm();
    if (bill.id !== undefined) {
      bill.insertedById = this.insertedById;
      this.subscribeToSaveResponse(this.billService.update(bill));
    } else {
      this.subscribeToSaveResponse(this.billService.create(bill));
    }
  }

  private createFromForm(): IBill {
    return {
      ...new Bill(),
      id: this.editForm.get(['id'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? moment(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      totalArea: this.editForm.get(['totalArea'])!.value,
      monthlyRate: this.editForm.get(['monthlyRate'])!.value,
      serviceChargeRate: this.editForm.get(['serviceChargeRate'])!.value,
      serviceChargeAmount: this.editForm.get(['serviceChargeAmount'])!.value,
      waterRate: this.editForm.get(['waterRate'])!.value,
      waterAmount: this.editForm.get(['waterAmount'])!.value,
      waterFromUnit: this.editForm.get(['waterFromUnit'])!.value,
      waterFillUnit: this.editForm.get(['waterFillUnit'])!.value,
      electricityRate: this.editForm.get(['electricityRate'])!.value,
      electricityFromUnit: this.editForm.get(['electricityFromUnit'])!.value,
      electricityToUnit: this.editForm.get(['electricityToUnit'])!.value,
      discountAmount: this.editForm.get(['discountAmount'])!.value,
      fineAmount: this.editForm.get(['fineAmount'])!.value,
      month: this.editForm.get(['month'])!.value,
      paymentStatus: this.editForm.get(['paymentStatus'])!.value,
      customerId: this.editForm.get(['customerId'])!.value,
      customerN: this.editForm.get(['customerN'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBill>>): void {
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
