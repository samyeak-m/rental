import { ICustomer } from 'app/shared/model/customer.model';

export interface INotice {
  id?: number;
  message?: string;
  readStatus?: string;
  customerId?:number;
  customerN?:string;
}

export class Notice implements INotice {
  constructor(public id?: number, public message?: string, public readStatus?: string, public customerId?:number,
  public customerN?:string) {}
}
