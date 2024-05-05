import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusinessType } from 'app/shared/model/business-type.model';

@Component({
  selector: 'jhi-business-type-detail',
  templateUrl: './business-type-detail.component.html',
  styleUrls: ['business-type-detail.scss'],
})
export class BusinessTypeDetailComponent implements OnInit {
  businessType: IBusinessType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessType }) => (this.businessType = businessType));
  }

  previousState(): void {
    window.history.back();
  }
}
