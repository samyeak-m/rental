import { Moment } from 'moment';

export interface IItem {
  id?: number;
  createdDate?: Moment;
  updatedDate?: Moment;
  name?: string;
  code?: string;
  remarks?: string;
  // businessType?: IBusinessType;
  perUnit?: string;
  unit?: string;
  rateType?: string;
  rate?: number;
}

export class Item implements IItem {
  constructor(
    public id?: number,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public name?: string,
    public code?: string,
    public unit?: string,
    public remarks?: string,
    // public businessType?: IBusinessType,
    public businessTypeId?: number,
    public businessTypeN?: string,
    public perUnit?: string,
    public rateType?: string,
    public rate?: number
  ) {}
}
