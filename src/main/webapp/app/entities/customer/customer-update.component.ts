import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ICustomer, Customer } from 'app/shared/model/customer.model';
import { CustomerService } from './customer.service';
import { IImages, Images } from '../../shared/model/images.model';

@Component({
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['customer.scss'],
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;
  customerCode?: ICustomer | null;
  base64textString?: string = '';
  imagesDTO: IImages = new Images();

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
    type: [null, [Validators.required]],
    permanentAddress: [null, [Validators.required]],
    temporaryAddress: [null, [Validators.required]],
    residentPhoneNumber: [null, [Validators.required]],
    mobileNumber: [null, [Validators.required]],
    faxNumber: [],
    vatNumber: [],
    panNumber: [],
    imgFile: [],
    documentFile: [],
    vatFile: [],
    officePhoneNumber: [],
    filePath: [],
    imagesDTO: [],
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedById: [],
    updatedBy: [],
    updatedById: [],
    status: [],
    amount: [],
    rentOpeningBalance: [],
    electricityOpeningBalance: [],
    serviceOpeningBalance: [],
  });

  constructor(protected customerService: CustomerService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      if (!customer.id) {
        const today = moment().startOf('day');
        customer.createdDate = today;
        customer.updatedDate = today;
        this.customerService.getLatestCode().subscribe((res: HttpResponse<ICustomer>) => {
          this.customerCode = res.body || null;
          if (this.customerCode) {
            this.editForm.get(['code'])!.setValue(this.customerCode.code);
          }
        });
      }

      this.updateForm(customer);
    });
  }

  updateForm(customer: ICustomer): void {
    this.editForm.patchValue({
      id: customer.id,
      code: customer.code,
      name: customer.name,
      type: customer.type,
      permanentAddress: customer.permanentAddress,
      temporaryAddress: customer.temporaryAddress,
      residentPhoneNumber: customer.residentPhoneNumber,
      mobileNumber: customer.mobileNumber,
      faxNumber: customer.faxNumber,
      vatNumber: customer.vatNumber,
      panNumber: customer.panNumber,
      imagesDto: customer.imagesDto,
      officePhoneNumber: customer.officePhoneNumber,
      filePath: customer.filePath,
      documentFile: customer.documentFile,
      createdDate: customer.createdDate ? customer.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: customer.updatedDate ? customer.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: customer.deleted,
      insertedBy: customer.insertedBy,
      insertedById: customer.insertedById,
      updatedBy: customer.updatedBy,
      updatedById: customer.updatedById,
      status: customer.status,
      amount: customer.amount,
      rentOpeningBalance: customer.rentOpeningBalance,
      electricityOpeningBalance: customer.electricityOpeningBalance,
      serviceOpeningBalance: customer.serviceOpeningBalance,
    });
  }

  handleFileSelect(evt: any): void {
    const file = evt.target.files[0];
    this.editForm.patchValue({
      imgFile: file,
    });
    this.editForm.get('imgFile')?.updateValueAndValidity();
  }

  handleDocumentFileSelect(evt: any): void {
    const file = evt.target.files[0];
    this.editForm.patchValue({
      documentFile: file,
    });
    this.editForm.get('documentFile')?.updateValueAndValidity();
  }

  handleVatFileSelect(evt: any): void {
    const file = evt.target.files[0];
    this.editForm.patchValue({
      vatFile: file,
    });
    this.editForm.get('vatFile')?.updateValueAndValidity();
  }

  _handleReaderLoaded(readerEvt: any): void {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.imagesDTO.content = this.base64textString;
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    if (this.editForm.get('id')!.value !== undefined) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  private createFromForm(): FormData {
    const formData: any = new FormData();
    formData.append('id', this.editForm.get('id')?.value);
    formData.append('code', this.editForm.get('code')?.value);
    formData.append('name', this.editForm.get('name')?.value);
    formData.append('type', this.editForm.get('type')?.value);
    formData.append('permanentAddress', this.editForm.get('permanentAddress')?.value);
    formData.append('temporaryAddress', this.editForm.get('temporaryAddress')?.value);
    formData.append('residentPhoneNumber', this.editForm.get('residentPhoneNumber')?.value);
    formData.append('mobileNumber', this.editForm.get('mobileNumber')?.value);
    formData.append('faxNumber', this.editForm.get('faxNumber')?.value);
    formData.append('officePhoneNumber', this.editForm.get('officePhoneNumber')?.value);
    formData.append('filePath', this.editForm.get('filePath')?.value);
    formData.append('documentFile', this.editForm.get('documentFile')?.value);
    formData.append('vatFile', this.editForm.get('vatFile')?.value);
    formData.append('imgFile', this.editForm.get('imgFile')?.value);
    formData.append('panNumber', this.editForm.get('panNumber')?.value);
    formData.append('vatNumber', this.editForm.get('vatNumber')?.value);
    formData.append('rentOpeningBalance', this.editForm.get('rentOpeningBalance')?.value);
    formData.append('electricityOpeningBalance', this.editForm.get('electricityOpeningBalance')?.value);
    formData.append('serviceOpeningBalance', this.editForm.get('serviceOpeningBalance')?.value);
    if (this.editForm.get('amount')?.value) {
      formData.append('amount', this.editForm.get('amount')?.value);
    }
    formData.append('imageName', this.imagesDTO.name);
    formData.append('extension', this.imagesDTO.extension);
    formData.append('content', this.imagesDTO.content);
    return formData;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>): void {
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
