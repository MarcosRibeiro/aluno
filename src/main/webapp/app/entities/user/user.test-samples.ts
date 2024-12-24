import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 11534,
  login: '3',
};

export const sampleWithPartialData: IUser = {
  id: 22487,
  login: '$oY+@RLljU\\Dj\\[M',
};

export const sampleWithFullData: IUser = {
  id: 23470,
  login: 'pgDb',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
