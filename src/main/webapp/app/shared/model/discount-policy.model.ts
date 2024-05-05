import { IBusinessType } from './business-type.model';
import { Moment } from 'moment';

export interface IDiscountPolicy {
  id?: number;
  name?: string;
  numberOfDays?: number;
  discount?: number;
  discountType?: string;
  policyType?: string;
  businessType?: IBusinessType[];
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
}

export class DiscountPolicy implements IDiscountPolicy {
  constructor(
    public id?: number,
    public name?: string,
    public numberOfDays?: number,
    public discount?: number,
    public discountType?: string,
    public policyType?: string,
    public businessType?: IBusinessType[],
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
