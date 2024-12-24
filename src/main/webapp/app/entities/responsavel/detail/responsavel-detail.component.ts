import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import CadastroAlunoModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IResponsavel } from '../responsavel.model';

@Component({
  standalone: true,
  selector: 'jhi-responsavel-detail',
  templateUrl: './responsavel-detail.component.html',
  imports: [CadastroAlunoModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ResponsavelDetailComponent {
  responsavel = input<IResponsavel | null>(null);

  previousState(): void {
    window.history.back();
  }
}
