import { Moment } from 'moment';
import { IFiscalYear } from 'app/shared/model/fiscal-year.model';
import { IRelateMonth } from './relate-month.model';

export interface IAdBsDates {
  id?: number;
  adDate?: Moment;
  bsDate?: string;
  day?: string;
  holiday?: boolean;
  month?: string;
  fiscalYearId?: number;
  fiscalYearN?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedByID?: number;
  updatedBy?: string;
  updatedByID?: number;
  status?: boolean;
  totalDays?: number;
  relateMonths?: IRelateMonth[];
  lastBS?: string;
  lastAD?: Moment;
  fiscalYear?: IFiscalYear;
  fiscalBsStart?:string;
  fiscalBsEnd?:string;
  canGen?:boolean;
}

export class AdBsDates implements IAdBsDates {
  constructor(
    public id?: number,
    public adDate?: Moment,
    public bsDate?: string,
    public day?: string,
    public holiday?: boolean,
    public month?: string,
    public fiscalYearId?: number,
    public fiscalYearN?: string,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedByID?: number,
    public updatedBy?: string,
    public updatedByID?: number,
    public status?: boolean,
    public totalDays?: number,
    public lastBS?: string,
    public lastAD?: Moment,
    public fiscalYear?: IFiscalYear,
    public canGen?:boolean
  ) {
    this.holiday = this.holiday || false;
    this.deleted = this.deleted || false;
    this.status = this.status || false;
    this.canGen=this.canGen || false;
  }
}
