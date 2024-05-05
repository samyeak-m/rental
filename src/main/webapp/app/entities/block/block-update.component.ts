import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IBlock, Block } from 'app/shared/model/block.model';
import { BlockService } from './block.service';

@Component({
  selector: 'jhi-block-update',
  templateUrl: './block-update.component.html',
})
export class BlockUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
  });

  constructor(protected blockService: BlockService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ block }) => {
      this.updateForm(block);
    });
  }

  updateForm(block: IBlock): void {
    this.editForm.patchValue({
      id: block.id,
      name: block.name,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const block = this.createFromForm();
    if (block.id !== undefined) {
      this.subscribeToSaveResponse(this.blockService.update(block));
    } else {
      this.subscribeToSaveResponse(this.blockService.create(block));
    }
  }

  private createFromForm(): IBlock {
    return {
      ...new Block(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlock>>): void {
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
