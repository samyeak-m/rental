import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { RentalUiTestModule } from '../../../test.module';
import { AdBsDatesUpdateComponent } from 'app/entities/ad-bs-dates/ad-bs-dates-update.component';
import { AdBsDatesService } from 'app/entities/ad-bs-dates/ad-bs-dates.service';
import { AdBsDates } from 'app/shared/model/ad-bs-dates.model';

describe('Component Tests', () => {
  describe('AdBsDates Management Update Component', () => {
    let comp: AdBsDatesUpdateComponent;
    let fixture: ComponentFixture<AdBsDatesUpdateComponent>;
    let service: AdBsDatesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [AdBsDatesUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(AdBsDatesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AdBsDatesUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AdBsDatesService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new AdBsDates(123);
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
        const entity = new AdBsDates();
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
