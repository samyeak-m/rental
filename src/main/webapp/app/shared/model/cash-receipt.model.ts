import { IBill } from './bill.model';
import { ICustomer } from './customer.model';
import { Moment } from 'moment';

export interface ICashReceipt {
  id?: number;
  amount?: number;
  bills?: IBill[];
  receiptType?: string;
  customer?: ICustomer;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
}

export class CashReceipt implements ICashReceipt {
  constructor(
    public id?: number,
    public amount?: number,
    public receiptType?: string,
    public bills?: IBill[],
    public customer?: ICustomer
  ) {}
}
