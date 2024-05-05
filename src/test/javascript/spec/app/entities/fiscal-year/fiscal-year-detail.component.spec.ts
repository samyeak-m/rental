import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RentalUiTestModule } from '../../../test.module';
import { FiscalYearDetailComponent } from 'app/entities/fiscal-year/fiscal-year-detail.component';
import { FiscalYear } from 'app/shared/model/fiscal-year.model';

describe('Component Tests', () => {
  describe('FiscalYear Management Detail Component', () => {
    let comp: FiscalYearDetailComponent;
    let fixture: ComponentFixture<FiscalYearDetailComponent>;
    const route = ({ data: of({ fiscalYear: new FiscalYear(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [FiscalYearDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(FiscalYearDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FiscalYearDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fiscalYear on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fiscalYear).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
