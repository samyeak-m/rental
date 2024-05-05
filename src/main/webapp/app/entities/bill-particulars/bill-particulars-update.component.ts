import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IBillParticulars, BillParticulars } from 'app/shared/model/bill-particulars.model';
import { BillParticularsService } from './bill-particulars.service';
import { IElectricityType } from '../../shared/model/electricity-type.model';

@Component({
  selector: 'jhi-bill-particulars-update',
  templateUrl: './bill-particulars-update.component.html',
  styleUrls: ['bill-particulars.scss'],
})
export class BillParticularsUpdateComponent implements OnInit {
  isSaving = false;
  billParticularCode?: IBillParticulars | null;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
    remarks: [],
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedById: [],
    updatedBy: [],
    updatedById: [],
    status: [],
  });

  constructor(
    protected billParticularsService: BillParticularsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billParticulars }) => {
      if (!billParticulars.id) {
        const today = moment().startOf('day');
        billParticulars.createdDate = today;
        billParticulars.updatedDate = today;
        this.billParticularsService.getLatestCode().subscribe((res: HttpResponse<IBillParticulars>) => {
          this.billParticularCode = res.body || null;
          if (this.billParticularCode) {
            this.editForm.get(['code'])!.setValue(this.billParticularCode.code);
          }
        });
      }

      this.updateForm(billParticulars);
    });
  }

  updateForm(billParticulars: IBillParticulars): void {
    this.editForm.patchValue({
      id: billParticulars.id,
      code: billParticulars.code,
      name: billParticulars.name,
      remarks: billParticulars.remarks,
      createdDate: billParticulars.createdDate ? billParticulars.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: billParticulars.updatedDate ? billParticulars.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: billParticulars.deleted,
      insertedBy: billParticulars.insertedBy,
      insertedById: billParticulars.insertedById,
      updatedBy: billParticulars.updatedBy,
      updatedById: billParticulars.updatedById,
      status: billParticulars.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const billParticulars = this.createFromForm();
    if (billParticulars.id !== undefined) {
      this.subscribeToSaveResponse(this.billParticularsService.update(billParticulars));
    } else {
      this.subscribeToSaveResponse(this.billParticularsService.create(billParticulars));
    }
  }

  private createFromForm(): IBillParticulars {
    return {
      ...new BillParticulars(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? moment(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      deleted: this.editForm.get(['deleted'])!.value,
      insertedBy: this.editForm.get(['insertedBy'])!.value,
      insertedById: this.editForm.get(['insertedById'])!.value,
      updatedBy: this.editForm.get(['updatedBy'])!.value,
      updatedById: this.editForm.get(['updatedById'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBillParticulars>>): void {
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
