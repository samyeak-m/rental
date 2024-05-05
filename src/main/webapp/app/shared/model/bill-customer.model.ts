import { IBill } from './bill.model';

export interface IBillCustomer {
  month?: string;
  bills?: IBill[] | any;
  sumOfBillAmount?: number;
  sumOfMonthlyRate?: number;
  amountInWords?: string;
  electricityDeduct?: number;
  waterDeduct?: number;
  serviceChargeDeduct?: number;
  monthlyDeduct?: number;
  sumOfPaidAmount?: number;
  tdsDeduct?: number;
}

export class BillCustomer implements IBillCustomer {
  constructor(bills?: IBill | any) {}
}
