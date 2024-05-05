import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IMeternumber, Meternumber } from 'app/shared/model/meternumber.model';
import { MeternumberService } from './meternumber.service';

@Component({
  selector: 'jhi-meternumber-update',
  templateUrl: './meternumber-update.component.html',
})
export class MeternumberUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    meterNumber: [],
    floorId: [],
    customerId: [],
    blockId: [],
  });

  constructor(protected meternumberService: MeternumberService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meternumber }) => {
      this.updateForm(meternumber);
    });
  }

  updateForm(meternumber: IMeternumber): void {
    this.editForm.patchValue({
      id: meternumber.id,
      meterNumber: meternumber.meterNumber,
      floorId: meternumber.floorId,
      customerId: meternumber.customerId,
      blockId: meternumber.blockId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const meternumber = this.createFromForm();
    if (meternumber.id !== undefined) {
      this.subscribeToSaveResponse(this.meternumberService.update(meternumber));
    } else {
      this.subscribeToSaveResponse(this.meternumberService.create(meternumber));
    }
  }

  private createFromForm(): IMeternumber {
    return {
      ...new Meternumber(),
      id: this.editForm.get(['id'])!.value,
      meterNumber: this.editForm.get(['meterNumber'])!.value,
      floorId: this.editForm.get(['floorId'])!.value,
      customerId: this.editForm.get(['customerId'])!.value,
      blockId: this.editForm.get(['blockId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeternumber>>): void {
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
