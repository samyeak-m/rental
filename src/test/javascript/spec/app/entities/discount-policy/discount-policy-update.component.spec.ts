import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { RentalUiTestModule } from '../../../test.module';
import { DiscountPolicyUpdateComponent } from 'app/entities/discount-policy/discount-policy-update.component';
import { DiscountPolicyService } from 'app/entities/discount-policy/discount-policy.service';
import { DiscountPolicy } from 'app/shared/model/discount-policy.model';

describe('Component Tests', () => {
  describe('DiscountPolicy Management Update Component', () => {
    let comp: DiscountPolicyUpdateComponent;
    let fixture: ComponentFixture<DiscountPolicyUpdateComponent>;
    let service: DiscountPolicyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [DiscountPolicyUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(DiscountPolicyUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DiscountPolicyUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DiscountPolicyService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new DiscountPolicy(123);
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
        const entity = new DiscountPolicy();
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
