import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDeslocamento } from '../deslocamento.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../deslocamento.test-samples';

import { DeslocamentoService } from './deslocamento.service';

const requireRestSample: IDeslocamento = {
  ...sampleWithRequiredData,
};

describe('Deslocamento Service', () => {
  let service: DeslocamentoService;
  let httpMock: HttpTestingController;
  let expectedResult: IDeslocamento | IDeslocamento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DeslocamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Deslocamento', () => {
      const deslocamento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(deslocamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Deslocamento', () => {
      const deslocamento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(deslocamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Deslocamento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Deslocamento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Deslocamento', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a Deslocamento', () => {
      const queryObject: any = {
        page: 0,
        size: 20,
        query: '',
        sort: [],
      };
      service.search(queryObject).subscribe(() => expectedResult);

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
      expect(expectedResult).toBe(null);
    });

    describe('addDeslocamentoToCollectionIfMissing', () => {
      it('should add a Deslocamento to an empty array', () => {
        const deslocamento: IDeslocamento = sampleWithRequiredData;
        expectedResult = service.addDeslocamentoToCollectionIfMissing([], deslocamento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(deslocamento);
      });

      it('should not add a Deslocamento to an array that contains it', () => {
        const deslocamento: IDeslocamento = sampleWithRequiredData;
        const deslocamentoCollection: IDeslocamento[] = [
          {
            ...deslocamento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDeslocamentoToCollectionIfMissing(deslocamentoCollection, deslocamento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Deslocamento to an array that doesn't contain it", () => {
        const deslocamento: IDeslocamento = sampleWithRequiredData;
        const deslocamentoCollection: IDeslocamento[] = [sampleWithPartialData];
        expectedResult = service.addDeslocamentoToCollectionIfMissing(deslocamentoCollection, deslocamento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(deslocamento);
      });

      it('should add only unique Deslocamento to an array', () => {
        const deslocamentoArray: IDeslocamento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const deslocamentoCollection: IDeslocamento[] = [sampleWithRequiredData];
        expectedResult = service.addDeslocamentoToCollectionIfMissing(deslocamentoCollection, ...deslocamentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const deslocamento: IDeslocamento = sampleWithRequiredData;
        const deslocamento2: IDeslocamento = sampleWithPartialData;
        expectedResult = service.addDeslocamentoToCollectionIfMissing([], deslocamento, deslocamento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(deslocamento);
        expect(expectedResult).toContain(deslocamento2);
      });

      it('should accept null and undefined values', () => {
        const deslocamento: IDeslocamento = sampleWithRequiredData;
        expectedResult = service.addDeslocamentoToCollectionIfMissing([], null, deslocamento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(deslocamento);
      });

      it('should return initial array if no Deslocamento is added', () => {
        const deslocamentoCollection: IDeslocamento[] = [sampleWithRequiredData];
        expectedResult = service.addDeslocamentoToCollectionIfMissing(deslocamentoCollection, undefined, null);
        expect(expectedResult).toEqual(deslocamentoCollection);
      });
    });

    describe('compareDeslocamento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDeslocamento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDeslocamento(entity1, entity2);
        const compareResult2 = service.compareDeslocamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDeslocamento(entity1, entity2);
        const compareResult2 = service.compareDeslocamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDeslocamento(entity1, entity2);
        const compareResult2 = service.compareDeslocamento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
