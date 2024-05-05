import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IOrganization, Organization } from 'app/shared/model/organization.model';
import { OrganizationService } from './organization.service';
import { IImages, Images } from '../../shared/model/images.model';

@Component({
  selector: 'jhi-organization-update',
  templateUrl: './organization-update.component.html',
  styleUrls: ['organization.scss'],
})
export class OrganizationUpdateComponent implements OnInit {
  isSaving = false;
  base64textString?: string = '';
  imagesDTO: IImages = new Images();

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    address: [null, [Validators.required]],
    telephoneNo: [],
    faxNo: [],
    email: [null, [Validators.required]],
    contactPerson: [],
    filePath: [],
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedById: [],
    updatedBy: [],
    updatedById: [],
    status: [],
  });

  constructor(protected organizationService: OrganizationService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organization }) => {
      if (!organization.id) {
        const today = moment().startOf('day');
        organization.createdDate = today;
        organization.updatedDate = today;
      }

      this.updateForm(organization);
    });
  }

  updateForm(organization: IOrganization): void {
    this.editForm.patchValue({
      id: organization.id,
      name: organization.name,
      address: organization.address,
      telephoneNo: organization.telephoneNo,
      faxNo: organization.faxNo,
      email: organization.email,
      contactPerson: organization.contactPerson,
      filePath: organization.filePath,
      createdDate: organization.createdDate ? organization.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: organization.updatedDate ? organization.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: organization.deleted,
      insertedBy: organization.insertedBy,
      insertedById: organization.insertedById,
      updatedBy: organization.updatedBy,
      updatedById: organization.updatedById,
      status: organization.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organization = this.createFromForm();
    if (this.imagesDTO) {
      organization.imagesDto = this.imagesDTO;
    }

    if (organization.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationService.update(organization));
    } else {
      this.subscribeToSaveResponse(this.organizationService.create(organization));
    }
  }

  private createFromForm(): IOrganization {
    return {
      ...new Organization(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      address: this.editForm.get(['address'])!.value,
      telephoneNo: this.editForm.get(['telephoneNo'])!.value,
      faxNo: this.editForm.get(['faxNo'])!.value,
      email: this.editForm.get(['email'])!.value,
      contactPerson: this.editForm.get(['contactPerson'])!.value,
      filePath: this.editForm.get(['filePath'])!.value,
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganization>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  handleFileSelect1(evt: any): void {
    const file1 = evt.target.files[0];
    this.imagesDTO.name = file1.name;
    this.imagesDTO.extension = file1.type;
    if (file1) {
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded1.bind(this);
      reader.readAsBinaryString(file1);
    }
  }

  _handleReaderLoaded1(readerEvt: any): void {
    const binaryString1 = readerEvt.target.result;
    this.base64textString = btoa(binaryString1);
    this.imagesDTO.content = this.base64textString;
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
