import { IShutter } from './shutter.model';

export interface IShutterElectricity {
  id?: number;
  shutterNo?: string;
  customerId?: number;
  customerName?: string;
  shutterDTO?: IShutter;
  month?: string;
  fromUnit?: string;
  fromUnitValue?: number;
  toUnit?: string;
  toUnitValue?: number;
  fiscalYearId?: number;
  totalUnit?: number;
  totalAmount?: number;
  rate?: number;
  meterNumber?: string;
  showButton?: boolean;
}

export class ShutterElectricity implements IShutterElectricity {
  constructor(
    public id?: number,
    public shutterNo?: string,
    public customerId?: number,
    public month?: string,
    public fromUnit?: string,
    public toUnit?: string,
    public fiscalYearId?: number,
    public totalUnit?: number,
    public totalAmount?: number,
    public showButton?: boolean
  ) {}
}
