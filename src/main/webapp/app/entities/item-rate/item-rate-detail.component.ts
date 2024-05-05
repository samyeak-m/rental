import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemRate } from 'app/shared/model/item-rate.model';

@Component({
  selector: 'jhi-item-rate-detail',
  templateUrl: './item-rate-detail.component.html',
  styleUrls: ['item-rate-detail.scss'],
})
export class ItemRateDetailComponent implements OnInit {
  itemRate: IItemRate | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemRate }) => (this.itemRate = itemRate));
  }

  previousState(): void {
    window.history.back();
  }
}
