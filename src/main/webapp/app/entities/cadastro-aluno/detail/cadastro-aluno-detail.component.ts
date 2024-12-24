import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import CadastroAlunoModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ICadastroAluno } from '../cadastro-aluno.model';

@Component({
  standalone: true,
  selector: 'jhi-cadastro-aluno-detail',
  templateUrl: './cadastro-aluno-detail.component.html',
  imports: [CadastroAlunoModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CadastroAlunoDetailComponent {
  cadastroAluno = input<ICadastroAluno | null>(null);

  previousState(): void {
    window.history.back();
  }
}
