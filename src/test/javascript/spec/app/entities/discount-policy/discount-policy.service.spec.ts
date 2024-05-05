import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DiscountPolicyService } from 'app/entities/discount-policy/discount-policy.service';
import { IDiscountPolicy, DiscountPolicy } from 'app/shared/model/discount-policy.model';

describe('Service Tests', () => {
  describe('DiscountPolicy Service', () => {
    let injector: TestBed;
    let service: DiscountPolicyService;
    let httpMock: HttpTestingController;
    let elemDefault: IDiscountPolicy;
    let expectedResult: IDiscountPolicy | IDiscountPolicy[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(DiscountPolicyService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new DiscountPolicy(0, 0, 0, 0, 0, 0, 0, 0, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a DiscountPolicy', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new DiscountPolicy()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a DiscountPolicy', () => {
        const returnedFromService = Object.assign(
          {
            firstDiscountTime: 1,
            firstDiscountRate: 1,
            secondDiscountTime: 1,
            secondDiscountRate: 1,
            firstFineTime: 1,
            firstFineRate: 1,
            secondFineTime: 1,
            secondFineRate: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of DiscountPolicy', () => {
        const returnedFromService = Object.assign(
          {
            firstDiscountTime: 1,
            firstDiscountRate: 1,
            secondDiscountTime: 1,
            secondDiscountRate: 1,
            firstFineTime: 1,
            firstFineRate: 1,
            secondFineTime: 1,
            secondFineRate: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a DiscountPolicy', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
