import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ILedger, Ledger } from 'app/shared/model/ledger.model';
import { LedgerService } from './ledger.service';
import { IFiscalYear } from 'app/shared/model/fiscal-year.model';
import { FiscalYearService } from 'app/entities/fiscal-year/fiscal-year.service';
import { IBill } from 'app/shared/model/bill.model';
import { BillService } from 'app/entities/bill/bill.service';

type SelectableEntity = IFiscalYear | IBill;

@Component({
  selector: 'jhi-ledger-update',
  templateUrl: './ledger-update.component.html',
  styleUrls: ['ledger.scss'],
})
export class LedgerUpdateComponent implements OnInit {
  isSaving = false;
  fiscalyears: IFiscalYear[] = [];
  bills: IBill[] = [];

  editForm = this.fb.group({
    id: [],
    remarks: [null, [Validators.required]],
    paidAmount: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    month: [null, [Validators.required]],
    ledgerType: [null, [Validators.required]],
    fiscalYear: [null, Validators.required],
    bill: [null, Validators.required],
  });

  constructor(
    protected ledgerService: LedgerService,
    protected fiscalYearService: FiscalYearService,
    protected billService: BillService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ledger }) => {
      this.updateForm(ledger);

      this.fiscalYearService.query().subscribe((res: HttpResponse<IFiscalYear[]>) => (this.fiscalyears = res.body || []));

      this.billService.query().subscribe((res: HttpResponse<IBill[]>) => (this.bills = res.body || []));
    });
  }

  updateForm(ledger: ILedger): void {
    this.editForm.patchValue({
      id: ledger.id,
      remarks: ledger.remarks,
      paidAmount: ledger.paidAmount,
      amount: ledger.amount,
      month: ledger.month,
      ledgerType: ledger.ledgerType,
      fiscalYear: ledger.fiscalYearId,
      bill: ledger.billId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ledger = this.createFromForm();
    if (ledger.id !== undefined) {
      this.subscribeToSaveResponse(this.ledgerService.update(ledger));
    } else {
      this.subscribeToSaveResponse(this.ledgerService.create(ledger));
    }
  }

  private createFromForm(): ILedger {
    return {
      ...new Ledger(),
      id: this.editForm.get(['id'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      paidAmount: this.editForm.get(['paidAmount'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      month: this.editForm.get(['month'])!.value,
      ledgerType: this.editForm.get(['ledgerType'])!.value,
      fiscalYearId: this.editForm.get(['fiscalYearId'])!.value,
      billId: this.editForm.get(['billId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILedger>>): void {
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
