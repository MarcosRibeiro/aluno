import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResponsavel, NewResponsavel } from '../responsavel.model';

export type PartialUpdateResponsavel = Partial<IResponsavel> & Pick<IResponsavel, 'id'>;

export type EntityResponseType = HttpResponse<IResponsavel>;
export type EntityArrayResponseType = HttpResponse<IResponsavel[]>;

@Injectable({ providedIn: 'root' })
export class ResponsavelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/responsavels');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(responsavel: NewResponsavel): Observable<EntityResponseType> {
    return this.http.post<IResponsavel>(this.resourceUrl, responsavel, { observe: 'response' });
  }

  update(responsavel: IResponsavel): Observable<EntityResponseType> {
    return this.http.put<IResponsavel>(`${this.resourceUrl}/${this.getResponsavelIdentifier(responsavel)}`, responsavel, {
      observe: 'response',
    });
  }

  partialUpdate(responsavel: PartialUpdateResponsavel): Observable<EntityResponseType> {
    return this.http.patch<IResponsavel>(`${this.resourceUrl}/${this.getResponsavelIdentifier(responsavel)}`, responsavel, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResponsavel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResponsavel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getResponsavelIdentifier(responsavel: Pick<IResponsavel, 'id'>): number {
    return responsavel.id;
  }

  compareResponsavel(o1: Pick<IResponsavel, 'id'> | null, o2: Pick<IResponsavel, 'id'> | null): boolean {
    return o1 && o2 ? this.getResponsavelIdentifier(o1) === this.getResponsavelIdentifier(o2) : o1 === o2;
  }

  addResponsavelToCollectionIfMissing<Type extends Pick<IResponsavel, 'id'>>(
    responsavelCollection: Type[],
    ...responsavelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const responsavels: Type[] = responsavelsToCheck.filter(isPresent);
    if (responsavels.length > 0) {
      const responsavelCollectionIdentifiers = responsavelCollection.map(
        responsavelItem => this.getResponsavelIdentifier(responsavelItem)!,
      );
      const responsavelsToAdd = responsavels.filter(responsavelItem => {
        const responsavelIdentifier = this.getResponsavelIdentifier(responsavelItem);
        if (responsavelCollectionIdentifiers.includes(responsavelIdentifier)) {
          return false;
        }
        responsavelCollectionIdentifiers.push(responsavelIdentifier);
        return true;
      });
      return [...responsavelsToAdd, ...responsavelCollection];
    }
    return responsavelCollection;
  }

  // Não são necessárias conversões de data para este model
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    return res; // Não há datas em Responsavel, então retornamos a resposta sem modificações.
  }
}
