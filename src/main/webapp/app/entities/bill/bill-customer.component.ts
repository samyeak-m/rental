import { Component, OnInit } from '@angular/core';
import { BillService } from './bill.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BillCustomer, IBillCustomer } from '../../shared/model/bill-customer.model';
import { Bill, IBill } from '../../shared/model/bill.model';
import { HttpResponse } from '@angular/common/http';
import { DATE_TIME_FORMAT } from '../../shared/constants/input.constants';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'jhi-bill-detail',
  templateUrl: './bill-customer.component.html',
  styleUrls: ['bill-customer.scss'],
})
export class BillCustomerComponent implements OnInit {
  billCustomer?: IBillCustomer | any = new BillCustomer();
  billPaymentStatus?: IBill | any = new Bill();
  sumOfServiceChargeDeduct?: number;
  sumOfElectricityDeduct?: number;
  sumOfWaterDeduct?: number;
  sumOfTdsDeduct?: number;
  closeResult?: string;
  showPopup = false;
  bill?: IBill | any = new Bill();
  billObj?: IBill | any = new Bill();
  billMonth?: IBill | any = new Bill();
  bills?: IBill[];
  billId?: number | any;
  hideAddButton = false;
  totalAmount?: number | any;
  customerId?: number | any;
  showForm = false;
  isSaving = false;
  amount?: number;
  electricityFromUnit?: string;
  electricityToUnit?: string;
  showElectricityForm = false;
  monthlyDeduct?: number;
  showPayForm = false;
  showAdjustBillForm = false;
  amountType = true;
  disableAmount = true;
  month?: string;
  buttonDisabled = false;
  paymentTypes?: string[] = ['ALL'];
  hideAmount = true;
  partialPaymentList?: string[] = ['ALL', 'ELECTRICITY', 'SERVICECHARGE', 'WATER', 'MONTHLYRENT', 'TDS'];
  editForm = this.fb.group({
    id: [],
    addParticulars: this.fb.array([]),
    month: [null, [Validators.required]],
  });

  constructor(
    protected billService: BillService,
    protected modalService: NgbModal,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billCustomer }) => {
      this.billCustomer = billCustomer;
      this.sumOfElectricityDeduct = this.billCustomer.electricityDeduct;
      this.sumOfServiceChargeDeduct = this.billCustomer.serviceChargeDeduct;
      this.sumOfWaterDeduct = this.billCustomer.waterDeduct;
      this.totalAmount = this.billCustomer.sumOfBillAmount - this.billCustomer.sumOfPaidAmount;
      this.monthlyDeduct = this.billCustomer.monthlyDeduct - this.billCustomer.monthlyDeduct * 0.1;
      this.sumOfTdsDeduct = this.billCustomer.tdsDeduct;
      this.addNewBillParticulars();
      this.billId = billCustomer.bills[0].id;
      this.customerId = billCustomer.bills[0].customerId;
      this.billService.findBillByCustomerIdAndPaymentStatus(this.customerId).subscribe((resp: HttpResponse<IBill>) => {
        this.billPaymentStatus = resp.body;
        if (this.billPaymentStatus.billIncomplete) {
          this.showPopup = true;
        }
      });
    });
  }

  openDialog(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'pay-proceed-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  resetDialog(): void {
    this.modalService.dismissAll();
  }

  trackId(index: number, item: IBill): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  setRemarks(index: number): void {
    this.billParticulars.at(index).get('disableRemarks')?.setValue(false);
    this.findByPaymentType(index);
    this.hideAmount = true;
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
      addParticulars: bill.addParticulars,
    });
  }

  findByCustomerIdAndMonth(): void {
    if (this.editForm.get(['month'])!.value) {
      this.billService
        .findByCustomerIdAndMonth(this.customerId, this.editForm.get(['month'])!.value)
        .subscribe((res: HttpResponse<IBill>) => {
          this.billMonth = res.body;
        });
    }
  }

  findByPaymentType(index: number): void {
    this.buttonDisabled = false;
    if (this.billParticulars.at(index).get(['partialPayment'])?.value === 'ALL') {
      this.partialPaymentList = [];
      this.partialPaymentList = this.paymentTypes;
      this.hideAddButton = true;
      this.billParticulars.at(index).get(['amount'])?.setValue(this.billMonth.finalAmount);
    } else if (this.billParticulars.at(index).get(['partialPayment'])?.value === 'ELECTRICITY') {
      this.billParticulars
        .at(index)
        .get(['amount'])
        ?.setValue(
          this.billMonth.electricityAmount +
            this.billMonth.electricityFineAmount -
            this.billMonth.electricityDiscountAmount -
            this.billMonth.electricityDeduct
        );
    } else if (this.billParticulars.at(index).get(['partialPayment'])?.value === 'SERVICECHARGE') {
      this.billParticulars
        .at(index)
        .get(['amount'])
        ?.setValue(this.billMonth.serviceChargeAmount - this.billMonth.serviceChargeDeduct);
    } else if (this.billParticulars.at(index).get(['partialPayment'])?.value === 'WATER') {
      this.billParticulars
        .at(index)
        .get(['amount'])
        ?.setValue(this.billMonth.waterAmount - this.billMonth.waterDeduct);
    } else if (this.billParticulars.at(index).get(['partialPayment'])?.value === 'MONTHLYRENT') {
      this.billParticulars
        .at(index)
        .get(['amount'])
        ?.setValue(this.billMonth.monthlyRent - this.billMonth.monthlyDeduct);
    } else if (this.billParticulars.at(index).get(['partialPayment'])?.value === 'TDS') {
      this.billParticulars
        .at(index)
        .get(['amount'])
        ?.setValue(this.billMonth.tds - this.billMonth.tdsDeduct);
    }
  }

  setAmountType(index: number): void {
    this.billParticulars.at(index).get(['disableAmountType'])?.setValue(false);
  }

  setDiscountType(index: number): void {
    this.billParticulars.at(index).get(['disableDiscountType'])?.setValue(false);
  }

  validateAmount(index: number): void {
    if (this.billParticulars.at(index).get(['amount'])!.value > this.totalAmount) {
      this.billParticulars.at(index).get(['amount'])?.setValue(this.totalAmount);
    }
    if (this.billParticulars.at(index).get(['amount'])!.value === 0.0) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }

    const amountCons = String(this.billParticulars.at(index).get(['amount'])!.value);
    if (amountCons.startsWith('-')) {
      this.billParticulars.at(index).get(['amount'])?.setValue(1);
    }
  }

  validateAdjustAmount(index: number): void {
    if (this.billParticulars.at(index).get(['amount'])!.value === 0.0) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }

    const amountCons = String(this.billParticulars.at(index).get(['amount'])!.value);
    if (amountCons.startsWith('-')) {
      this.billParticulars.at(index).get(['amount'])?.setValue(1);
    }
  }

  setParticularAmount(index: number): void {
    this.billParticulars.at(index).get(['disableAmount'])?.setValue(false);
    this.hideAmount = false;
    this.findByPaymentType(index);
    if (this.billParticulars.at(index).get(['amount'])!.value === 0.0) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }

    const amountCons = String(this.billParticulars.at(index).get(['amount'])!.value);
    if (amountCons.startsWith('-')) {
      this.billParticulars.at(index).get(['amount'])?.setValue(1);
    }
  }

  get billParticulars(): FormArray {
    return this.editForm.get('addParticulars') as FormArray;
  }

  formAction(bill: IBill): void {
    this.showForm = true;
    this.bill = bill;
  }

  showAdjustForm(): void {
    this.showAdjustBillForm = true;
    this.showForm = false;
    this.showPayForm = false;
  }

  payForm(): void {
    this.showPayForm = true;
  }

  // processBillPayment(): void {
  //   if (this.amount) {
  //     this.billService.find(this.billId).subscribe((res: HttpResponse<IBill>) => {
  //       this.bill = res.body;
  //       this.bill.totalAmount = this.amount;
  //       this.billService.pay(this.bill).subscribe((resp: HttpResponse<IBill[]>) => {
  //         this.bills = resp.body || [];
  //         this.router.navigate(['/cash-receipt', this.bills[0].cashReceiptId, 'view']);
  //       });
  //     });
  //   }
  // }

  newBillParticulars(): FormGroup {
    return this.fb.group({
      remarks: '',
      discountType: '',
      partialPayment: '',
      amount: 0,
      amountType: '',
      disableRemarks: true,
      disableDiscountType: true,
      disableAmountType: true,
      disableAmount: true,
    });
  }

  addNewBillParticulars(): void {
    this.billParticulars.push(this.newBillParticulars());
  }

  removeBillParticulars(i: number): void {
    this.billParticulars.removeAt(i);
  }

  reset(): void {
    this.billParticulars.clear();
    this.addNewBillParticulars();
    this.showElectricityForm = false;
    this.showForm = false;
    this.showPayForm = false;
    this.showAdjustBillForm = false;
  }

  private createFromForm(): IBill {
    return {
      ...new Bill(),
      id: this.editForm.get(['id'])!.value,
      month: this.editForm.get(['month'])!.value,
      addParticulars: this.editForm.get(['addParticulars'])!.value,
    };
  }

  showElectricity(bill: IBill): void {
    this.showForm = false;
    this.showElectricityForm = true;
    this.bill = bill;
  }

  processElectricity(): void {
    if (this.electricityFromUnit && this.electricityToUnit) {
      this.bill.electricityFromUnit = this.electricityFromUnit;
      this.bill.electricityToUnit = this.electricityToUnit;
      this.billService.update(this.bill).subscribe((res: HttpResponse<IBill>) => {
        this.bill = res.body;
      });
      location.reload();
    }
  }

  adjust(): void {
    this.isSaving = true;
    this.bill = this.createFromForm();
    this.bill.id = this.billId;
    this.billService.find(this.bill.id).subscribe((resp: HttpResponse<IBill>) => {
      this.billObj = resp.body;
      this.bill.customerId = this.billObj.customerId;
      this.billService.adjust(this.bill).subscribe((res: HttpResponse<IBill>) => {
        this.bill = res.body;
        this.router.navigate(['/cash-receipt', this.bill.cashReceiptId, 'view']);
      });
    });
  }

  save(): void {
    this.isSaving = true;
    this.bill = this.createFromForm();
    this.bill.id = this.billId;
    this.billService.find(this.bill.id).subscribe((resp: HttpResponse<IBill>) => {
      this.billObj = resp.body;
      this.bill.customerId = this.billObj.customerId;
      this.billService.pay(this.bill).subscribe((res: HttpResponse<IBill>) => {
        this.bill = res.body;
        this.router.navigate(['/cash-receipt', this.bill.cashReceiptId, 'view']);
      });
    });
  }
}
