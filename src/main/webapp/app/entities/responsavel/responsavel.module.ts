import { NgModule } from '@angular/core';
import { CadastroAlunoModule } from 'app/shared/shared.module';
import { ResponsavelComponent } from './list/responsavel.component';
import { ResponsavelDetailComponent } from './detail/responsavel-detail.component';
import { ResponsavelUpdateComponent } from './update/responsavel-update.component';
import { ResponsavelDeleteDialogComponent } from './delete/responsavel-delete-dialog.component';
import { ResponsavelRoutingModule } from './route/responsavel-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CadastroAlunoModule, ResponsavelRoutingModule, ReactiveFormsModule],
  declarations: [ResponsavelComponent, ResponsavelDetailComponent, ResponsavelUpdateComponent, ResponsavelDeleteDialogComponent],
})
export class ResponsavelModule {}
