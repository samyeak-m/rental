import { Moment } from 'moment';

export interface IIncrementpolicy {
  id?: number;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  totalTime?: number;
  amount?: number;
  policyType?: string;
  incrementType?: string;
  additionalType?: string;
  increment?: boolean;
  customerRegistrationId?: number;
  customerName?: string;
  effectiveDateFrom?: string;
}

export class Incrementpolicy implements IIncrementpolicy {
  constructor(
    public id?: number,
    public totalTime?: number,
    public amount?: number,
    public policyType?: string,
    public incrementType?: string,
    public additionalType?: string,
    public increment?: boolean,
    public customerRegistrationId?: number,
    public customerName?: string,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedById?: number,
    public updatedBy?: string,
    public updatedById?: number,
    public effectiveDateFrom?: string
  ) {
    this.increment = this.increment || false;
  }
}
