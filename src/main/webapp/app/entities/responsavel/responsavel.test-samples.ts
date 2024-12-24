import { IResponsavel, NewResponsavel } from './responsavel.model';

export const sampleWithRequiredData: IResponsavel = {
  id: 17314,
  nome: 'solidly outside woot',
  parentesco: 'pants furthermore',
};

export const sampleWithPartialData: IResponsavel = {
  id: 29356,
  nome: 'hmph',
  parentesco: 'promptly',
};

export const sampleWithFullData: IResponsavel = {
  id: 30332,
  nome: 'crowded convection',
  parentesco: 'amongst unethically',
};

export const sampleWithNewData: NewResponsavel = {
  nome: 'until well-worn',
  parentesco: 'approach inscribe',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
