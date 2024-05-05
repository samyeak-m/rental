import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RentalUiTestModule } from '../../../test.module';
import { CashReceiptDetailComponent } from 'app/entities/cash-receipt/cash-receipt-detail.component';
import { CashReceipt } from 'app/shared/model/cash-receipt.model';

describe('Component Tests', () => {
  describe('CashReceipt Management Detail Component', () => {
    let comp: CashReceiptDetailComponent;
    let fixture: ComponentFixture<CashReceiptDetailComponent>;
    const route = ({ data: of({ cashReceipt: new CashReceipt(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [CashReceiptDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(CashReceiptDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CashReceiptDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load cashReceipt on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cashReceipt).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
