import { Moment } from 'moment';

export interface IShutter {
  id?: number;
  shutterNo?: string;
  itemCode?: string;
  area?: number;
  rate?: number;
  floorId?: number;
  floorN?: string;
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
  blockId?: number;
  blockName?: string;
}

export class Shutter implements IShutter {
  constructor(
    public id?: number,
    public shutterNo?: string,
    public itemCode?: string,
    public area?: number,
    public rate?: number,
    public floorId?: number,
    public floorN?: string,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedById?: number,
    public updatedBy?: string,
    public updatedById?: number,
    public status?: boolean,
    public blockId?: number,
    public blockName?: string
  ) {
    this.deleted = this.deleted || false;
    this.status = this.status || false;
  }
}
