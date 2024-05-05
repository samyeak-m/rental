import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerShutter } from 'app/shared/model/customer-shutter.model';

@Component({
  selector: 'jhi-customer-shutter-detail',
  templateUrl: './customer-shutter-detail.component.html',
})
export class CustomerShutterDetailComponent implements OnInit {
  customerShutter: ICustomerShutter | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerShutter }) => (this.customerShutter = customerShutter));
  }

  previousState(): void {
    window.history.back();
  }
}
