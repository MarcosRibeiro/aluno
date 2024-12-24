import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

// If you want to add another module, it must be imported here
import { CadastroAlunoComponent } from './../entities/cadastro-aluno/list/cadastro-aluno.component';
import { CadastroAlunoUpdateComponent } from './../entities/cadastro-aluno/update/cadastro-aluno-update.component';
import { CadastroAlunoRoutingModule } from './../entities/cadastro-aluno/route/cadastro-aluno-routing.module';
import { ResponsavelModule } from './../entities/responsavel/responsavel.module';
import { DeslocamentoModule } from './../entities/deslocamento/deslocamento.module';

@NgModule({
  imports: [
    CadastroAlunoRoutingModule,
    ResponsavelModule,
    DeslocamentoModule,
    CommonModule,
    InfiniteScrollModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [CadastroAlunoComponent, CadastroAlunoUpdateComponent],
  exports: [CommonModule, FormsModule, NgbModule, InfiniteScrollModule, FontAwesomeModule, ReactiveFormsModule, TranslateModule],
})
export class CadastroAlunoModule {}
