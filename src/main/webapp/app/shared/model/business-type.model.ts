import { Moment } from 'moment';
import { IDiscountPolicy } from './discount-policy.model';

export interface IBusinessType {
  id?: number;
  typeCode?: string;
  typeName?: string;
  remarks?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
  discountPolicies?: IDiscountPolicy[];
}

export class BusinessType implements IBusinessType {
  constructor(
    public id?: number,
    public typeCode?: string,
    public typeName?: string,
    public remarks?: string,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedById?: number,
    public updatedBy?: string,
    public updatedById?: number,
    public status?: boolean,
    public discountPolicies?: IDiscountPolicy[]
  ) {
    this.deleted = this.deleted || false;
    this.status = this.status || false;
  }
}
