import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICadastroAluno, NewCadastroAluno } from '../cadastro-aluno.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export type PartialUpdateCadastroAluno = Partial<ICadastroAluno> & Pick<ICadastroAluno, 'id'>;

type RestOf<T extends ICadastroAluno | NewCadastroAluno> = Omit<T, 'dataCadastro' | 'dn' | 'paiDataNascimento' | 'maeDataNascimento'> & {
  dataCadastro?: string | null;
  dn?: string | null;
  paiDataNascimento?: string | null;
  maeDataNascimento?: string | null;
};

export type RestCadastroAluno = RestOf<ICadastroAluno>;

export type NewRestCadastroAluno = RestOf<NewCadastroAluno>;

export type PartialUpdateRestCadastroAluno = RestOf<PartialUpdateCadastroAluno>;

export type EntityResponseType = HttpResponse<ICadastroAluno>;
export type EntityArrayResponseType = HttpResponse<ICadastroAluno[]>;

@Injectable({ providedIn: 'root' })
export class CadastroAlunoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cadastro-alunos');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private fb: FormBuilder,
  ) {}

  // Formulário reativo para cadastro de aluno
  cadastroAlunoFormGroup(): FormGroup {
    return this.fb.group({
      id: new FormControl<number | null>(null),
      dataCadastro: new FormControl<dayjs.Dayjs | null>(null, { nonNullable: true, validators: [Validators.required] }),
      matricula: new FormControl<string | null>(null),
      grupo: new FormControl<string | null>(null),
      nome: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      dn: new FormControl<dayjs.Dayjs | null>(null, { nonNullable: true, validators: [Validators.required] }),
      cep: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      endereco: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      qd: new FormControl<string | null>(null),
      lote: new FormControl<string | null>(null),
      endnumero: new FormControl<string | null>(null),
      bairro: new FormControl<string | null>(null),
      municipio: new FormControl<string | null>(null),
      uf: new FormControl<string | null>(null),
      fone: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      certidao: new FormControl<string | null>(null),
      termo: new FormControl<string | null>(null),
      cartorio: new FormControl<string | null>(null),
      naturalidade: new FormControl<string | null>(null),
      rg: new FormControl<string | null>(null),
      cpf: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      nis: new FormControl<string | null>(null),
      cras: new FormControl<string | null>(null),
      filiacaoPai: new FormControl<string | null>(null),
      paiTelefone: new FormControl<string | null>(null),
      paiNaturalidade: new FormControl<string | null>(null),
      paiUf: new FormControl<string | null>(null),
      paiRg: new FormControl<string | null>(null),
      paiDataNascimento: new FormControl<dayjs.Dayjs | null>(null),
      paiCpf: new FormControl<string | null>(null),
      paiNis: new FormControl<string | null>(null),
      paiTituloEleitor: new FormControl<string | null>(null),
      paiZona: new FormControl<string | null>(null),
      paiSecao: new FormControl<string | null>(null),
      paiMunicipio: new FormControl<string | null>(null),
      filiacaoMae: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      maeTelefone: new FormControl<string | null>(null),
      maeNaturalidade: new FormControl<string | null>(null),
      maeUf: new FormControl<string | null>(null),
      maeRg: new FormControl<string | null>(null),
      maeDataNascimento: new FormControl<dayjs.Dayjs | null>(null),
      maeCpf: new FormControl<string | null>(null),
      maeNis: new FormControl<string | null>(null),
      maeTituloEleitor: new FormControl<string | null>(null),
      maeZona: new FormControl<string | null>(null),
      maeSecao: new FormControl<string | null>(null),
      maeMunicipio: new FormControl<string | null>(null),
      nomeEscola: new FormControl<string | null>(null),
      anoCursando: new FormControl<string | null>(null),
      turno: new FormControl<string | null>(null),
      mediaEscolar: new FormControl<number | null>(null),
      prioritario: new FormControl<string | null>(null),
      obs: new FormControl<string | null>(null),
      comportamentoCasa: new FormControl<string | null>(null),
      comportamentoEscola: new FormControl<string | null>(null),
      deficiencia: new FormControl<string | null>(null),
      adaptacoes: new FormControl<string | null>(null),
      medicacao: new FormControl<string | null>(null),
      medicacaoDesc: new FormControl<string | null>(null),
      alergia: new FormControl<string | null>(null),
      alergiaDesc: new FormControl<string | null>(null),
      historicoMedico: new FormControl<string | null>(null),
      rendaFamiliar: new FormControl<string | null>(null),
      pessoasTrabalham: new FormControl<number | null>(null),
      numPessoasLar: new FormControl<number | null>(null),
      beneficioSocial: new FormControl<string | null>(null),
      beneficios: new FormControl<string | null>(null),
      tipoResidencia: new FormControl<string | null>(null),
      tipoResidenciaDesc: new FormControl<string | null>(null),
      situacaoResidencia: new FormControl<string | null>(null),
      situacaoResidenciaDesc: new FormControl<string | null>(null),
      contatoEmergencia: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      foneEmergencia: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      relacaoEmergencia: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
      autorizacao: new FormControl<boolean | null>(null, { nonNullable: true, validators: [Validators.required] }),
      fotoAluno: new FormControl<string | null>(null),
      fotoAlunoContentType: new FormControl<string | null>(null),
      fotoMae: new FormControl<string | null>(null),
      fotoMaeContentType: new FormControl<string | null>(null),
      responsaveis: this.fb.array([]),
      deslocamentos: this.fb.array([]),
    });
  }

  create(cadastroAluno: NewCadastroAluno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cadastroAluno);
    return this.http
      .post<RestCadastroAluno>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(cadastroAluno: ICadastroAluno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cadastroAluno);
    return this.http
      .put<RestCadastroAluno>(`${this.resourceUrl}/${this.getCadastroAlunoIdentifier(cadastroAluno)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(cadastroAluno: PartialUpdateCadastroAluno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cadastroAluno);
    return this.http
      .patch<RestCadastroAluno>(`${this.resourceUrl}/${this.getCadastroAlunoIdentifier(cadastroAluno)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCadastroAluno>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCadastroAluno[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCadastroAlunoIdentifier(cadastroAluno: Pick<ICadastroAluno, 'id'>): number {
    return cadastroAluno.id;
  }

  compareCadastroAluno(o1: Pick<ICadastroAluno, 'id'> | null, o2: Pick<ICadastroAluno, 'id'> | null): boolean {
    return o1 && o2 ? this.getCadastroAlunoIdentifier(o1) === this.getCadastroAlunoIdentifier(o2) : o1 === o2;
  }

  addCadastroAlunoToCollectionIfMissing<Type extends Pick<ICadastroAluno, 'id'>>(
    cadastroAlunoCollection: Type[],
    ...cadastroAlunosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cadastroAlunos: Type[] = cadastroAlunosToCheck.filter(isPresent);
    if (cadastroAlunos.length > 0) {
      const cadastroAlunoCollectionIdentifiers = cadastroAlunoCollection.map(
        cadastroAlunoItem => this.getCadastroAlunoIdentifier(cadastroAlunoItem)!,
      );
      const cadastroAlunosToAdd = cadastroAlunos.filter(cadastroAlunoItem => {
        const cadastroAlunoIdentifier = this.getCadastroAlunoIdentifier(cadastroAlunoItem);
        if (cadastroAlunoCollectionIdentifiers.includes(cadastroAlunoIdentifier)) {
          return false;
        }
        cadastroAlunoCollectionIdentifiers.push(cadastroAlunoIdentifier);
        return true;
      });
      return [...cadastroAlunosToAdd, ...cadastroAlunoCollection];
    }
    return cadastroAlunoCollection;
  }

  protected convertDateFromClient<T extends ICadastroAluno | NewCadastroAluno | PartialUpdateCadastroAluno>(cadastroAluno: T): RestOf<T> {
    return {
      ...cadastroAluno,
      dataCadastro: cadastroAluno.dataCadastro?.format(DATE_FORMAT) ?? null,
      dn: cadastroAluno.dn?.format(DATE_FORMAT) ?? null,
      paiDataNascimento: cadastroAluno.paiDataNascimento?.format(DATE_FORMAT) ?? null,
      maeDataNascimento: cadastroAluno.maeDataNascimento?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCadastroAluno: RestCadastroAluno): ICadastroAluno {
    return {
      ...restCadastroAluno,
      dataCadastro: restCadastroAluno.dataCadastro ? dayjs(restCadastroAluno.dataCadastro) : undefined,
      dn: restCadastroAluno.dn ? dayjs(restCadastroAluno.dn) : undefined,
      paiDataNascimento: restCadastroAluno.paiDataNascimento ? dayjs(restCadastroAluno.paiDataNascimento) : undefined,
      maeDataNascimento: restCadastroAluno.maeDataNascimento ? dayjs(restCadastroAluno.maeDataNascimento) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCadastroAluno>): HttpResponse<ICadastroAluno> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCadastroAluno[]>): HttpResponse<ICadastroAluno[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  getCadastroAlunoFromForm(form: any): NewCadastroAluno {
    const responsaveisValue = form.get('responsaveis')?.value ?? [];
    const deslocamentosValue = form.get('deslocamentos')?.value ?? [];

    return {
      id: null,
      dataCadastro: form.get('dataCadastro')?.value ? dayjs(form.get('dataCadastro')?.value, DATE_FORMAT) : undefined,
      matricula: form.get('matricula')?.value,
      grupo: form.get('grupo')?.value,
      nome: form.get('nome')?.value,
      dn: form.get('dn')?.value ? dayjs(form.get('dn')?.value, DATE_FORMAT) : undefined,
      cep: form.get('cep')?.value,
      endereco: form.get('endereco')?.value,
      qd: form.get('qd')?.value,
      lote: form.get('lote')?.value,
      endnumero: form.get('endnumero')?.value,
      bairro: form.get('bairro')?.value,
      municipio: form.get('municipio')?.value,
      uf: form.get('uf')?.value,
      fone: form.get('fone')?.value,
      certidao: form.get('certidao')?.value,
      termo: form.get('termo')?.value,
      cartorio: form.get('cartorio')?.value,
      naturalidade: form.get('naturalidade')?.value,
      rg: form.get('rg')?.value,
      cpf: form.get('cpf')?.value,
      nis: form.get('nis')?.value,
      cras: form.get('cras')?.value,
      filiacaoPai: form.get('filiacaoPai')?.value,
      paiTelefone: form.get('paiTelefone')?.value,
      paiNaturalidade: form.get('paiNaturalidade')?.value,
      paiUf: form.get('paiUf')?.value,
      paiRg: form.get('paiRg')?.value,
      paiDataNascimento: form.get('paiDataNascimento')?.value ? dayjs(form.get('paiDataNascimento')?.value, DATE_FORMAT) : undefined,
      paiCpf: form.get('paiCpf')?.value,
      paiNis: form.get('paiNis')?.value,
      paiTituloEleitor: form.get('paiTituloEleitor')?.value,
      paiZona: form.get('paiZona')?.value,
      paiSecao: form.get('paiSecao')?.value,
      paiMunicipio: form.get('paiMunicipio')?.value,
      filiacaoMae: form.get('filiacaoMae')?.value,
      maeTelefone: form.get('maeTelefone')?.value,
      maeNaturalidade: form.get('maeNaturalidade')?.value,
      maeUf: form.get('maeUf')?.value,
      maeRg: form.get('maeRg')?.value,
      maeDataNascimento: form.get('maeDataNascimento')?.value ? dayjs(form.get('maeDataNascimento')?.value, DATE_FORMAT) : undefined,
      maeCpf: form.get('maeCpf')?.value,
      maeNis: form.get('maeNis')?.value,
      maeTituloEleitor: form.get('maeTituloEleitor')?.value,
      maeZona: form.get('maeZona')?.value,
      maeSecao: form.get('maeSecao')?.value,
      maeMunicipio: form.get('maeMunicipio')?.value,
      nomeEscola: form.get('nomeEscola')?.value,
      anoCursando: form.get('anoCursando')?.value,
      turno: form.get('turno')?.value,
      mediaEscolar: form.get('mediaEscolar')?.value,
      prioritario: form.get('prioritario')?.value,
      obs: form.get('obs')?.value,
      comportamentoCasa: form.get('comportamentoCasa')?.value,
      comportamentoEscola: form.get('comportamentoEscola')?.value,
      deficiencia: form.get('deficiencia')?.value,
      adaptacoes: form.get('adaptacoes')?.value,
      medicacao: form.get('medicacao')?.value,
      medicacaoDesc: form.get('medicacaoDesc')?.value,
      alergia: form.get('alergia')?.value,
      alergiaDesc: form.get('alergiaDesc')?.value,
      historicoMedico: form.get('historicoMedico')?.value,
      rendaFamiliar: form.get('rendaFamiliar')?.value,
      pessoasTrabalham: form.get('pessoasTrabalham')?.value,
      numPessoasLar: form.get('numPessoasLar')?.value,
      beneficioSocial: form.get('beneficioSocial')?.value,
      beneficios: form.get('beneficios')?.value,
      tipoResidencia: form.get('tipoResidencia')?.value,
      tipoResidenciaDesc: form.get('tipoResidenciaDesc')?.value,
      situacaoResidencia: form.get('situacaoResidencia')?.value,
      situacaoResidenciaDesc: form.get('situacaoResidenciaDesc')?.value,
      contatoEmergencia: form.get('contatoEmergencia')?.value,
      foneEmergencia: form.get('foneEmergencia')?.value,
      relacaoEmergencia: form.get('relacaoEmergencia')?.value,
      autorizacao: form.get('autorizacao')?.value,
      fotoAluno: form.get('fotoAluno')?.value,
      fotoAlunoContentType: form.get('fotoAlunoContentType')?.value,
      fotoMae: form.get('fotoMae')?.value,
      fotoMaeContentType: form.get('fotoMaeContentType')?.value,
      responsaveis: responsaveisValue,
      deslocamentos: deslocamentosValue,
    };
  }

  resetFormGroup(form: FormGroup, cadastroAluno: ICadastroAluno): void {
    const cadastroAlunoValue = {
      ...cadastroAluno,
      dataCadastro: cadastroAluno.dataCadastro ? cadastroAluno.dataCadastro.format(DATE_FORMAT) : null,
      dn: cadastroAluno.dn ? cadastroAluno.dn.format(DATE_FORMAT) : null,
      paiDataNascimento: cadastroAluno.paiDataNascimento ? cadastroAluno.paiDataNascimento.format(DATE_FORMAT) : null,
      maeDataNascimento: cadastroAluno.maeDataNascimento ? cadastroAluno.maeDataNascimento.format(DATE_FORMAT) : null,
      responsaveis: cadastroAluno.responsavels ?? [],
      deslocamentos: cadastroAluno.deslocamentos ?? [],
    };
    form.reset({
      ...cadastroAlunoValue,
      id: cadastroAlunoValue.id,
    });
  }
}
