import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShutter } from 'app/shared/model/shutter.model';

@Component({
  selector: 'jhi-shutter-detail',
  templateUrl: './shutter-detail.component.html',
  styleUrls: ['shutter-detail.scss'],
})
export class ShutterDetailComponent implements OnInit {
  shutter: IShutter | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shutter }) => (this.shutter = shutter));
  }

  previousState(): void {
    window.history.back();
  }
}
