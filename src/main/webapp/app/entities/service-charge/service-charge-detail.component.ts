import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IServiceCharge } from 'app/shared/model/service-charge.model';

@Component({
  selector: 'jhi-service-charge-detail',
  templateUrl: './service-charge-detail.component.html',
  styleUrls: ['service-charge-detail.scss'],
})
export class ServiceChargeDetailComponent implements OnInit {
  serviceCharge: IServiceCharge | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceCharge }) => (this.serviceCharge = serviceCharge));
  }

  previousState(): void {
    window.history.back();
  }
}
