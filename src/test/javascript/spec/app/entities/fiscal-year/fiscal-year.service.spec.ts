import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { FiscalYearService } from 'app/entities/fiscal-year/fiscal-year.service';
import { IFiscalYear, FiscalYear } from 'app/shared/model/fiscal-year.model';

describe('Service Tests', () => {
  describe('FiscalYear Service', () => {
    let injector: TestBed;
    let service: FiscalYearService;
    let httpMock: HttpTestingController;
    let elemDefault: IFiscalYear;
    let expectedResult: IFiscalYear | IFiscalYear[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(FiscalYearService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new FiscalYear(
        0,
        'AAAAAAA',
        'AAAAAAA',
        currentDate,
        currentDate,
        'AAAAAAA',
        'AAAAAAA',
        currentDate,
        currentDate,
        false,
        'AAAAAAA',
        0,
        'AAAAAAA',
        0,
        false
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fiscalAdStart: currentDate.format(DATE_FORMAT),
            fiscalAdEnd: currentDate.format(DATE_FORMAT),
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            updatedDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a FiscalYear', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fiscalAdStart: currentDate.format(DATE_FORMAT),
            fiscalAdEnd: currentDate.format(DATE_FORMAT),
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            updatedDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fiscalAdStart: currentDate,
            fiscalAdEnd: currentDate,
            createdDate: currentDate,
            updatedDate: currentDate,
          },
          returnedFromService
        );

        service.create(new FiscalYear()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FiscalYear', () => {
        const returnedFromService = Object.assign(
          {
            fiscalYearFrom: 'BBBBBB',
            fiscalYearTill: 'BBBBBB',
            fiscalAdStart: currentDate.format(DATE_FORMAT),
            fiscalAdEnd: currentDate.format(DATE_FORMAT),
            fiscalBsStart: 'BBBBBB',
            fiscalBsEnd: 'BBBBBB',
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            updatedDate: currentDate.format(DATE_TIME_FORMAT),
            deleted: true,
            insertedBy: 'BBBBBB',
            insertedByID: 1,
            updatedBy: 'BBBBBB',
            updatedByID: 1,
            status: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fiscalAdStart: currentDate,
            fiscalAdEnd: currentDate,
            createdDate: currentDate,
            updatedDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FiscalYear', () => {
        const returnedFromService = Object.assign(
          {
            fiscalYearFrom: 'BBBBBB',
            fiscalYearTill: 'BBBBBB',
            fiscalAdStart: currentDate.format(DATE_FORMAT),
            fiscalAdEnd: currentDate.format(DATE_FORMAT),
            fiscalBsStart: 'BBBBBB',
            fiscalBsEnd: 'BBBBBB',
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            updatedDate: currentDate.format(DATE_TIME_FORMAT),
            deleted: true,
            insertedBy: 'BBBBBB',
            insertedByID: 1,
            updatedBy: 'BBBBBB',
            updatedByID: 1,
            status: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fiscalAdStart: currentDate,
            fiscalAdEnd: currentDate,
            createdDate: currentDate,
            updatedDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a FiscalYear', () => {
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
