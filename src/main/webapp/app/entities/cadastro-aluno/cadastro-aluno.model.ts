import dayjs from 'dayjs/esm';
import { IResponsavel } from 'app/entities/responsavel/responsavel.model';
import { IDeslocamento } from 'app/entities/deslocamento/deslocamento.model';
import { Turno } from 'app/entities/enumerations/turno.model';
import { SimNao } from 'app/entities/enumerations/sim-nao.model';
import { Comportamento } from 'app/entities/enumerations/comportamento.model';
import { TipoResidencia } from 'app/entities/enumerations/tipo-residencia.model';
import { SituacaoResidencia } from 'app/entities/enumerations/situacao-residencia.model';

export interface ICadastroAluno {
  id: number;
  dataCadastro?: dayjs.Dayjs | null;
  matricula?: string | null;
  grupo?: string | null;
  nome?: string | null;
  dn?: dayjs.Dayjs | null;
  cep?: string | null;
  endereco?: string | null;
  qd?: string | null;
  lote?: string | null;
  endnumero?: string | null;
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
  nomeEscola?: string | null;
  anoCursando?: string | null;
  turno?: Turno | null;
  mediaEscolar?: number | null;
  prioritario?: SimNao | null;
  obs?: string | null;
  comportamentoCasa?: Comportamento | null;
  comportamentoEscola?: Comportamento | null;
  deficiencia?: SimNao | null;
  adaptacoes?: SimNao | null;
  medicacao?: SimNao | null;
  medicacaoDesc?: string | null;
  alergia?: SimNao | null;
  alergiaDesc?: string | null;
  historicoMedico?: string | null;
  rendaFamiliar?: string | null;
  pessoasTrabalham?: number | null;
  numPessoasLar?: number | null;
  beneficioSocial?: SimNao | null;
  beneficios?: string | null;
  tipoResidencia?: TipoResidencia | null;
  tipoResidenciaDesc?: string | null;
  situacaoResidencia?: SituacaoResidencia | null;
  situacaoResidenciaDesc?: string | null;
  contatoEmergencia?: string | null;
  foneEmergencia?: string | null;
  relacaoEmergencia?: string | null;
  autorizacao?: boolean | null;
  fotoAluno?: string | null;
  fotoAlunoContentType?: string | null; // Adicionado para lidar com upload de imagem
  fotoMae?: string | null;
  fotoMaeContentType?: string | null; // Adicionado para lidar com upload de imagem
  responsavels?: IResponsavel[] | null; // Relacionamento OneToMany
  deslocamentos?: IDeslocamento[] | null; // Relacionamento OneToMany
}

export type NewCadastroAluno = Omit<ICadastroAluno, 'id'> & { id: null };
