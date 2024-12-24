import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DeslocamentoService, Deslocamento } from '../service/deslocamento.service';

@Component({
  selector: 'jhi-deslocamento-update',
  templateUrl: './deslocamento-update.component.html',
})
export class DeslocamentoUpdateComponent implements OnInit {
  isSaving = false;
  deslocamento: Deslocamento | null = null;

  editForm = this.deslocamentoService.createDeslocamentoFormGroup();

  constructor(
    protected deslocamentoService: DeslocamentoService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deslocamento }) => {
      this.deslocamento = deslocamento;
      if (deslocamento) {
        this.updateForm(deslocamento);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const deslocamento = this.deslocamentoService.getDeslocamentoFromFormGroup(this.editForm);
    if (deslocamento.id !== null) {
      this.subscribeToSaveResponse(this.deslocamentoService.update(deslocamento));
    } else {
      this.subscribeToSaveResponse(this.deslocamentoService.create(deslocamento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Deslocamento>>): void {
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

  protected updateForm(deslocamento: Deslocamento): void {
    this.deslocamento = deslocamento;
    this.deslocamentoService.resetFormGroup(this.editForm, deslocamento);
  }
}
