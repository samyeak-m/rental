import { ICustomerRegistration } from './customer-registration.model';

export interface ICustomerRegistrationBill {
  month?: string;
  fiscalYearId?: string;
  customerRegistrationDTOList?: ICustomerRegistration[];
}

export class CustomerRegistrationBill implements ICustomerRegistrationBill {
  constructor(public customerRegistrationDTOList?: ICustomerRegistration[]) {
    this.customerRegistrationDTOList = customerRegistrationDTOList;
  }
}
