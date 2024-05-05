import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICustomerRegistration } from '../../shared/model/customer-registration.model';
import { CustomerRegistrationService } from '../customer-registration/customer-registration.service';
import { IElectricityType } from '../../shared/model/electricity-type.model';
import { ICustomer } from '../../shared/model/customer.model';
import { FiscalYear, IFiscalYear } from '../../shared/model/fiscal-year.model';
import { FiscalYearService } from '../fiscal-year/fiscal-year.service';
import { AdBsDatesService } from '../ad-bs-dates/ad-bs-dates.service';
import { HttpResponse } from '@angular/common/http';
import { IAdBsDates } from '../../shared/model/ad-bs-dates.model';
import { CustomerService } from '../customer/customer.service';
import { IBill } from '../../shared/model/bill.model';
import { BillService } from '../bill/bill.service';
import { IFloorBlockShutter } from '../../shared/model/floorblock-shutter.model';
import { ICustomerShutter } from '../../shared/model/customer-shutter.model';
import { IShutterElectricity } from '../../shared/model/shutter-electricity.model';
import { Observable } from 'rxjs';
@Component({
  selector: 'jhi-ledger',
  templateUrl: './electricity-ledger.component.html',
  styleUrls: ['ledger.scss'],
})
export class ElectricityLedgerComponent implements OnInit {
  isSaving = false;
  floorBlocks?: IFloorBlockShutter[];
  bills?: IBill[] = [];
  shutterElectricities: IShutterElectricity[] = [];
  customerId?: any;
  customers?: ICustomer[];
  fiscalYear?: IFiscalYear | any = new FiscalYear();
  relateMonths?: IAdBsDates[] = [];
  filterBy?: any;
  showButton = false;
  showMonth?: any;
  month?: any;
  fiscalYearId?: any;
  fiscalYears?: IFiscalYear[];
  fromDate?: any;
  toDate?: any;
  isSearch?: boolean;
  toUnit?: any;

  constructor(
    protected billService: BillService,
    protected fiscalYearService: FiscalYearService,
    protected relateBsAdService: AdBsDatesService,
    protected customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.fiscalYearService.getAll().subscribe((res: HttpResponse<IFiscalYear[]>) => (this.fiscalYears = res.body || []));
    this.customerService.finadAll().subscribe((res: HttpResponse<ICustomer[]>) => {
      this.customers = res.body || [];
    });
  }

  save(shutterElectricity: IShutterElectricity): void {
    shutterElectricity.fiscalYearId = this.fiscalYear.id;
    shutterElectricity.month = this.month;
    this.subscribeToSaveResponse(this.billService.saveElectricityBill(shutterElectricity));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShutterElectricity>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  previousState(): void {
    window.history.back();
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.filter();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  generateElectricityPdf(): void {
    this.billService.generateElectricityPdf(this.customerId, this.filterBy, this.month, this.fiscalYear.id, this.fromDate, this.toDate);
  }

  resetSearch(): void {
    this.isSearch = false;
    this.fiscalYearId = null;
    this.month = null;
    this.showMonth = false;
    this.customerId = null;
    this.filterBy = '';
    this.fromDate = null;
    this.toDate = null;
    this.floorBlocks = [];
    this.bills = [];
    this.ngOnInit();
  }

  showMonthOrNot(): void {
    if (this.filterBy === 'MONTH') {
      this.showMonth = true;
    } else {
      this.showMonth = false;
      this.month = '';
      this.fromDate = null;
      this.toDate = null;
      this.resetFiscal();
    }
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
        if (this.showMonth) {
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
  }

  filter(): void {
    this.shutterElectricities = [];
    this.billService
      .filter(this.customerId, this.filterBy, this.month, this.fiscalYear.id, this.fromDate, this.toDate)
      .subscribe((res: HttpResponse<IFloorBlockShutter[]>) => {
        this.floorBlocks = res.body || [];
        this.floorBlocks.forEach(floorBlock => {
          if (floorBlock.blockShutterDto?.shutterElectricityDtos) {
            floorBlock.blockShutterDto.shutterElectricityDtos.forEach(shutterElectricity => {
              shutterElectricity.fromUnitValue = Number(shutterElectricity.fromUnit);
              shutterElectricity.toUnitValue = Number(shutterElectricity.toUnit);
              if (this.shutterElectricities) {
                this.shutterElectricities.push(shutterElectricity);
              }
            });
          }
        });
      });
  }

  trackId(index: number, item: IBill): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }
}
