import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICashReceipt, CashReceipt } from 'app/shared/model/cash-receipt.model';
import { CashReceiptService } from './cash-receipt.service';
import { ICustomer } from 'app/shared/model/customer.model';
import { CustomerService } from 'app/entities/customer/customer.service';

@Component({
  selector: 'jhi-cash-receipt-update',
  templateUrl: './cash-receipt-update.component.html',
  styleUrls: ['cash-receipt.scss'],
})
export class CashReceiptUpdateComponent implements OnInit {
  isSaving = false;
  customers: ICustomer[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [],
    customer: [],
  });

  constructor(
    protected cashReceiptService: CashReceiptService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cashReceipt }) => {
      this.updateForm(cashReceipt);

      this.customerService.query().subscribe((res: HttpResponse<ICustomer[]>) => (this.customers = res.body || []));
    });
  }

  updateForm(cashReceipt: ICashReceipt): void {
    this.editForm.patchValue({
      id: cashReceipt.id,
      amount: cashReceipt.amount,
      customer: cashReceipt.customer,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cashReceipt = this.createFromForm();
    if (cashReceipt.id !== undefined) {
      this.subscribeToSaveResponse(this.cashReceiptService.update(cashReceipt));
    } else {
      this.subscribeToSaveResponse(this.cashReceiptService.create(cashReceipt));
    }
  }

  private createFromForm(): ICashReceipt {
    return {
      ...new CashReceipt(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      customer: this.editForm.get(['customer'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICashReceipt>>): void {
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

  trackById(index: number, item: ICustomer): any {
    return item.id;
  }
}
