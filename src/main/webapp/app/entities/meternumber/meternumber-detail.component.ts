import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMeternumber } from 'app/shared/model/meternumber.model';

@Component({
  selector: 'jhi-meternumber-detail',
  templateUrl: './meternumber-detail.component.html',
})
export class MeternumberDetailComponent implements OnInit {
  meternumber: IMeternumber | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meternumber }) => (this.meternumber = meternumber));
  }

  previousState(): void {
    window.history.back();
  }
}
