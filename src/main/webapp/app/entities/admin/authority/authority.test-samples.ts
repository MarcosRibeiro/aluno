import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '193c1d59-91f6-4382-a426-fbd2fb58cb1f',
};

export const sampleWithPartialData: IAuthority = {
  name: 'f79eb827-e3b0-4d92-a042-6a21b8f17601',
};

export const sampleWithFullData: IAuthority = {
  name: '5d604091-91a8-4b70-8de1-df35b7e45219',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
