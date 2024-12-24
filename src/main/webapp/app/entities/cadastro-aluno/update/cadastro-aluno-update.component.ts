import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CadastroAlunoFormService, CadastroAlunoFormGroup } from './cadastro-aluno-form.service';
import { CadastroAlunoService, ICadastroAluno } from '../service/cadastro-aluno.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-cadastro-aluno-update',
  templateUrl: './cadastro-aluno-update.component.html',
  styleUrls: ['./cadastro-aluno-update.component.scss'],
})
export class CadastroAlunoUpdateComponent implements OnInit {
  isSaving = false;
  cadastroAluno: ICadastroAluno | null = null;
  editForm: CadastroAlunoFormGroup;

  private readonly NOT_SORTABLE_FIELDS_AFTER_SEARCH = [
    'grupo',
    'nome',
    'cep',
    'endereco',
    'qd',
    'lote',
    'endnumero',
    'bairro',
    'municipio',
    'uf',
    'termo',
    'cartorio',
    'naturalidade',
    'rg',
    'cpf',
    'nis',
    'cras',
    'filiacaoPai',
    'paiUf',
    'paiRg',
    'paiCpf',
    'paiNis',
    'paiTituloEleitor',
    'paiZona',
    'filiacaoMae',
    'maeTelefone',
    'maeNaturalidade',
    'maeUf',
    'maeRg',
    'maeCpf',
    'maeZona',
    'maeSecao',
    'maeMunicipio',
    'nomeEscola',
    'anoCursando',
    'turno',
    'comportamentoCasa',
    'comportamentoEscola',
    'deficiencia',
    'adaptacoes',
    'medicacao',
    'alergiaDesc',
    'historicoMedico',
    'rendaFamiliar',
    'beneficioSocial',
    'beneficios',
    'situacaoResidencia',
    'situacaoResidenciaDesc',
    'contatoEmergencia',
    'fotoAluno',
  ];

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected cadastroAlunoService: CadastroAlunoService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected cadastroAlunoFormService: CadastroAlunoFormService, // Injeção do serviço
  ) {
    this.editForm = this.cadastroAlunoFormService.createCadastroAlunoFormGroup();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cadastroAluno }) => {
      this.cadastroAluno = cadastroAluno;
      if (cadastroAluno) {
        this.cadastroAlunoFormService.resetForm(this.editForm, cadastroAluno);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cadastroAlunoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cadastroAluno = this.cadastroAlunoFormService.getCadastroAluno(this.editForm);
    if (cadastroAluno.id !== null) {
      this.subscribeToSaveResponse(this.cadastroAlunoService.update(cadastroAluno));
    } else {
      this.subscribeToSaveResponse(this.cadastroAlunoService.create(cadastroAluno));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICadastroAluno>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  toggleMedicacaoField(): void {
    const medicacaoControl = this.editForm.get('medicacao');
    const medicacaoDescControl = this.editForm.get('medicacaoDesc');

    if (medicacaoControl && medicacaoDescControl) {
      if (medicacaoControl.value === 'SIM') {
        medicacaoDescControl.enable();
      } else {
        medicacaoDescControl.disable();
        medicacaoDescControl.reset();
      }
    }
  }

  toggleAlergiaField(): void {
    const alergiaControl = this.editForm.get('alergia');
    const alergiaDescControl = this.editForm.get('alergiaDesc');

    if (alergiaControl && alergiaDescControl) {
      if (alergiaControl.value === 'SIM') {
        alergiaDescControl.enable();
      } else {
        alergiaDescControl.disable();
        alergiaDescControl.reset();
      }
    }
  }

  toggleBeneficiosField(): void {
    const beneficioSocialControl = this.editForm.get('beneficioSocial');
    const beneficiosControl = this.editForm.get('beneficios');

    if (beneficioSocialControl && beneficiosControl) {
      if (beneficioSocialControl.value === 'SIM') {
        beneficiosControl.enable();
      } else {
        beneficiosControl.disable();
        beneficiosControl.reset();
      }
    }
  }

  adicionarResponsavel(): void {
    this.responsaveis.push(this.cadastroAlunoFormService.createResponsavelFormGroup());
  }

  removerResponsavel(index: number): void {
    this.responsaveis.removeAt(index);
  }

  adicionarDeslocamento(): void {
    this.deslocamentos.push(this.cadastroAlunoFormService.createDeslocamentoFormGroup());
  }

  removerDeslocamento(index: number): void {
    this.deslocamentos.removeAt(index);
  }

  toggleIcon(event: Event, sectionId: string): void {
    event.stopPropagation(); // Prevent event from bubbling up
    const icon = document.getElementById('icon-' + sectionId);
    if (icon) {
      if (icon.classList.contains('bi-chevron-down')) {
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-up');
      } else {
        icon.classList.remove('bi-chevron-up');
        icon.classList.add('bi-chevron-down');
      }
    }
  }

  clearInput(fieldName: string): void {
    const fieldControl = this.editForm.get(fieldName);
    if (fieldControl) {
      fieldControl.reset();
    }
  }

  clearCepFields(): void {
    this.editForm.patchValue({
      endereco: null,
      qd: null,
      lote: null,
      endnumero: null,
      bairro: null,
      municipio: null,
      uf: null,
    });
  }

  fillCepFields(data: any): void {
    this.editForm.patchValue({
      endereco: data.logradouro,
      bairro: data.bairro,
      municipio: data.localidade,
      uf: data.uf,
    });
  }

  searchCep(): void {
    const cep = this.editForm.get('cep')?.value;
    if (cep && cep !== '') {
      this.cadastroAlunoService.buscarCEP(cep).subscribe({
        next: res => {
          if (res.body) {
            this.fillCepFields(res.body);
          } else {
            this.clearCepFields();
          }
        },
        error: () => this.clearCepFields(),
      });
    } else {
      this.clearCepFields();
    }
  }

  onCepBlur(): void {
    this.searchCep();
  }

  get responsaveis() {
    return this.cadastroAlunoFormService.getResponsaveis(this.editForm);
  }

  get deslocamentos() {
    return this.cadastroAlunoFormService.getDeslocamentos(this.editForm);
  }
}
