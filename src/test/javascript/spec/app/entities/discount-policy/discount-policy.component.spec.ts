import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { RentalUiTestModule } from '../../../test.module';
import { DiscountPolicyComponent } from 'app/entities/discount-policy/discount-policy.component';
import { DiscountPolicyService } from 'app/entities/discount-policy/discount-policy.service';
import { DiscountPolicy } from 'app/shared/model/discount-policy.model';

describe('Component Tests', () => {
  describe('DiscountPolicy Management Component', () => {
    let comp: DiscountPolicyComponent;
    let fixture: ComponentFixture<DiscountPolicyComponent>;
    let service: DiscountPolicyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RentalUiTestModule],
        declarations: [DiscountPolicyComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: of({
                defaultSort: 'id,asc',
              }),
              queryParamMap: of(
                convertToParamMap({
                  page: '1',
                  size: '1',
                  sort: 'id,desc',
                })
              ),
            },
          },
        ],
      })
        .overrideTemplate(DiscountPolicyComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DiscountPolicyComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DiscountPolicyService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new DiscountPolicy(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.discountPolicies && comp.discountPolicies[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new DiscountPolicy(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.discountPolicies && comp.discountPolicies[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should calculate the sort attribute for an id', () => {
      // WHEN
      comp.ngOnInit();
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['id,desc']);
    });

    it('should calculate the sort attribute for a non-id attribute', () => {
      // INIT
      comp.ngOnInit();

      // GIVEN
      comp.predicate = 'name';

      // WHEN
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['name,desc', 'id']);
    });
  });
});
