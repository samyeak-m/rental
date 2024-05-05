import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RentalUiTestModule } from '../../../test.module';
import { AdBsDatesDetailComponent } from 'app/entities/ad-bs-dates/ad-bs-dates-detail.component';
import { AdBsDates } from 'app/shared/model/ad-bs-dates.model';

describe('Component Tests', () => {
  describe('AdBsDates Management Detail Component', () => {
    let comp: AdBsDatesDetailComponent;
    let fixture: ComponentFixture<AdBsDatesDetailComponent>;
    const route = ({ data: of({ adBsDates: new AdBsDates(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [AdBsDatesDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(AdBsDatesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AdBsDatesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load adBsDates on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.adBsDates).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
