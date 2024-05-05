import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { AdBsDatesService } from 'app/entities/ad-bs-dates/ad-bs-dates.service';
import { IAdBsDates, AdBsDates } from 'app/shared/model/ad-bs-dates.model';

describe('Service Tests', () => {
  describe('AdBsDates Service', () => {
    let injector: TestBed;
    let service: AdBsDatesService;
    let httpMock: HttpTestingController;
    let elemDefault: IAdBsDates;
    let expectedResult: IAdBsDates | IAdBsDates[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(AdBsDatesService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new AdBsDates(
        0,
        currentDate,
        'AAAAAAA',
        'AAAAAAA',
        false,
        'AAAAAAA',
        0,
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
            adDate: currentDate.format(DATE_FORMAT),
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

      it('should create a AdBsDates', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            adDate: currentDate.format(DATE_FORMAT),
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            updatedDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            adDate: currentDate,
            createdDate: currentDate,
            updatedDate: currentDate,
          },
          returnedFromService
        );

        service.create(new AdBsDates()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AdBsDates', () => {
        const returnedFromService = Object.assign(
          {
            adDate: currentDate.format(DATE_FORMAT),
            bsDate: 'BBBBBB',
            day: 'BBBBBB',
            holiday: true,
            month: 'BBBBBB',
            fiscalYearId: 1,
            fiscalYearN: 'BBBBBB',
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
            adDate: currentDate,
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

      it('should return a list of AdBsDates', () => {
        const returnedFromService = Object.assign(
          {
            adDate: currentDate.format(DATE_FORMAT),
            bsDate: 'BBBBBB',
            day: 'BBBBBB',
            holiday: true,
            month: 'BBBBBB',
            fiscalYearId: 1,
            fiscalYearN: 'BBBBBB',
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
            adDate: currentDate,
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

      it('should delete a AdBsDates', () => {
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
