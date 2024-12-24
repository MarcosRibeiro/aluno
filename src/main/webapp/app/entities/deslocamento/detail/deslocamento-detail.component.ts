import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import CadastroAlunoModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IDeslocamento } from '../deslocamento.model';

@Component({
  standalone: true,
  selector: 'jhi-deslocamento-detail',
  templateUrl: './deslocamento-detail.component.html',
  imports: [CadastroAlunoModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class DeslocamentoDetailComponent {
  deslocamento = input<IDeslocamento | null>(null);

  previousState(): void {
    window.history.back();
  }
}
