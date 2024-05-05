export interface ICustomShutterElectricityBill {
  month?: string;
  fiscalYearId?: string;
  shutterElectricityBill?: ICustomShutterElectricityBill[];
}

export class CustomShutterElectricityBill implements ICustomShutterElectricityBill {
  constructor(public month?: string, public shutterElectricityBill?: ICustomShutterElectricityBill[]) {}
}
