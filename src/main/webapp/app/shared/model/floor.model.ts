import { Moment } from 'moment';
import { IBlock } from './block.model';

export interface IFloor {
  id?: number;
  code?: string;
  name?: string;
  remarks?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
}

export class Floor implements IFloor {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public remarks?: string,
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
