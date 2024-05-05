import { Moment } from 'moment';

export interface IElectricityType {
  id?: number;
  typeCode?: string;
  typeName?: string;
  rate?: number;
  remarks?: string;
  businessTypeId?: number;
  businessTypeN?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
}

export class ElectricityType implements IElectricityType {
  constructor(
    public id?: number,
    public typeCode?: string,
    public typeName?: string,
    public rate?: number,
    public remarks?: string,
    public businessTypeId?: number,
    public businessTypeN?: string,
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
