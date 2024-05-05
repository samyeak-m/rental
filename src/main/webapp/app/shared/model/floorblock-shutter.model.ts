import { IBlockShutter } from './block-shutter.model';
import { IBill } from './bill.model';
import { ICustomerRegistration } from './customer-registration.model';

export interface IFloorBlockShutter {
  floorNo?: string;
  latestMonth?: string;
  latestFiscalYear?: string;
  blockShutterDto?: IBlockShutter;
  customerRegistrationDTOS?: ICustomerRegistration[];
  billDTOList?: IBill[];
  totalElectricityUnit?: number;
  totalElectricityAmount?: number;
}

export class FloorBlockShutter implements IFloorBlockShutter {
  constructor(public floorNo?: string, public blockShutterDto?: IBlockShutter, billDTOList?: IBill[]) {}
}
