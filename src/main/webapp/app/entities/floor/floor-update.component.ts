import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IFloor, Floor } from 'app/shared/model/floor.model';
import { FloorService } from './floor.service';
import { IBlock } from '../../shared/model/block.model';
import { BlockService } from '../block/block.service';
import { IBusinessType } from '../../shared/model/business-type.model';

@Component({
  selector: 'jhi-floor-update',
  templateUrl: './floor-update.component.html',
  styleUrls: ['floor.scss'],
})
export class FloorUpdateComponent implements OnInit {
  isSaving = false;
  floorId?: number;
  showEdit = false;
  remainingBlocks: IBlock[] = [];
  list: IBlock[] = [];
  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
    remarks: [null, [Validators.required]],
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
    protected floorService: FloorService,
    protected activatedRoute: ActivatedRoute,
    protected blockService: BlockService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ floor }) => {
      if (!floor.id) {
        const today = moment().startOf('day');
        floor.createdDate = today;
        floor.updatedDate = today;
        // this.floorService.getLatestCode().subscribe((res: HttpResponse<IFloor>) => {
        //   this.floorTypeCode = res.body || null;
        //   if (this.floorTypeCode) {
        //     this.editForm.get(['code'])!.setValue(this.floorTypeCode.code);
        //   }
        // });
      }
      this.updateForm(floor);
    });
  }

  updateForm(floor: IFloor): void {
    this.editForm.patchValue({
      id: floor.id,
      code: floor.code,
      name: floor.name,
      remarks: floor.remarks,
      createdDate: floor.createdDate ? floor.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: floor.updatedDate ? floor.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: floor.deleted,
      insertedBy: floor.insertedBy,
      insertedById: floor.insertedById,
      updatedBy: floor.updatedBy,
      updatedById: floor.updatedById,
      status: floor.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const floor = this.createFromForm();
    this.floorId = floor.id;
    if (this.floorId) {
      this.subscribeToSaveResponse(this.floorService.update(floor));
    } else {
      this.subscribeToSaveResponse(this.floorService.create(floor));
    }
  }

  private createFromForm(): IFloor {
    return {
      ...new Floor(),
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFloor>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  trackById(index: number, item: IBlock): any {
    return item.id;
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
