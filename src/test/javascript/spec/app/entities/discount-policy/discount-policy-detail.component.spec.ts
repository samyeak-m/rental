import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RentalUiTestModule } from '../../../test.module';
import { DiscountPolicyDetailComponent } from 'app/entities/discount-policy/discount-policy-detail.component';
import { DiscountPolicy } from 'app/shared/model/discount-policy.model';

describe('Component Tests', () => {
  describe('DiscountPolicy Management Detail Component', () => {
    let comp: DiscountPolicyDetailComponent;
    let fixture: ComponentFixture<DiscountPolicyDetailComponent>;
    const route = ({ data: of({ discountPolicy: new DiscountPolicy(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [DiscountPolicyDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(DiscountPolicyDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DiscountPolicyDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load discountPolicy on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.discountPolicy).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
