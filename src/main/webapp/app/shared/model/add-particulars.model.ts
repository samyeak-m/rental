import { IBill } from './bill.model';

export interface IAddParticulars {
  remarks?: string;
  discountType?: string;
  amount?: number;
  amountType?: string;
}

export class AddParticulars implements IAddParticulars {
  constructor(public remarks?: string, public discountType?: string, public amount?: number) {}
}
