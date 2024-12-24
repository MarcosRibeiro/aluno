import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CadastroAlunoModule } from 'app/shared/shared.module';
import { DeslocamentoComponent } from './list/deslocamento.component';
import { DeslocamentoDetailComponent } from './detail/deslocamento-detail.component';
import { DeslocamentoUpdateComponent } from './update/deslocamento-update.component';
import { DeslocamentoDeleteDialogComponent } from './delete/deslocamento-delete-dialog.component';
import { DeslocamentoRoutingModule } from './route/deslocamento-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CadastroAlunoModule, RouterModule, DeslocamentoRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [DeslocamentoComponent, DeslocamentoDetailComponent, DeslocamentoUpdateComponent, DeslocamentoDeleteDialogComponent],
})
export class DeslocamentoModule {}
