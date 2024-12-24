import dayjs from 'dayjs/esm';

export interface IResponsavel {
  id: number;
  nome?: string | null;
  parentesco?: string | null;
}

export interface IDeslocamento {
  id: number;
  nome?: string | null;
  grau?: string | null;
}

export interface ICadastroAluno {
  id: number;
  dataCadastro?: dayjs.Dayjs | null;
  grupo?: string | null;
  matricula?: string | null;
  nome?: string | null;
  dn?: dayjs.Dayjs | null;
  endereco?: string | null;
  cep?: string | null;
  endnumero?: string | null;
  qd?: string | null;
  lote?: string | null;
  bairro?: string | null;
  municipio?: string | null;
  uf?: string | null;
  fone?: string | null;
  certidao?: string | null;
  termo?: string | null;
  cartorio?: string | null;
  naturalidade?: string | null;
  rg?: string | null;
  cpf?: string | null;
  nis?: string | null;
  cras?: string | null;
  filiacaoPai?: string | null;
  paiTelefone?: string | null;
  paiNaturalidade?: string | null;
  paiUf?: string | null;
  paiRg?: string | null;
  paiDataNascimento?: dayjs.Dayjs | null;
  paiCpf?: string | null;
  paiNis?: string | null;
  paiTituloEleitor?: string | null;
  paiZona?: string | null;
  paiSecao?: string | null;
  paiMunicipio?: string | null;
  filiacaoMae?: string | null;
  maeTelefone?: string | null;
  maeNaturalidade?: string | null;
  maeUf?: string | null;
  maeRg?: string | null;
  maeDataNascimento?: dayjs.Dayjs | null;
  maeCpf?: string | null;
  maeNis?: string | null;
  maeTituloEleitor?: string | null;
  maeZona?: string | null;
  maeSecao?: string | null;
  maeMunicipio?: string | null;
  responsaveis?: IResponsavel[] | null;
  nomeEscola?: string | null;
  anoCursando?: string | null;
  turno?: string | null;
  mediaEscolar?: number | null;
  prioritario?: string | null;
  obs?: string | null;
  comportamentoCasa?: string | null;
  comportamentoEscola?: string | null;
  deficiencia?: string | null;
  adaptacoes?: string | null;
  medicacao?: string | null;
  medicacaoDesc?: string | null;
  alergia?: string | null;
  alergiaDesc?: string | null;
  historicoMedico?: string | null;
  rendaFamiliar?: string | null;
  pessoasTrabalham?: number | null;
  numPessoasLar?: number | null;
  beneficioSocial?: string | null;
  beneficios?: string | null;
  tipoResidencia?: string | null;
  tipoResidenciaDesc?: string | null;
  situacaoResidencia?: string | null;
  situacaoResidenciaDesc?: string | null;
  contatoEmergencia?: string | null;
  foneEmergencia?: string | null;
  relacaoEmergencia?: string | null;
  deslocamentos?: IDeslocamento[] | null;
  autorizacao?: boolean | null;
  fotoAluno?: string | null;
  fotoAlunoContentType?: string | null;
  fotoMae?: string | null;
  fotoMaeContentType?: string | null;
}

export type NewCadastroAluno = Omit<ICadastroAluno, 'id'> & { id: null };
