import { Moment } from 'moment';

export interface ICountry {
  id?: number;
  name?: string;
  code?: string;
  nationality?: string;
  description?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
}

export class Country implements ICountry {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public nationality?: string,
    public description?: string,
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
