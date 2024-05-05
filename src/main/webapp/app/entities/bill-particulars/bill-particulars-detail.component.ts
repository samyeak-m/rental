import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBillParticulars } from 'app/shared/model/bill-particulars.model';

@Component({
  selector: 'jhi-bill-particulars-detail',
  templateUrl: './bill-particulars-detail.component.html',
  styleUrls: ['bill-particulars-detail.scss'],
})
export class BillParticularsDetailComponent implements OnInit {
  billParticulars: IBillParticulars | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billParticulars }) => (this.billParticulars = billParticulars));
  }

  previousState(): void {
    window.history.back();
  }
}
