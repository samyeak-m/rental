import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiscountPolicy } from 'app/shared/model/discount-policy.model';

@Component({
  selector: 'jhi-discount-policy-detail',
  templateUrl: './discount-policy-detail.component.html',
  styleUrls: ['discount-policydetail.scss'],
})
export class DiscountPolicyDetailComponent implements OnInit {
  discountPolicy: IDiscountPolicy | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discountPolicy }) => (this.discountPolicy = discountPolicy));
  }

  previousState(): void {
    window.history.back();
  }
}
