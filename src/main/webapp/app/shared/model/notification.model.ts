import { Moment } from 'moment';

export interface INotification {
  id?: number;
  message?: string;
  readStatus?: boolean;
  customerId?: number;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
  link?:string;
}

export class Notifications implements INotification {
  constructor(
    public id?: number,
    public message?: string,
    public readStatus?: boolean,
    public customerId?: number,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedById?: number,
    public updatedBy?: string,
    public updatedById?: number,
    public status?: boolean
  ) {
    this.readStatus = this.readStatus || false;
  }
}
