import { Moment } from 'moment';

export interface IFiscalYear {
  id?: number;
  fiscalYearFrom?: string;
  fiscalYearTill?: string;
  fiscalAdStart?: Moment;
  fiscalAdEnd?: Moment;
  fiscalBsStart?: string;
  fiscalBsEnd?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedByID?: number;
  updatedBy?: string;
  updatedByID?: number;
  status?: boolean;
  canGenerate?: boolean;
}

export class FiscalYear implements IFiscalYear {
  constructor(
    public id?: number,
    public fiscalYearFrom?: string,
    public fiscalYearTill?: string,
    public fiscalAdStart?: Moment,
    public fiscalAdEnd?: Moment,
    public fiscalBsStart?: string,
    public fiscalBsEnd?: string,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedByID?: number,
    public updatedBy?: string,
    public updatedByID?: number,
    public status?: boolean,
    public canGenerate?: boolean
) {
    this.deleted = this.deleted || false;
    this.status = this.status || false;
  }
}
