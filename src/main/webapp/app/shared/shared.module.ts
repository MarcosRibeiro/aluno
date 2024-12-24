import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Importe o ReactiveFormsModule
import { CadastroAlunoComponent } from './list/cadastro-aluno.component';
import { CadastroAlunoUpdateComponent } from './update/cadastro-aluno-update.component';
import { CadastroAlunoRoutingModule } from './route/cadastro-aluno-routing.module';
import { ResponsavelModule } from './entities/responsavel/responsavel.module';
import { DeslocamentoModule } from './entities/deslocamento/deslocamento.module';
//import { SharedModule } from 'app/shared/shared.module'; // Verifique se este módulo exporta os componentes e diretivas que você está usando
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule, // Adicione o ReactiveFormsModule aqui
    CadastroAlunoRoutingModule,
    CadastroAlunoComponent,
    CadastroAlunoUpdateComponent,
    ResponsavelModule,
    DeslocamentoModule,
    FontAwesomeModule,
  ],
})
export class CadastroAlunoModule {}
