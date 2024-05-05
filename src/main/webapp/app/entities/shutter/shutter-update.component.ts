import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IShutter, Shutter } from 'app/shared/model/shutter.model';
import { ShutterService } from './shutter.service';
import { IFloor } from '../../shared/model/floor.model';
import { FloorService } from '../floor/floor.service';
import { IBlock } from '../../shared/model/block.model';
import { BlockService } from '../block/block.service';

@Component({
  selector: 'jhi-shutter-update',
  templateUrl: './shutter-update.component.html',
  styleUrls: ['shutter.scss'],
})
export class ShutterUpdateComponent implements OnInit {
  isSaving = false;
  floor: IFloor[] = [];
  shutterCode?: IShutter | null;
  blocks?: IBlock[] = [];
  editForm = this.fb.group({
    id: [],
    shutterNo: [null, [Validators.required]],
    itemCode: [null, [Validators.required]],
    area: [],
    rate: [],
    floorId: [null, [Validators.required]],
    floorN: [],
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedById: [],
    updatedBy: [],
    updatedById: [],
    status: [],
    blockId: [],
    blockName: [],
  });

  constructor(
    protected shutterService: ShutterService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private floorService: FloorService,
    private blockService: BlockService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shutter }) => {
      if (!shutter.id) {
        const today = moment().startOf('day');
        shutter.createdDate = today;
        shutter.updatedDate = today;
        this.shutterService.getLatestCode().subscribe((res: HttpResponse<IShutter>) => {
          this.shutterCode = res.body || null;
          if (this.shutterCode) {
            this.editForm.get(['itemCode'])!.setValue(this.shutterCode.itemCode);
          }
        });

        // this.shutterService.getLatestShutterNumber().subscribe((res: HttpResponse<IShutter>) => {
        //   this.shutterCode = res.body || null;
        //   if (this.shutterCode) {
        //     this.editForm.get(['shutterNo'])!.setValue(this.shutterCode.shutterNo);
        //   }
        // });
      }

      this.floorService.query().subscribe((resp: HttpResponse<IFloor[]>) => {
        this.floor = resp.body || [];
      });
      this.updateForm(shutter);
      this.blockService.query().subscribe((res: HttpResponse<IFloor[]>) => (this.blocks = res.body || []));
    });
  }

  updateForm(shutter: IShutter): void {
    this.editForm.patchValue({
      id: shutter.id,
      shutterNo: shutter.shutterNo,
      itemCode: shutter.itemCode,
      area: shutter.area,
      rate: shutter.rate,
      floorId: shutter.floorId,
      floorN: shutter.floorN,
      createdDate: shutter.createdDate ? shutter.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: shutter.updatedDate ? shutter.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: shutter.deleted,
      insertedBy: shutter.insertedBy,
      insertedById: shutter.insertedById,
      updatedBy: shutter.updatedBy,
      updatedById: shutter.updatedById,
      status: shutter.status,
      blockId: shutter.blockId,
      blockName: shutter.blockName,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shutter = this.createFromForm();
    if (shutter.id !== undefined) {
      this.subscribeToSaveResponse(this.shutterService.update(shutter));
    } else {
      this.subscribeToSaveResponse(this.shutterService.create(shutter));
    }
  }

  private createFromForm(): IShutter {
    return {
      ...new Shutter(),
      id: this.editForm.get(['id'])!.value,
      shutterNo: this.editForm.get(['shutterNo'])!.value,
      itemCode: this.editForm.get(['itemCode'])!.value,
      area: this.editForm.get(['area'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      floorId: this.editForm.get(['floorId'])!.value,
      floorN: this.editForm.get(['floorN'])!.value,
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
      blockId: this.editForm.get(['blockId'])!.value,
      blockName: this.editForm.get(['blockName'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShutter>>): void {
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

  trackById(index: number, item: IFloor | IBlock): any {
    return item.id;
  }
}
