import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LedgerService } from 'app/entities/ledger/ledger.service';
import { ILedger, Ledger } from 'app/shared/model/ledger.model';
import { LedgerType } from 'app/shared/model/enumerations/ledger-type.model';

describe('Service Tests', () => {
  describe('Ledger Service', () => {
    let injector: TestBed;
    let service: LedgerService;
    let httpMock: HttpTestingController;
    let elemDefault: ILedger;
    let expectedResult: ILedger | ILedger[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(LedgerService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Ledger(0, 'AAAAAAA', 0, 0, 'AAAAAAA', LedgerType.PAID_AMOUNT);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Ledger', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Ledger()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Ledger', () => {
        const returnedFromService = Object.assign(
          {
            remarks: 'BBBBBB',
            paidAmount: 1,
            amount: 1,
            month: 'BBBBBB',
            ledgerType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Ledger', () => {
        const returnedFromService = Object.assign(
          {
            remarks: 'BBBBBB',
            paidAmount: 1,
            amount: 1,
            month: 'BBBBBB',
            ledgerType: 'BBBBBB',
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

      it('should delete a Ledger', () => {
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
