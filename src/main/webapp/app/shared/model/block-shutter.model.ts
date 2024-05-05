import { ICustomerShutter } from './customer-shutter.model';
import { IShutterElectricity } from './shutter-electricity.model';

export interface IBlockShutter {
  blockNo?: string;
  customerShutterDTOS?: ICustomerShutter[];
  shutterElectricityDtos?: IShutterElectricity[];
}

export class BlockShutter implements IBlockShutter {
  constructor(blockNo?: string, customerShutterDTOS?: ICustomerShutter[], shutterElectricityDtos?: IShutterElectricity[]) {}
}
