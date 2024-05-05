import { Moment } from 'moment';
import { IImages } from './images.model';

export interface IOrganization {
  id?: number;
  name?: string;
  address?: string;
  telephoneNo?: string;
  faxNo?: string;
  email?: string;
  filePath?: string;
  contactPerson?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
  imagesDto?: IImages;
}

export class Organization implements IOrganization {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string,
    public telephoneNo?: string,
    public faxNo?: string,
    public email?: string,
    public contactPerson?: string,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedById?: number,
    public updatedBy?: string,
    public updatedById?: number,
    public status?: boolean,
    public filePath?: string,
    public imagesDto?: IImages
  ) {
    this.deleted = this.deleted || false;
    this.status = this.status || false;
  }
}
