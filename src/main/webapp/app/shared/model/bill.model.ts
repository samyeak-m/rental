import { Moment } from 'moment';
import { IAddParticulars } from './add-particulars.model';

export interface IBill {
  id?: number;
  createdDate?: Moment;
  updatedDate?: Moment;
  totalArea?: number;
  monthlyRent?: number;
  latestMonth?: string;
  latestFiscalYear?: string;
  electricityDeduct?: number;
  serviceChargeDeduct?: number;
  waterDeduct?: number;
  monthlyRate?: number;
  deleted?: boolean;
  status?: boolean;
  orderDate?: Moment;
  paymentDateAd?: Moment;
  paymentDate?: string;
  billIncomplete?: boolean;
  serviceChargeRate?: number;
  serviceChargeAmount?: number;
  electricityMeterNumber?: string;
  customerNo?: string;
  waterRate?: number;
  waterAmount?: number;
  taxableAmount?: number;
  addedAmount?: number;
  waterFromUnit?: string;
  waterFillUnit?: string;
  electricityRate?: number;
  electricityFromUnit?: string;
  electricityToUnit?: string;
  totalElectricityUnit?: number;
  electricityAmount?: number;
  addParticularTotalAmount?: number;
  monthlyDeduct?: number;
  discountAmount?: number;
  fineAmount?: number;
  insertedById?: number;
  insertedBy?: string;
  updatedById?: number;

  updatedBy?: string;
  electricityDiscountAmount?: number;
  electricityFineAmount?: number;
  tds?: number;
  tdsDeduct?: number;
  totalAmountWithVat?: number;
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  sumOfBill?: number;
  month?: string;
  paymentStatus?: string;
  customerId?: number;
  customerN?: string;
  temporaryAddress?: string;
  vatNumber?: string;
  filePath?: string;
  totalVat?: number;
  fiscalYearId?: number;
  fiscalYearN?: string;
  finalAmount?: number;
  amountInWords?: number;
  cashReceiptId?: number;
  billAdjust?: number;
  addParticulars?: IAddParticulars[];
  rentOpeningBalance?: number;
  electricityOpeningBalance?: number;
  serviceOpeningBalance?: number;
}

export class Bill implements IBill {
  constructor(
    public id?: number,
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public totalArea?: number,
    public tdsDeduct?: number,
    public monthlyRate?: number,
    public monthlyRent?: number,
    public serviceChargeRate?: number,
    public serviceChargeAmount?: number,
    public waterRate?: number,
    public waterAmount?: number,
    public waterFromUnit?: string,
    public waterFillUnit?: string,
    public electricityRate?: number,
    public electricityFromUnit?: string,
    public electricityToUnit?: string,
    public discountAmount?: number,
    public fineAmount?: number,
    public month?: string,
    public paymentStatus?: string,
    public customerId?: number,
    public customerN?: string,
    public fiscalYearId?: number,
    public taxAmount?: number,
    public orderDate?: Moment,
    public fiscalYearN?: string,
    public deleted?: boolean,
    public status?: boolean,
    public billAdjust?: number,
    public sumOfBill?: number,
    public rentOpeningBalance?: number,
    public electricityOpeningBalance?: number,
    public serviceOpeningBalance?: number
  ) {}
}
