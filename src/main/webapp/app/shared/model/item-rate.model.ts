import { Moment } from 'moment';

export interface IItemRate {
  id?: number;
  rateType?: string;
  unit?: string;
  rate?: number;
  remarks?: string;
  itemId?: number;
  itemN?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
  perUnit?: string;
}

export class ItemRate implements IItemRate {
  constructor(
    public id?: number,
    public rateType?: string,
    public unit?: string,
    public rate?: number,
    public remarks?: string,
    public itemId?: number,
    public itemN?: string,
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
