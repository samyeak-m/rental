import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { IAdBsDates, AdBsDates } from 'app/shared/model/ad-bs-dates.model';
import { AdBsDatesService } from './ad-bs-dates.service';
import { IFiscalYear } from 'app/shared/model/fiscal-year.model';

@Component({
  selector: 'jhi-ad-bs-dates-update',
  templateUrl: './ad-bs-dates-update.component.html',
  styleUrls: ['ad-bs-dates.scss'],
})
export class AdBsDatesUpdateComponent implements OnInit, AfterViewInit {
  isSaving = false;
  adDateDp: any;
  bsDateDp: any;
  adBsDates: IAdBsDates = new AdBsDates();

  editForm = this.fb.group({
    id: [],
    adDate: [null, [Validators.required]],
    bsDate: [null, [Validators.required]],
    /* day: [null, [Validators.required]],
    holiday: [null, [Validators.required]],*/
    month: [],
    totalDays: [],
    relateMonths: this.fb.array([]),
    /* fiscalYearId: [null, [Validators.required]],
    fiscalYearN: [],
    createdDate: [],
    updatedDate: [],
    deleted: [null, [Validators.required]],
    insertedBy: [null, [Validators.required]],
    insertedByID: [null, [Validators.required]],
    updatedBy: [null, [Validators.required]],
    updatedByID: [null, [Validators.required]],
    status: [null, [Validators.required]],
    fiscalYear: [null, Validators.required],*/
  });

  constructor(protected adBsDatesService: AdBsDatesService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adBsDates }) => {
      this.adBsDates = adBsDates;
      adBsDates = new AdBsDates();
      this.updateForm(adBsDates);

      const today = moment().startOf('day');
      adBsDates.createdDate = today;
      adBsDates.updatedDate = today;
      for (let mon = 1; mon <= 12; mon++) {
        this.relateMonths.push(this.newRelateMonth());
      }
    });
  }
  ngAfterViewInit(): void {
    for (let mon = 0; mon <= 12; mon++) {
      if (mon === 0) {
        this.relateMonths.at(mon).get('month')?.setValue('BAISHAKH');
        this.relateMonths.at(mon).get('totalDays')?.setValue('31');
      } else if (mon === 1) {
        this.relateMonths.at(mon).get('month')?.setValue('JESTHA');
        this.relateMonths.at(mon).get('totalDays')?.setValue('32');
      } else if (mon === 2) {
        this.relateMonths.at(mon).get('month')?.setValue('ASHAD');
        this.relateMonths.at(mon).get('totalDays')?.setValue('31');
      } else if (mon === 3) {
        this.relateMonths.at(mon).get('month')?.setValue('SHRAWAN');
        this.relateMonths.at(mon).get('totalDays')?.setValue('32');
      } else if (mon === 4) {
        this.relateMonths.at(mon).get('month')?.setValue('BHADRA');
        this.relateMonths.at(mon).get('totalDays')?.setValue('31');
      } else if (mon === 5) {
        this.relateMonths.at(mon).get('month')?.setValue('ASHOJ');
        this.relateMonths.at(mon).get('totalDays')?.setValue('30');
      } else if (mon === 6) {
        this.relateMonths.at(mon).get('month')?.setValue('KARTIK');
        this.relateMonths.at(mon).get('totalDays')?.setValue('30');
      } else if (mon === 7) {
        this.relateMonths.at(mon).get('month')?.setValue('MANGSIR');
        this.relateMonths.at(mon).get('totalDays')?.setValue('30');
      } else if (mon === 8) {
        this.relateMonths.at(mon).get('month')?.setValue('POUSH');
        this.relateMonths.at(mon).get('totalDays')?.setValue('29');
      } else if (mon === 9) {
        this.relateMonths.at(mon).get('month')?.setValue('MAGH');
        this.relateMonths.at(mon).get('totalDays')?.setValue('30');
      } else if (mon === 10) {
        this.relateMonths.at(mon).get('month')?.setValue('FALGUN');
        this.relateMonths.at(mon).get('totalDays')?.setValue('29');
      } else if (mon === 11) {
        this.relateMonths.at(mon).get('month')?.setValue('CHAITRA');
        this.relateMonths.at(mon).get('totalDays')?.setValue('31');
      }
    }

    if (this.adBsDates) {
      this.editForm.get(['adDate'])?.setValue(this.adBsDates?.lastAD);
      this.editForm.get(['bsDate'])?.setValue(this.adBsDates?.lastBS);
    }
  }
  updateForm(adBsDates: IAdBsDates): void {
    this.editForm.patchValue({
      id: adBsDates.id,
      adDate: adBsDates.adDate,
      bsDate: adBsDates.bsDate,
      month: adBsDates.month,
      totalDays: adBsDates.totalDays,
      /* day: adBsDates.day,
      holiday: adBsDates.holiday,*/
    });
  }

  get relateMonths(): FormArray {
    return this.editForm.get('relateMonths') as FormArray;
  }

  newRelateMonth(): FormGroup {
    return this.fb.group({
      id: '',
      month: '',
      totalDays: '',
    });
  }

  setRelateMonth(value: AdBsDates): FormGroup {
    return this.fb.group({
      month: value.month,
      totalDays: value.totalDays,
    });
  }

  pushRelateMonths(value: AdBsDates): void {
    this.relateMonths.push(this.setRelateMonth(value));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const adBsDates = this.createFromForm();
    if (adBsDates.id !== undefined) {
      this.subscribeToSaveResponse(this.adBsDatesService.update(adBsDates));
    } else {
      this.subscribeToSaveResponse(this.adBsDatesService.create(adBsDates));
    }
  }

  private createFromForm(): IAdBsDates {
    return {
      ...new AdBsDates(),
      id: this.editForm.get(['id'])!.value,
      adDate: this.editForm.get(['adDate'])!.value,
      bsDate: this.editForm.get(['bsDate'])!.value,
      relateMonths: this.editForm.get(['relateMonths'])!.value,
      /* day: this.editForm.get(['day'])!.value,
      holiday: this.editForm.get(['holiday'])!.value,
      month: this.editForm.get(['month'])!.value,
      fiscalYearId: this.editForm.get(['fiscalYearId'])!.value,
      fiscalYearN: this.editForm.get(['fiscalYearN'])!.value,
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
      fiscalYear: this.editForm.get(['fiscalYear'])!.value*/
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdBsDates>>): void {
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

  trackById(index: number, item: IFiscalYear): any {
    return item.id;
  }
}
