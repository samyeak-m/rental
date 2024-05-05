import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Bill, IBill } from 'app/shared/model/bill.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BillService } from './bill.service';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { DATE_FORMAT } from '../../shared/constants/input.constants';
import { AdBsDates, IAdBsDates } from '../../shared/model/ad-bs-dates.model';
import { AdBsDatesService } from '../ad-bs-dates/ad-bs-dates.service';
@Component({
  selector: 'jhi-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['bill-detail.scss'],
})
export class BillDetailComponent implements OnInit {
  isSaving = false;
  showForm = false;
  showElectricityForm = false;
  showBill = false;
  showDiscount = false;
  showPay = false;
  bill: IBill | any = new Bill();
  adBsDate: IAdBsDates | null = new AdBsDates();
  closeResult?: string;
  showButton = false;
  electricityFromUnit?: string;
  addedDiscountAmount?: number;
  electricityToUnit?: string;
  totalAmount?: number;
  sumOfAmount?: number;
  paymentDate?: string;
  editForm = this.fb.group({
    id: [],
    addParticulars: this.fb.array([]),
  });
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected billService: BillService,
    protected adBsDatesService: AdBsDatesService,
    protected modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.showBill = true;
    this.activatedRoute.data.subscribe(({ bill }) => {
      this.bill = bill;
      this.calculateBillAmount();
      this.addNewBillParticulars();
      const today = moment().startOf('day');
      this.bill.paymentDateAd = today;
      const billConst = this.parse(this.bill);
      this.adBsDatesService.findByAdDate(billConst.paymentDateAd).subscribe((res: HttpResponse<IAdBsDates>) => {
        this.adBsDate = res.body;
        if (this.adBsDate) {
          this.paymentDate = this.adBsDate.bsDate;
        }
      });
    });
  }

  get billParticulars(): FormArray {
    return this.editForm.get('addParticulars') as FormArray;
  }

  newBillParticulars(): FormGroup {
    return this.fb.group({
      remarks: '',
      discountType: '',
      amountType: '',
      amount: 0,
    });
  }

  addNewBillParticulars(): void {
    this.billParticulars.push(this.newBillParticulars());
  }
  showDiscountForm(): void {
    this.showDiscount = true;
  }

  openElectricityForm(): void {
    this.showBill = false;
  }

  removeBillParticulars(i: number): void {
    this.billParticulars.removeAt(i);
  }

  private createFromForm(): IBill {
    return {
      ...new Bill(),
      id: this.editForm.get(['id'])!.value,
      addParticulars: this.editForm.get(['addParticulars'])!.value,
    };
  }

  processElectricityUnit(content: any): void {
    this.showElectricityForm = true;
    this.showForm = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-discount-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  processElectricity(): void {
    if (this.electricityFromUnit && this.electricityToUnit) {
      this.bill.electricityFromUnit = this.electricityFromUnit;
      this.bill.electricityToUnit = this.electricityToUnit;
      this.billService.update(this.bill).subscribe((res: HttpResponse<IBill>) => {
        this.bill = res.body;
        this.billService.find(this.bill.id).subscribe((resp: HttpResponse<IBill>) => {
          this.bill = resp.body;
          this.calculateBillAmount();
          this.showBill = true;
        });
      });
    }
  }

  processDiscountForm(content: any): boolean {
    if ((!this.electricityFromUnit || !this.electricityToUnit) && this.bill.paymentStatus === 'INCOMPLETE') {
      return false;
    }
    this.showElectricityForm = false;
    this.showDiscount = true;
    if (this.electricityFromUnit && this.electricityToUnit) {
      this.bill.electricityFromUnit = this.electricityFromUnit;
      this.bill.electricityToUnit = this.electricityToUnit;
      this.billService.update(this.bill).subscribe((res: HttpResponse<IBill>) => {
        this.bill = res.body;
      });
    }
    this.modalService.open(content, { ariaLabelledBy: 'discount-proceed-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    return true;
  }

  openBill(content: any): void {
    this.showDiscount = false;
    this.showBill = true;
    if (this.addedDiscountAmount) {
      this.bill.addedAmount = this.addedDiscountAmount;
      this.billService.processDiscountAmount(this.bill).subscribe((res: HttpResponse<IBill>) => {
        this.bill = res.body;
      });
    }
    this.modalService.open(content, { ariaLabelledBy: 'bill-proceed-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  openPayForm(content: any): void {
    this.totalAmount = this.bill.finalAmount;
    this.showBill = false;
    this.showPay = true;
    this.modalService.open(content, { ariaLabelledBy: 'pay-proceed-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  generatePdf(id?: number): void {
    this.billService.createPdf(id);
  }

  // processPay(): void {
  //   this.bill.totalAmount = this.totalAmount;
  //   this.bill.paymentDate = this.paymentDate;
  //   this.billService.pay(this.bill).subscribe((res: HttpResponse<IBill>) => {
  //     this.billService.find(this.bill.id).subscribe((resp: HttpResponse<IBill>) => {
  //       this.bill = resp.body;
  //     });
  //     this.modalService.dismissAll();
  //     this.showForm = false;
  //   });
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  reset(): void {
    this.showBill = true;
    this.showElectricityForm = false;
    this.showDiscount = false;
  }

  save(): void {
    this.isSaving = true;
    const billValue = this.createFromForm();
    this.bill.addParticulars = billValue.addParticulars;
    const billId = this.bill.id;
    this.billService.processDiscountAmount(this.bill).subscribe((res: HttpResponse<IBill>) => {
      for (let i = 0; i < this.billParticulars.length; i++) {
        this.billParticulars.at(i).get('remarks')?.setValue('');
        this.billParticulars.at(i).get('discountType')?.setValue('');
        this.billParticulars.at(i).get('amountType')?.setValue('');
        this.billParticulars.at(i).get('amount')?.setValue(0.0);
      }
      this.newBillParticulars();
      this.billService.find(billId).subscribe((respp: HttpResponse<IBill>) => {
        this.bill = respp.body;
        this.calculateBillAmount();
        this.showDiscount = false;
      });
    });
  }

  calculateBillAmount(): void {
    if (this.bill.paymentStatus !== 'PAID') {
      this.sumOfAmount =
        this.bill.taxableAmount +
        this.bill.totalVat -
        this.bill.discountAmount +
        this.bill.fineAmount +
        this.bill.monthlyRent -
        this.bill.tds +
        this.bill.electricityFineAmount -
        this.bill.electricityDiscountAmount +
        this.bill.addParticularTotalAmount;
    } else {
      this.sumOfAmount = this.bill.paidAmount;
    }
  }

  previousState(): void {
    window.history.back();
  }

  protected parse(bill: IBill): IBill {
    const copy: IBill = Object.assign({}, bill, {
      paymentDateAd: bill.paymentDateAd && bill.paymentDateAd.isValid() ? bill.paymentDateAd.format(DATE_FORMAT) : undefined,
    });
    return copy;
  }
}
