import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CadastroAlunoComponent } from './list/cadastro-aluno.component';
import { CadastroAlunoDetailComponent } from './detail/cadastro-aluno-detail.component';
import { CadastroAlunoUpdateComponent } from './update/cadastro-aluno-update.component';
import CadastroAlunoResolve from './route/cadastro-aluno-routing-resolve.service';

const cadastroAlunoRoute: Routes = [
  {
    path: '',
    component: CadastroAlunoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CadastroAlunoDetailComponent,
    resolve: {
      cadastroAluno: CadastroAlunoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CadastroAlunoUpdateComponent,
    resolve: {
      cadastroAluno: CadastroAlunoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CadastroAlunoUpdateComponent,
    resolve: {
      cadastroAluno: CadastroAlunoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default cadastroAlunoRoute;
