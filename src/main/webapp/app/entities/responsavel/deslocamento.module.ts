import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DeslocamentoComponent } from './list/deslocamento.component';
import { DeslocamentoDetailComponent } from './detail/deslocamento-detail.component';
import { DeslocamentoUpdateComponent } from './update/deslocamento-update.component';
import { DeslocamentoDeleteDialogComponent } from './delete/deslocamento-delete-dialog.component';
import { DeslocamentoRoutingModule } from './route/deslocamento-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [SharedModule, DeslocamentoRoutingModule, ReactiveFormsModule],
  declarations: [DeslocamentoComponent, DeslocamentoDetailComponent, DeslocamentoUpdateComponent, DeslocamentoDeleteDialogComponent],
})
export class DeslocamentoModule {}