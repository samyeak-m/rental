import { Moment } from 'moment';

export interface IServiceCharge {
  id?: number;
  code?: string;
  name?: string;
  rate?: number;
  remark?: string;
  businessTypeId?: number;
  businessTypeN?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
}

export class ServiceCharge implements IServiceCharge {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public rate?: number,
    public remark?: string,
    public businessTypeId?: number,
    public businessTypeN?: string,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedById?: number,
    public updatedBy?: string,
    public updatedById?: number,
    public status?: boolean
  ) {
    this.deleted = this.deleted || false;
    this.status = this.status || false;
  }
}
