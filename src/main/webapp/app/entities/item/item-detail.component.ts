import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItem } from 'app/shared/model/item.model';

@Component({
  selector: 'jhi-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['item-detail.scss'],
})
export class ItemDetailComponent implements OnInit {
  item: IItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ item }) => (this.item = item));
  }

  previousState(): void {
    window.history.back();
  }
}
