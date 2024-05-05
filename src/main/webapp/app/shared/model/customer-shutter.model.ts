import { Moment } from 'moment';

export interface ICustomerShutter {
  id?: number;
  effectiveDateFrom?: string;
  effectiveDateTo?: string;
  customerId?: number;
  customerN?: string;
  shutterId?: number;
  shutterN?: string;
  customerRegistrationId?: number;
  customerRegistrationN?: string;
  electricityMeterNumber?: string;
  electricityRate?: number;
  customerShutterName?: string;
  electricityFromUnit?: string;
  electricityToUnit?: string;
  totalElectricityUnit?: string;
  electricityAmount?: number;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
}

export class CustomerShutter implements ICustomerShutter {
  constructor(
    public id?: number,
    public effectiveDateFrom?: string,
    public effectiveDateTo?: string,
    public customerId?: number,
    public customerN?: string,
    public shutterId?: number,
    public shutterN?: string,
    public customerRegistrationId?: number,
    public customerRegistrationN?: string,
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
