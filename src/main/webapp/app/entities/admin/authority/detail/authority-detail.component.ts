import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import CadastroAlunoModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IAuthority } from '../authority.model';

@Component({
  standalone: true,
  selector: 'jhi-authority-detail',
  templateUrl: './authority-detail.component.html',
  imports: [CadastroAlunoModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AuthorityDetailComponent {
  authority = input<IAuthority | null>(null);

  previousState(): void {
    window.history.back();
  }
}
