import { FiscalYear, IFiscalYear } from '../../shared/model/fiscal-year.model';
import { ICustomer } from '../../shared/model/customer.model';
import { ICustomerRegistration } from '../../shared/model/customer-registration.model';
import { Component, OnInit } from '@angular/core';
import { CustomerRegistrationService } from '../customer-registration/customer-registration.service';
import { HttpResponse } from '@angular/common/http';
import { FiscalYearService } from '../fiscal-year/fiscal-year.service';
import { IAdBsDates } from '../../shared/model/ad-bs-dates.model';
import { AdBsDatesService } from '../ad-bs-dates/ad-bs-dates.service';
import { ICustomShutterElectricityBill } from '../../shared/model/custom-shutter-bill.model';
import { CustomerRegistrationBill, ICustomerRegistrationBill } from '../../shared/model/customer-registration-bill.model';
import { Observable } from 'rxjs';
import { ICashReceipt } from '../../shared/model/cash-receipt.model';
import { BillService } from './bill.service';
import { Router } from '@angular/router';
import { SaveAlertModalService } from '../../core/alert/save-alert-modal.service';

type SelectableEntity = IFiscalYear | ICustomer | ICustomerRegistration;

@Component({
  selector: 'jhi-bill-update',
  templateUrl: './bills-update.component.html',
  styleUrls: ['bill.scss'],
})
export class BillsUpdateComponent implements OnInit {
  query?: string;
  isSaving = false;
  customers?: ICustomerRegistration[] = [];
  customerList?: ICustomerRegistration[] = [];
  fiscalYears?: IFiscalYear[];
  customerRegistrationBill?: ICustomerRegistrationBill | any = new CustomerRegistrationBill();
  month?: string;
  fiscalYearId?: any;
  approve = false;
  fromDate?: any;
  toDate?: any;
  fiscalYear?: IFiscalYear | any = new FiscalYear();
  relateMonths?: IAdBsDates[] = [];
  constructor(
    protected customerRegistrationService: CustomerRegistrationService,
    protected billService: BillService,
    protected router: Router,
    protected fiscalYearService: FiscalYearService,
    protected relateBsAdService: AdBsDatesService,
    private saveAlertModalService: SaveAlertModalService
  ) {}

  ngOnInit(): void {
    this.customerRegistrationService.findAllActiveRegistrations().subscribe((resp: HttpResponse<ICustomerRegistration[]>) => {
      this.customers = resp.body || [];
    });
  }
  reset(): void {
    this.customerRegistrationService
      .findAllActiveRegistrations()
      .subscribe((res: HttpResponse<ICustomerRegistration[]>) => (this.customers = res.body || []));
  }

  filter(): boolean {
    if (!this.query) {
      return false;
    }
    this.customerRegistrationService
      .searchAllActiveRegistrations(this.query)
      .subscribe((res: HttpResponse<ICustomerRegistration[]>) => (this.customers = res.body || []));
    return true;
  }

  resetFiscal(): void {
    this.fiscalYearId = null;
    this.fiscalYears = [];
    this.fiscalYearService.getAll().subscribe((res: HttpResponse<IFiscalYear[]>) => (this.fiscalYears = res.body || []));
  }
  approveCustomersForBillStatus(): void {
    this.customerList = [];
    this.customers?.forEach(customer => {
      if (this.approve) {
        customer.approve = true;
        this.customerList?.push(customer);
      } else {
        customer.approve = false;
      }
    });
  }

  approveBillstatus(customerRegistration: ICustomerRegistration): void {
    this.approve = true;
    if (customerRegistration.approve === true) {
      this.customerList?.push(customerRegistration);
    }
    this.customerList?.forEach((item, index) => {
      if (customerRegistration.approve === false && customerRegistration.id === item.id) {
        this.customerList?.splice(index, 1);
      }
    });
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
        this.relateBsAdService.queryFiscalMonth(this.fiscalYearId, this.month).subscribe((res: HttpResponse<IAdBsDates[]>) => {
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

  save(): void {
    this.customerList?.forEach((customer, index) => {
      if (!customer.approve) {
        this.customerList?.splice(index, 1);
      }
    });
    this.customerRegistrationBill.month = this.month;
    this.customerRegistrationBill.fiscalYearId = this.fiscalYearId;
    this.customerRegistrationBill.customerRegistrationDTOList = this.customerList;
    this.subscribeToSaveResponse(this.billService.createCustomerRegistratiobBill(this.customerRegistrationBill));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomerRegistrationBill>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.saveAlertModalService.saveAlert();
    this.customerList = [];
    this.previousState();
  }

  previousState(): void {
    window.history.back();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackId(index: number, item: ICustomerRegistration): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }
}
