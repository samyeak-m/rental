import { Component, OnInit } from '@angular/core';
import { BillService } from '../bill/bill.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IFloorBlockShutter } from '../../shared/model/floorblock-shutter.model';
import { HttpResponse } from '@angular/common/http';
import { BillCustomer, IBillCustomer } from '../../shared/model/bill-customer.model';
import { Observable } from 'rxjs';
import { ICustomerRegistration } from '../../shared/model/customer-registration.model';
import { CustomerRegistrationService } from '../customer-registration/customer-registration.service';
import { IShutter, Shutter } from '../../shared/model/shutter.model';
import { CustomerShutter, ICustomerShutter } from '../../shared/model/customer-shutter.model';
import { ShutterService } from '../shutter/shutter.service';
import { IShutterElectricity, ShutterElectricity } from '../../shared/model/shutter-electricity.model';
import { CustomerShutterService } from '../customer-shutter/customer-shutter.service';
import { ICustomShutterElectricityBill } from '../../shared/model/custom-shutter-bill.model';
import { FiscalYear, IFiscalYear } from '../../shared/model/fiscal-year.model';
import { FiscalYearService } from '../fiscal-year/fiscal-year.service';
import { IAdBsDates } from '../../shared/model/ad-bs-dates.model';
import { IRelateMonth } from '../../shared/model/relate-month.model';
import { AdBsDatesService } from '../ad-bs-dates/ad-bs-dates.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-ledger',
  templateUrl: './electricity-fill.component.html',
  styleUrls: ['electricity-type.scss'],
})
export class ElectricityFillComponent implements OnInit {
  isSaving = false;
  customerRegistrations: ICustomerRegistration[] = [];
  fiscalYearId?: any;
  fromDate?: any;
  toDate?: any;
  relateMonths?: IAdBsDates[] = [];
  fiscalYear?: IFiscalYear | any = new FiscalYear();
  fiscalYears?: IFiscalYear[];
  customerShutter?: ICustomerShutter | any = new CustomerShutter();
  shutterElectricity?: IShutterElectricity | any = new ShutterElectricity();
  customerShutters?: ICustomerShutter[] = [];
  totalCustomerShutters?: ICustomerShutter[] = [];
  editForm = this.fb.group({
    month: '',
    fiscalYearId: '',
    shutterElectricityBill: this.fb.array([]),
  });

  constructor(
    protected billService: BillService,
    protected customerShutterService: CustomerShutterService,
    protected fiscalYearService: FiscalYearService,
    protected router: Router,
    protected relateBsAdService: AdBsDatesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addBill();
    this.customerShutterService.query().subscribe((res: HttpResponse<ICustomerShutter[]>) => {
      this.customerShutters = res.body || [];
    });
    this.customerShutters?.forEach((shutter, index) => {
      if (shutter.shutterN === undefined || shutter.shutterN === '') {
        this.customerShutters?.splice(index, 1);
      }
    });
  }

  resetFiscal(): void {
    this.fiscalYearId = null;
    this.fiscalYears = [];
    this.fiscalYearService.getAll().subscribe((res: HttpResponse<IFiscalYear[]>) => (this.fiscalYears = res.body || []));
  }

  getFromToFiscal(): void {
    this.fromDate = null;
    this.toDate = null;
    if (this.fiscalYears) {
      if (this.fiscalYears.length > 0) {
        this.fiscalYears.forEach(fiscal => {
          if (fiscal.id === this.fiscalYearId) {
            this.fiscalYear = fiscal;
          }
        });
      }

      if (this.fiscalYear) {
        this.relateBsAdService
          .queryFiscalMonth(this.editForm.get(['fiscalYearId'])!.value, this.editForm.get(['month'])!.value)
          .subscribe((res: HttpResponse<IAdBsDates[]>) => {
            this.relateMonths = res.body || [];
            this.fromDate = this.relateMonths[0].bsDate;
            this.toDate = this.relateMonths[this.relateMonths.length - 1].bsDate;
          });
      } else {
        this.fromDate = this.fiscalYear.fiscalBsStart;
        this.toDate = this.fiscalYear.fiscalBsEnd;
      }
    }
  }

  private createFromForm(): ICustomShutterElectricityBill {
    return {
      ...new BillCustomer(),
      month: this.editForm.get(['month'])!.value,
      fiscalYearId: this.editForm.get(['fiscalYearId'])!.value,
      shutterElectricityBill: this.editForm.get(['shutterElectricityBill'])!.value,
    };
  }

  findByShutterNo(i: number): void {
    this.customerShutters?.forEach((shutter, index) => {
      if (shutter.shutterN === undefined || shutter.shutterN === '') {
        this.customerShutters?.splice(i, index);
      }
    });
    this.customerShutterService.query().subscribe((rest: HttpResponse<ICustomerShutter[]>) => {
      this.totalCustomerShutters = rest.body || [];
    });
    const shutterNo = this.shutterElectricityBill.at(i).get(['shutterNo'])!.value;
    this.customerShutterService.findByShutterNo(shutterNo).subscribe((res: HttpResponse<ICustomerShutter>) => {
      this.customerShutter = res.body;
      this.shutterElectricityBill.at(i).get(['rate'])?.setValue(this.customerShutter.electricityRate);
      this.shutterElectricityBill
        .at(i)
        .get(['customerShutterName'])
        ?.setValue(this.customerShutter.customerN + '-' + shutterNo);
      this.shutterElectricityBill.at(i).get(['customerId'])?.setValue(this.customerShutter.customerId);
      this.billService
        .findByShutterNoAndMonth(shutterNo, this.editForm.get('month')!.value)
        .subscribe((resp: HttpResponse<IShutterElectricity>) => {
          this.shutterElectricity = resp.body;
          this.shutterElectricityBill.at(i).get(['fromUnit'])?.setValue(this.shutterElectricity.toUnit);
        });

      this.customerShutters?.forEach((customerShutter, index) => {
        if (customerShutter.shutterN === shutterNo) {
          this.customerShutters?.splice(index, 1);
        }
      });

      this.customerShutters?.forEach(customerShutter => {
        this.totalCustomerShutters?.forEach((totalCustomer, index) => {
          if (totalCustomer.shutterN === customerShutter.shutterN) {
            this.totalCustomerShutters?.splice(index, 1);
          }
        });
      });

      this.shutterElectricityBill.getRawValue().forEach(customerShutter => {
        this.totalCustomerShutters?.forEach((totalCustomer, index) => {
          if (totalCustomer.shutterN === customerShutter.shutterNo) {
            this.totalCustomerShutters?.splice(index, 1);
          }
        });
      });

      this.totalCustomerShutters?.forEach(shutter => {
        this.customerShutters?.push(shutter);
      });
    });
  }

  get shutterElectricityBill(): FormArray {
    return this.editForm.get('shutterElectricityBill') as FormArray;
  }

  newBill(): FormGroup {
    return this.fb.group({
      customerId: '',
      shutterNo: '',
      fiscalYearId: '',
      month: '',
      fromUnit: '',
      toUnit: '',
      totalUnit: '',
      totalAmount: '',
      rate: '',
      customerShutterName: '',
    });
  }

  removeCustomerBill(i: number): void {
    const shutterNo = this.shutterElectricityBill.at(i).get('shutterNo')!.value;
    if (shutterNo) {
      this.customerShutterService.findByShutterNo(shutterNo).subscribe((res: HttpResponse<IShutter>) => {
        this.customerShutter = res.body;
        this.customerShutters?.push(this.customerShutter);
      });
    }
    this.shutterElectricityBill.removeAt(i);
    this.customerShutters?.forEach((shutter, index) => {
      if (shutter.shutterN === undefined || shutter.shutterN === '') {
        this.customerShutters?.splice(i, index);
      }
    });
  }

  setTotalUnit(i: number, event: KeyboardEvent): void {
    this.shutterElectricityBill
      .at(i)
      .get('totalUnit')
      ?.setValue(this.shutterElectricityBill.at(i).get('toUnit')!.value - this.shutterElectricityBill.at(i).get('fromUnit')!.value);
    this.setAmount(i);
  }

  setAmount(i: number): void {
    this.shutterElectricityBill
      .at(i)
      .get('totalAmount')
      ?.setValue(this.shutterElectricityBill.at(i).get('rate')!.value * this.shutterElectricityBill.at(i).get('totalUnit')!.value);
  }

  save(): void {
    this.isSaving = true;
    const electricityBill = this.createFromForm();
    electricityBill.shutterElectricityBill?.forEach((bill: any): any => {
      bill.month = electricityBill.month;
      bill.fiscalYearId = electricityBill.fiscalYearId;
    });
    this.subscribeToSaveResponse(this.billService.saveElectricityBills(electricityBill));
  }

  addBill(): void {
    this.shutterElectricityBill.push(this.newBill());
  }

  trackById(index: number, item: ICustomerShutter): any {
    return item.shutterN;
  }

  previousState(): void {
    window.history.back();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomShutterElectricityBill>>): void {
    result.subscribe(() => this.onSaveSuccess());
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }
}
