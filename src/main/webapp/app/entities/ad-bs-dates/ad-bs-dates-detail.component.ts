import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdBsDates } from 'app/shared/model/ad-bs-dates.model';

@Component({
  selector: 'jhi-ad-bs-dates-detail',
  templateUrl: './ad-bs-dates-detail.component.html',
  styleUrls: ['ad-bs-detail.scss'],
})
export class AdBsDatesDetailComponent implements OnInit {
  adBsDates: IAdBsDates | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adBsDates }) => (this.adBsDates = adBsDates));
  }

  previousState(): void {
    window.history.back();
  }
}
