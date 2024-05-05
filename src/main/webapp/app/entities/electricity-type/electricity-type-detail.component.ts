import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IElectricityType } from 'app/shared/model/electricity-type.model';

@Component({
  selector: 'jhi-electricity-type-detail',
  templateUrl: './electricity-type-detail.component.html',
  styleUrls: ['electricity-type-detail.scss'],
})
export class ElectricityTypeDetailComponent implements OnInit {
  electricityType: IElectricityType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ electricityType }) => (this.electricityType = electricityType));
  }

  previousState(): void {
    window.history.back();
  }
}
