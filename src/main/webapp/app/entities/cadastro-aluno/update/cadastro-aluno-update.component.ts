import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CadastroAlunoService, ICadastroAluno } from '../service/cadastro-aluno.service';
import { IResponsavel } from 'app/entities/responsavel/responsavel.model';
import { ResponsavelService } from 'app/entities/responsavel/service/responsavel.service';
import { IDeslocamento } from 'app/entities/deslocamento/deslocamento.model';
import { DeslocamentoService } from 'app/entities/deslocamento/service/deslocamento.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'jhi-cadastro-aluno-update',
  templateUrl: './cadastro-aluno-update.component.html',
})
export class CadastroAlunoUpdateComponent implements OnInit {
  isSaving = false;
  cadastroAluno: ICadastroAluno | null = null;

  responsaveisSharedCollection: IResponsavel[] = [];
  deslocamentosSharedCollection: IDeslocamento[] = [];

  editForm = this.cadastroAlunoService.cadastroAlunoFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected cadastroAlunoService: CadastroAlunoService,
    protected responsavelService: ResponsavelService,
    protected deslocamentoService: DeslocamentoService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cadastroAluno }) => {
      this.cadastroAluno = cadastroAluno;
      if (cadastroAluno) {
        this.updateForm(cadastroAluno);
      }

      this.loadRelationshipsOptions();
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
    const cadastroAluno = this.cadastroAlunoService.getCadastroAlunoFromForm(this.editForm);
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

  protected updateForm(cadastroAluno: ICadastroAluno): void {
    this.cadastroAluno = cadastroAluno;
    this.cadastroAlunoService.resetFormGroup(this.editForm, cadastroAluno);

    this.responsaveisSharedCollection = this.responsavelService.addResponsavelToCollectionIfMissing<IResponsavel>(
      this.responsaveisSharedCollection,
      ...(cadastroAluno.responsavels ?? []),
    );
    this.deslocamentosSharedCollection = this.deslocamentoService.addDeslocamentoToCollectionIfMissing<IDeslocamento>(
      this.deslocamentosSharedCollection,
      ...(cadastroAluno.deslocamentos ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.responsavelService
      .query()
      .pipe(map((res: HttpResponse<IResponsavel[]>) => res.body ?? []))
      .pipe(
        map((responsaveis: IResponsavel[]) =>
          this.responsavelService.addResponsavelToCollectionIfMissing<IResponsavel>(
            responsaveis,
            ...(this.cadastroAluno?.responsavels ?? []),
          ),
        ),
      )
      .subscribe((responsaveis: IResponsavel[]) => (this.responsaveisSharedCollection = responsaveis));

    this.deslocamentoService
      .query()
      .pipe(map((res: HttpResponse<IDeslocamento[]>) => res.body ?? []))
      .pipe(
        map((deslocamentos: IDeslocamento[]) =>
          this.deslocamentoService.addDeslocamentoToCollectionIfMissing<IDeslocamento>(
            deslocamentos,
            ...(this.cadastroAluno?.deslocamentos ?? []),
          ),
        ),
      )
      .subscribe((deslocamentos: IDeslocamento[]) => (this.deslocamentosSharedCollection = deslocamentos));
  }

  // Funções para alternar campos
  toggleMedicacaoField(): void {
    const medicacao = this.editForm.get('medicacao')?.value;
    if (medicacao === 'SIM') {
      this.editForm.get('medicacaoDesc')?.enable();
    } else {
      this.editForm.get('medicacaoDesc')?.disable();
      this.editForm.get('medicacaoDesc')?.setValue(null);
    }
  }

  toggleAlergiaField(): void {
    const alergia = this.editForm.get('alergia')?.value;
    if (alergia === 'SIM') {
      this.editForm.get('alergiaDesc')?.enable();
    } else {
      this.editForm.get('alergiaDesc')?.disable();
      this.editForm.get('alergiaDesc')?.setValue(null);
    }
  }

  toggleBeneficiosField(): void {
    const beneficioSocial = this.editForm.get('beneficioSocial')?.value;
    if (beneficioSocial === 'SIM') {
      this.editForm.get('beneficios')?.enable();
    } else {
      this.editForm.get('beneficios')?.disable();
      this.editForm.get('beneficios')?.setValue(null);
    }
  }

  toggleOutroResidenciaField(): void {
    const tipoResidencia = this.editForm.get('tipoResidencia')?.value;
    if (tipoResidencia === 'OUTRO') {
      this.editForm.get('tipoResidenciaDesc')?.enable();
    } else {
      this.editForm.get('tipoResidenciaDesc')?.disable();
      this.editForm.get('tipoResidenciaDesc')?.setValue(null);
    }
  }

  toggleOutraSituacaoField(): void {
    const situacaoResidencia = this.editForm.get('situacaoResidencia')?.value;
    if (situacaoResidencia === 'OUTRA') {
      this.editForm.get('situacaoResidenciaDesc')?.enable();
    } else {
      this.editForm.get('situacaoResidenciaDesc')?.disable();
      this.editForm.get('situacaoResidenciaDesc')?.setValue(null);
    }
  }

  // Função para adicionar um novo responsável
  adicionarResponsavel(): void {
    const responsaveisArray = this.editForm.get('responsaveis') as FormArray;
    if (responsaveisArray.length < 3) {
      responsaveisArray.push(
        new FormGroup({
          nome: new FormControl(null),
          parentesco: new FormControl(null),
        }),
      );
    } else {
      alert('Você pode adicionar no máximo 3 responsáveis.');
    }
  }

  // Função para remover um responsável
  removerResponsavel(index: number): void {
    const responsaveisArray = this.editForm.get('responsaveis') as FormArray;
    responsaveisArray.removeAt(index);
  }

  // Função para adicionar uma nova autorização de deslocamento
  adicionarDeslocamento(): void {
    const deslocamentosArray = this.editForm.get('deslocamentos') as FormArray;
    if (deslocamentosArray.length < 3) {
      deslocamentosArray.push(
        new FormGroup({
          nome: new FormControl(null),
          grau: new FormControl(null),
        }),
      );
    } else {
      alert('Você pode adicionar no máximo 3 autorizações de deslocamento.');
    }
  }

  // Função para remover uma autorização de deslocamento
  removerDeslocamento(index: number): void {
    const deslocamentosArray = this.editForm.get('deslocamentos') as FormArray;
    deslocamentosArray.removeAt(index);
  }

  // Função para alternar o ícone de seta no cabeçalho das seções
  toggleIcon(event: Event): void {
    const header = (event.target as HTMLElement).closest('.collapse-header');
    if (header) {
      const icon = header.querySelector('.bi');
      if (icon) {
        icon.classList.toggle('bi-chevron-down');
        icon.classList.toggle('bi-chevron-up');
      }
    }
  }

  // Função para limpar o conteúdo do campo
  clearInput(formControlName: string): void {
    this.editForm.get(formControlName)?.setValue(null);
  }

  // Funções para buscar e preencher campos com base no CEP
  clearCepFields(): void {
    this.editForm.get('endereco')?.setValue(null);
    this.editForm.get('bairro')?.setValue(null);
    this.editForm.get('municipio')?.setValue(null);
    this.editForm.get('uf')?.setValue(null);
  }

  fillCepFields(data: any): void {
    this.editForm.get('endereco')?.setValue(data.logradouro);
    this.editForm.get('bairro')?.setValue(data.bairro);
    this.editForm.get('municipio')?.setValue(data.localidade);
    this.editForm.get('uf')?.setValue(data.uf);
  }

  searchCep(cep: string): void {
    this.clearCepFields();

    if (cep !== '') {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (data: any) => {
          if (!data.erro) {
            this.fillCepFields(data);
          } else {
            alert('CEP não encontrado.');
          }
        },
        error: () => {
          alert('Erro ao buscar CEP.');
        },
      });
    }
  }

  onCepBlur(): void {
    const cep = this.editForm.get('cep')?.value?.replace(/\D/g, '');
    if (cep) {
      this.searchCep(cep);
    }
  }
}
