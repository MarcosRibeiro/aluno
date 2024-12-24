import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Subscription, combineLatest, filter, tap, switchMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule } from '@angular/forms';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ICadastroAluno } from '../cadastro-aluno.model';
import { CadastroAlunoService, EntityArrayResponseType } from '../service/cadastro-aluno.service';
import { CadastroAlunoDeleteDialogComponent } from '../delete/cadastro-aluno-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-cadastro-aluno',
  templateUrl: './cadastro-aluno.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
  ],
})
export class CadastroAlunoComponent implements OnInit, OnDestroy {
  private static readonly NOT_SORTABLE_FIELDS_AFTER_SEARCH = [
    'matricula',
    'grupo',
    'nome',
    'cep',
    'endereco',
    'qd',
    'lote',
    'endnumero',
    'bairro',
    'municipio',
    'uf',
    'fone',
    'certidao',
    'termo',
    'cartorio',
    'naturalidade',
    'rg',
    'cpf',
    'nis',
    'cras',
    'filiacaoPai',
    'paiTelefone',
    'paiNaturalidade',
    'paiUf',
    'paiRg',
    'paiCpf',
    'paiNis',
    'paiTituloEleitor',
    'paiZona',
    'paiSecao',
    'paiMunicipio',
    'filiacaoMae',
    'maeTelefone',
    'maeNaturalidade',
    'maeUf',
    'maeRg',
    'maeCpf',
    'maeNis',
    'maeTituloEleitor',
    'maeZona',
    'maeSecao',
    'maeMunicipio',
    'nomeEscola',
    'anoCursando',
    'turno',
    'prioritario',
    'obs',
    'comportamentoCasa',
    'comportamentoEscola',
    'deficiencia',
    'adaptacoes',
    'medicacao',
    'medicacaoDesc',
    'alergia',
    'alergiaDesc',
    'historicoMedico',
    'rendaFamiliar',
    'beneficioSocial',
    'beneficios',
    'tipoResidencia',
    'tipoResidenciaDesc',
    'situacaoResidencia',
    'situacaoResidenciaDesc',
    'contatoEmergencia',
    'foneEmergencia',
    'relacaoEmergencia',
    'fotoAluno',
    'fotoAlunoContentType',
    'fotoMae',
    'fotoMaeContentType',
  ];

  cadastroAlunos?: ICadastroAluno[];
  isLoading = false;
  sortState = sortStateSignal({
    predicate: 'id',
    ascending: true,
  });
  currentSearch = '';
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  private subscription: Subscription | null = null;

  constructor(
    private router: Router,
    private cadastroAlunoService: CadastroAlunoService,
    private activatedRoute: ActivatedRoute,
    private sortService: SortService,
    private modalService: NgbModal,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  trackId = (index: number, item: ICadastroAluno): number => this.cadastroAlunoService.getCadastroAlunoIdentifier(item);

  search(query: string): void {
    if (query && CadastroAlunoComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(this.sortState().predicate)) {
      this.sortState.set({ predicate: 'id', ascending: true });
    }
    this.page = 1;
    this.currentSearch = query;
    this.navigateToWithComponentValues();
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  delete(cadastroAluno: ICadastroAluno): void {
    const modalRef = this.modalService.open(CadastroAlunoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cadastroAluno = cadastroAluno;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.sortState(), this.currentSearch);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState(), this.currentSearch);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA] ?? 'id,desc').split(',');
    this.sortState.set({
      predicate: sort[0],
      ascending: sort[1] === 'asc',
    });
    if (params.has('search') && params.get('search') !== '') {
      this.currentSearch = params.get('search') as string;
      if (CadastroAlunoComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(this.sortState().predicate)) {
        this.sortState.set({ predicate: 'id', ascending: true });
      }
    }
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.cadastroAlunos = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: ICadastroAluno[] | null): ICadastroAluno[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.sortState(), this.currentSearch)),
    );
  }

  protected queryBackend(page?: number, sortState?: SortState, currentSearch?: string): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      query: currentSearch,
      sort: this.sortService.buildSortParam(sortState),
    };
    return this.cadastroAlunoService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, sortState: SortState = this.sortState(), currentSearch = this.currentSearch): void {
    const queryParamsObj = {
      search: currentSearch,
      page,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
