import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { RentalUiTestModule } from '../../../test.module';
import { CashReceiptUpdateComponent } from 'app/entities/cash-receipt/cash-receipt-update.component';
import { CashReceiptService } from 'app/entities/cash-receipt/cash-receipt.service';
import { CashReceipt } from 'app/shared/model/cash-receipt.model';

describe('Component Tests', () => {
  describe('CashReceipt Management Update Component', () => {
    let comp: CashReceiptUpdateComponent;
    let fixture: ComponentFixture<CashReceiptUpdateComponent>;
    let service: CashReceiptService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [CashReceiptUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(CashReceiptUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CashReceiptUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CashReceiptService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CashReceipt(123);
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
        const entity = new CashReceipt();
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
