export interface IMeternumber {
  id?: number;
  meterNumber?: string;
  floorId?: number;
  customerId?: number;
  blockId?: number;
}

export class Meternumber implements IMeternumber {
  constructor(
    public id?: number,
    public meterNumber?: string,
    public floorId?: number,
    public customerId?: number,
    public blockId?: number
  ) {}
}
