import { Moment } from 'moment';
import { IImages } from './images.model';

export interface ICustomer {
  id?: number;
  code?: string;
  name?: string;
  type?: string;
  permanentAddress?: string;
  citizenNumber?: string;
  temporaryAddress?: string;
  residentPhoneNumber?: string;
  mobileNumber?: string;
  faxNumber?: string;
  officePhoneNumber?: string;
  filePath?: string;
  documentFile?: [''];
  imgFile?: [''];
  vatFile?: [''];
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
  panNumber?: string;
  vatNumber?: string;
  imagesDto?: IImages;
  documentName?: string;
  vatFileName?: string;
  imageFile?: [''];
  amount?: number;
  rentOpeningBalance?: number;
  electricityOpeningBalance?: number;
  serviceOpeningBalance?: number;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public permanentAddress?: string,
    public temporaryAddress?: string,
    public residentPhoneNumber?: string,
    public mobileNumber?: string,
    public faxNumber?: string,
    public officePhoneNumber?: string,
    public filePath?: string,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedById?: number,
    public updatedBy?: string,
    public updatedById?: number,
    public status?: boolean,
    public imagesDto?: IImages,
    public amount?: number,
    public rentOpeningBalance?: number,
    public electricityOpeningBalance?: number,
    public serviceOpeningBalance?: number
  ) {
    this.deleted = this.deleted || false;
    this.status = this.status || false;
  }
}
