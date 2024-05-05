import { Moment } from 'moment';
import { ICustomerShutter } from './customer-shutter.model';
import { IDiscountPolicy } from './discount-policy.model';
import { IIncrementpolicy } from './incrementpolicy.model';

export interface ICustomerRegistration {
  id?: number;
  applicationNumber?: string;
  registrationNumber?: string;
  applicationDate?: string;
  registrationDate?: string;
  totalArea?: number;
  monthlyRate?: number;
  customerType?: string;
  shopName?: string;
  electricityTypeId?: number;
  electricityTypeName?: string;
  meterType?: string;
  electricityRate?: number;
  businessTypeId?: number;
  businessTypeName?: string;
  serviceChargeId?: number;
  serviceChargeName?: string;
  serviceChargeRate?: number;
  advanceAmount?: number;
  depositAmount?: number;
  paymentType?: string;
  electricityMeterType?: string;
  advancementTillDate?: Moment;
  currentUnit?: string;
  rate?: number;
  monthlyRent?: number;
  electricityMeterNumber?: string;
  approve?: boolean;
  itemMeterNumber?: string;
  bankNumber?: string;
  chequeNumber?: string;
  itemId?: number;
  itemRateName?: string;
  itemRateType?: string;
  itemRate?: number;
  enteredById?: number;
  enteredByLogin?: string;
  approvedById?: number;
  approvedByLogin?: string;
  customerId?: number;
  customerN?: string;
  customerNo?: string;
  electricityFromUnit?: string;
  electricityToUnit?: string;
  totalElectricityUnit?: string;
  electricityAmount?: number;
  enteredDate?: Moment;
  approvedDate?: Moment;
  customerShutters?: ICustomerShutter[];
  createdDate?: Moment;
  updatedDate?: Moment;
  deleted?: boolean;
  insertedBy?: string;
  insertedById?: number;
  updatedBy?: string;
  updatedById?: number;
  status?: boolean;
  discountPolicies?: IDiscountPolicy[];
  fiscalBsStart?: string;
  fiscalBsEnd?: string;
  incrementPolicyDTO?: IIncrementpolicy;
  floorId?: number;
  showShutter?: boolean;
  showElectricity?: boolean;
  showPolicy?: boolean;
  rentOpeningBalance?: number;
  electricityOpeningBalance?: number;
  serviceOpeningBalance?: number;
}

export class CustomerRegistration implements ICustomerRegistration {
  constructor(
    public id?: number,
    public applicationNumber?: string,
    public registrationNumber?: string,
    public applicationDate?: string,
    public registrationDate?: string,
    public totalArea?: number,
    public monthlyRate?: number,
    public customerType?: string,
    public shopName?: string,
    public electricityTypeId?: number,
    public electricityTypeName?: string,
    public electricityMeterType?: string,
    public meterType?: string,
    public advanceAmount?: number,
    public depositAmount?: number,
    public paymentType?: string,
    public advancementTillDate?: Moment,
    public currentUnit?: string,
    public rate?: number,
    public monthlyRent?: number,
    public electricityMeterNumber?: string,
    public itemMeterNumber?: string,
    public bankNumber?: string,
    public chequeNumber?: string,
    public itemId?: number,
    public itemN?: string,
    public enteredById?: number,
    public enteredByLogin?: string,
    public approvedById?: number,
    public approvedByLogin?: string,
    public customerId?: number,
    public customerN?: string,
    public enteredDate?: Moment,
    public approvedDate?: Moment,
    public customerShutters?: ICustomerShutter[],
    public discountPolicies?: IDiscountPolicy[],
    public createdDate?: Moment,
    public updatedDate?: Moment,
    public deleted?: boolean,
    public insertedBy?: string,
    public insertedById?: number,
    public updatedBy?: string,
    public updatedById?: number,
    public status?: boolean,
    public incrementPolicyDTO?: IIncrementpolicy,
    public floorId?: number,
    public showShutter?: boolean,
    public showElectricity?: boolean,
    public showPolicy?: boolean,
    public rentOpeningBalance?: number,
    public electricityOpeningBalance?: number,
    public serviceOpeningBalance?: number
  ) {
    this.deleted = this.deleted || false;
    this.status = this.status || false;
  }
}
