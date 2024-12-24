import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Subscription, combineLatest, filter, tap, switchMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import CadastroAlunoModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule } from '@angular/forms';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IResponsavel } from '../responsavel.model';
import { EntityArrayResponseType, ResponsavelService } from '../service/responsavel.service';
import { ResponsavelDeleteDialogComponent } from '../delete/responsavel-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-responsavel',
  templateUrl: './responsavel.component.html',
  imports: [
    RouterModule,
    FormsModule,
    CadastroAlunoModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
  ],
})
export class ResponsavelComponent implements OnInit, OnDestroy {
  private static readonly NOT_SORTABLE_FIELDS_AFTER_SEARCH = ['nome', 'parentesco'];

  responsavels?: IResponsavel[];
  isLoading = false;
  sortState = sortStateSignal({
    predicate: 'id',
    order: 'asc',
  });
  currentSearch = '';
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  private subscription: Subscription | null = null;

  constructor(
    private router: Router,
    private responsavelService: ResponsavelService,
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

  trackId = (index: number, item: IResponsavel): number => this.responsavelService.getResponsavelIdentifier(item);

  search(query: string): void {
    const { predicate } = this.sortState();
    if (query && predicate && ResponsavelComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(predicate)) {
      this.sortState.set({ predicate: 'id', order: 'asc' });
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

  delete(responsavel: IResponsavel): void {
    const modalRef = this.modalService.open(ResponsavelDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.responsavel = responsavel;
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
      const { predicate } = this.sortState();
      if (predicate && ResponsavelComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(predicate)) {
        this.sortState.set({ predicate: 'id', order: 'asc' });
      }
    }
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.responsavels = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IResponsavel[] | null): IResponsavel[] {
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
    return this.responsavelService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
