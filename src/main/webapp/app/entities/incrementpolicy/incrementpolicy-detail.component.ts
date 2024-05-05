import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIncrementpolicy } from 'app/shared/model/incrementpolicy.model';

@Component({
  selector: 'jhi-incrementpolicy-detail',
  templateUrl: './incrementpolicy-detail.component.html',
  styleUrls: ['incrementpolicydetail.scss'],
})
export class IncrementpolicyDetailComponent implements OnInit {
  incrementpolicy: IIncrementpolicy | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ incrementpolicy }) => (this.incrementpolicy = incrementpolicy));
  }

  previousState(): void {
    window.history.back();
  }
}
