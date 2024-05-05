import { IFiscalYear } from 'app/shared/model/fiscal-year.model';
import { IBill } from 'app/shared/model/bill.model';
import { LedgerType } from 'app/shared/model/enumerations/ledger-type.model';
import { Moment } from 'moment';

export interface ILedger {
  id?: number;
  createdDate?: Moment;
  updatedDate?: Moment;
  remarks?: string;
  paidAmount?: number;
  amount?: number;
  month?: string;
  ledgerType?: LedgerType;
  billId?: number;
  customerName?: string;
  discountAmount?: number;
  fineAmount?: number;
  finalAmount?: number;
  fiscalYearId?: number;
  deleted?: boolean;
  status?: boolean;
  fiscalYearFrom?: string;
  fiscalYearTill?: string;
  openingBalance?: number;
  closingBalance?: number;
  isLedgerCreated?: boolean;
}

export class Ledger implements ILedger {
  constructor(
    public id?: number,
    createdDate?: Moment,
    updatedDate?: Moment,
    public remarks?: string,
    public paidAmount?: number,
    public amount?: number,
    public month?: string,
    public ledgerType?: LedgerType,
    public fiscalYear?: IFiscalYear,
    billId?: number,
    customerName?: string,
    discountAmount?: number,
    fineAmount?: number,
    finalAmount?: number,
    fiscalYearId?: number,
    deleted?: boolean,
    status?: boolean,
    fiscalYearFrom?: string,
    fiscalYearTill?: string,
    openingBalance?: number,
    closingBalance?: number
  ) {}
}
