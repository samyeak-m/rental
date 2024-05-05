import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { RentalUiTestModule } from '../../../test.module';
import { FiscalYearUpdateComponent } from 'app/entities/fiscal-year/fiscal-year-update.component';
import { FiscalYearService } from 'app/entities/fiscal-year/fiscal-year.service';
import { FiscalYear } from 'app/shared/model/fiscal-year.model';

describe('Component Tests', () => {
  describe('FiscalYear Management Update Component', () => {
    let comp: FiscalYearUpdateComponent;
    let fixture: ComponentFixture<FiscalYearUpdateComponent>;
    let service: FiscalYearService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [FiscalYearUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(FiscalYearUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FiscalYearUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FiscalYearService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new FiscalYear(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new FiscalYear();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
