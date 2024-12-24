import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import CadastroAlunoModule from 'app/shared/shared.module';

import { User } from '../user-management.model';

@Component({
  standalone: true,
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './user-management-detail.component.html',
  imports: [RouterModule, CadastroAlunoModule],
})
export default class UserManagementDetailComponent {
  user = input<User | null>(null);
}
