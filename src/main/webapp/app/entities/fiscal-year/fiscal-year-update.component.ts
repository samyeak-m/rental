import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IFiscalYear, FiscalYear } from 'app/shared/model/fiscal-year.model';
import { FiscalYearService } from './fiscal-year.service';

@Component({
  selector: 'jhi-fiscal-year-update',
  templateUrl: './fiscal-year-update.component.html',
  styleUrls: ['fiscal-year.scss'],
})
export class FiscalYearUpdateComponent implements OnInit {
  isSaving = false;
  fiscalYrStart?: string;
  fiscalYrEnd?: string;
  fiscalAdStartDp: any;
  fiscalAdEndDp: any;
  canGenerate?: boolean = false;
  editForm = this.fb.group({
    id: [],
    fiscalYearFrom: [],
    fiscalYearTill: [],
    fiscalAdStart: [],
    fiscalAdEnd: [],
    fiscalBsStart: [null, [Validators.required]],
    fiscalBsEnd: [null, [Validators.required]],
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedByID: [],
    updatedBy: [],
    updatedByID: [],
    status: [],
  });

  constructor(protected fiscalYearService: FiscalYearService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fiscalYear }) => {
      this.updateForm(fiscalYear);
      this.editForm.get(['fiscalBsEnd'])?.setValue(fiscalYear?.fiscalBsEnd);
      this.editForm.get(['fiscalBsStart'])?.setValue(fiscalYear?.fiscalBsStart);
      this.canGenerate=fiscalYear.canGenerate;
      this.fiscalYrStart = fiscalYear.fiscalBsStart;
      this.fiscalYrEnd = fiscalYear.fiscalBsEnd;
      const today = moment().startOf('day');
      fiscalYear.createdDate = today;
      fiscalYear.updatedDate = today;
    });
  }

  updateForm(fiscalYear: IFiscalYear): void {
    this.editForm.patchValue({
      id: fiscalYear.id,
      fiscalYearFrom: fiscalYear.fiscalYearFrom,
      fiscalYearTill: fiscalYear.fiscalYearTill,
      fiscalAdStart: fiscalYear.fiscalAdStart,
      fiscalAdEnd: fiscalYear.fiscalAdEnd,
      fiscalBsStart: fiscalYear.fiscalBsStart,
      fiscalBsEnd: fiscalYear.fiscalBsEnd,
      createdDate: fiscalYear.createdDate ? fiscalYear.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: fiscalYear.updatedDate ? fiscalYear.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: fiscalYear.deleted,
      insertedBy: fiscalYear.insertedBy,
      insertedByID: fiscalYear.insertedByID,
      updatedBy: fiscalYear.updatedBy,
      updatedByID: fiscalYear.updatedByID,
      status: fiscalYear.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  formatFiscalYear(event?: any): void {
    const tempStart = this.editForm.get(['fiscalBsStart'])!.value;
    if (tempStart) {
      const length = tempStart.length;
      let finalFiscalStart;
      if (length <= 4) {

        this.editForm.get(['fiscalBsStart'])?.setValue(this.fiscalYrStart + '-');
      } else {
        if (event.key !== 'Backspace') {
          if (length === 7) {
            finalFiscalStart = tempStart + '-';
            this.editForm.get(['fiscalBsStart'])?.setValue(finalFiscalStart);
          }
        }
      }
    }
  }

  formatFiscalYearEnd(event?: any): void {
    const tempStart = this.editForm.get(['fiscalBsEnd'])!.value;
    if (tempStart) {
      const length = tempStart.length;
      let finalFiscalEnd;
      if (length <= 4) {
        this.editForm.get(['fiscalBsEnd'])?.setValue(this.fiscalYrEnd + '-');
      } else {
        if (event.key !== 'Backspace') {
          if (length === 7) {
            finalFiscalEnd = tempStart + '-';
            this.editForm.get(['fiscalBsEnd'])?.setValue(finalFiscalEnd);
          }
        }
      }
    }
  }

  save(): void {
    this.isSaving = true;
    const fiscalYear = this.createFromForm();
    if (fiscalYear.id !== undefined) {
      this.subscribeToSaveResponse(this.fiscalYearService.update(fiscalYear));
    } else {
      this.subscribeToSaveResponse(this.fiscalYearService.create(fiscalYear));
    }
  }

  private createFromForm(): IFiscalYear {
    return {
      ...new FiscalYear(),
      id: this.editForm.get(['id'])!.value,
      fiscalYearFrom: this.editForm.get(['fiscalYearFrom'])!.value,
      fiscalYearTill: this.editForm.get(['fiscalYearTill'])!.value,
      fiscalAdStart: this.editForm.get(['fiscalAdStart'])!.value,
      fiscalAdEnd: this.editForm.get(['fiscalAdEnd'])!.value,
      fiscalBsStart: this.editForm.get(['fiscalBsStart'])!.value,
      fiscalBsEnd: this.editForm.get(['fiscalBsEnd'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? moment(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      deleted: this.editForm.get(['deleted'])!.value,
      insertedBy: this.editForm.get(['insertedBy'])!.value,
      insertedByID: this.editForm.get(['insertedByID'])!.value,
      updatedBy: this.editForm.get(['updatedBy'])!.value,
      updatedByID: this.editForm.get(['updatedByID'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFiscalYear>>): void {
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
