import { IDeslocamento, NewDeslocamento } from './deslocamento.model';

export const sampleWithRequiredData: IDeslocamento = {
  id: 28380,
  nome: 'except',
  grau: 'hm',
};

export const sampleWithPartialData: IDeslocamento = {
  id: 11293,
  nome: 'dish',
  grau: 'anenst',
};

export const sampleWithFullData: IDeslocamento = {
  id: 3705,
  nome: 'to',
  grau: 'that out',
};

export const sampleWithNewData: NewDeslocamento = {
  nome: 'jellyfish catch ouch',
  grau: 'consistency whenever',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
