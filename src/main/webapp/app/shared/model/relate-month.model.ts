import { Moment } from 'moment';

export interface IRelateMonth {
  id?: number;
  month?: string;
  totalDays?: number;
}

export class RelateMonth implements IRelateMonth {
  constructor(public createdDate?: Moment, public month?: string, public totalDays?: number) {}
}
