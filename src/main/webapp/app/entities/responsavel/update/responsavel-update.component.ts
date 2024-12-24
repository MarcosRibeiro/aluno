import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ResponsavelService, Responsavel } from '../service/responsavel.service';

@Component({
  selector: 'jhi-responsavel-update',
  templateUrl: './responsavel-update.component.html',
})
export class ResponsavelUpdateComponent implements OnInit {
  isSaving = false;
  responsavel: Responsavel | null = null;

  editForm = this.responsavelService.createResponsavelFormGroup();

  constructor(
    protected responsavelService: ResponsavelService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ responsavel }) => {
      this.responsavel = responsavel;
      if (responsavel) {
        this.updateForm(responsavel);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const responsavel = this.responsavelService.getResponsavelFromFormGroup(this.editForm);
    if (responsavel.id !== null) {
      this.subscribeToSaveResponse(this.responsavelService.update(responsavel));
    } else {
      this.subscribeToSaveResponse(this.responsavelService.create(responsavel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Responsavel>>): void {
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

  protected updateForm(responsavel: Responsavel): void {
    this.responsavel = responsavel;
    this.responsavelService.resetFormGroup(this.editForm, responsavel);
  }
}
