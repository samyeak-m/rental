import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomerRegistration, ICustomerRegistration } from 'app/shared/model/customer-registration.model';

@Component({
  selector: 'jhi-customer-registration-detail',
  templateUrl: './customer-registration-detail.component.html',
  styleUrls: ['customer-registration-detail.scss'],
})
export class CustomerRegistrationDetailComponent implements OnInit {
  customerRegistration: ICustomerRegistration | any = new CustomerRegistration();

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerRegistration }) => {
      this.customerRegistration = customerRegistration;
      if (this.customerRegistration.incrementPolicyDTO.incrementType === 'PERCENTAGE') {
        this.customerRegistration.incrementPolicyDTO.amount =
          (this.customerRegistration.incrementPolicyDTO.amount / 100) * this.customerRegistration.monthlyRent;
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
}
