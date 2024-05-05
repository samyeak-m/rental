import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILedger } from 'app/shared/model/ledger.model';

@Component({
  selector: 'jhi-ledger-detail',
  templateUrl: './ledger-detail.component.html',
  styleUrls: ['ledger-detail.scss'],
})
export class LedgerDetailComponent implements OnInit {
  ledger: ILedger | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ledger }) => (this.ledger = ledger));
  }

  previousState(): void {
    window.history.back();
  }
}
