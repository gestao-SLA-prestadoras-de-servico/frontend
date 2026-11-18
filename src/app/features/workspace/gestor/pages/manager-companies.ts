import {
  ManagerTable,
  ManagerTableHead,
  ManagerTableBody,
} from '../components/manager-table.directive';
import { ManagerEmptyState } from '../components/manager-empty-state';
import { ManagerMetricCard } from '../components/manager-metric-card';
import { ManagerStatusBadge } from '../components/manager-status-badge';
import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerCollection,
  ManagerDialog,
  ManagerSectionHeading,
  ManagerLabel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { Select } from '@app/shared/ui/input/select.directive';
import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { Input } from '@app/shared/ui/input/input.directive';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { mensagemErro, problema } from '@app/core/api/erros';
import { Company, CompanySituation, CompanyStore, toCompany } from '../data/company-store';
import {
  COMPANY_FIELD_ERRORS,
  companyFormValue,
  createCompanyForm,
  firstInvalidCompanyField,
  toDadosCliente,
} from '../data/company-form';
import { ManagerAddressFields } from '../components/manager-address-fields';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';

type CompanyFilter = 'all' | CompanySituation;
type DialogMode = 'edit' | 'deactivate' | null;

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

@Component({
  selector: 'app-manager-companies',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonPrimary,
    ButtonSecondary,
    Input,
    LucideDynamicIcon,
    Select,
    ManagerCollection,
    ManagerDialog,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerTextAction,
    ManagerPageHeader,
    ManagerStatusBadge,
    ManagerMetricCard,
    ManagerEmptyState,
    ManagerTable,
    ManagerTableHead,
    ManagerTableBody,
    ManagerAddressFields,
    WorkspaceLoadingState,
  ],
  templateUrl: './manager-companies.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerCompanies {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly store = inject(CompanyStore);
  private readonly api = inject(CadastroApi);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('companyDialog');
  private readonly editName = viewChild<ElementRef<HTMLInputElement>>('editName');
  private readonly cancelAction = viewChild<ElementRef<HTMLButtonElement>>('cancelAction');
  private readonly noticeTarget = viewChild<ElementRef<HTMLElement>>('noticeTarget');
  private trigger?: HTMLButtonElement;
  private completing = false;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly data = rxResource({
    stream: () =>
      this.api
        .clientes({ sort: 'razaoSocial,asc' })
        .pipe(map((clientes) => clientes.map(toCompany))),
  });
  protected readonly loadError = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly companies = computed(() => this.data.value() ?? []);
  protected readonly busy = signal(false);
  protected readonly notice = this.store.notice;
  protected readonly search = signal('');
  protected readonly filter = signal<CompanyFilter>('all');
  protected readonly ready = signal(false);
  protected readonly dialogMode = signal<DialogMode>(null);
  protected readonly selectedCompany = signal<Company | null>(null);
  protected readonly submitted = signal(false);
  protected readonly form = createCompanyForm();
  protected readonly fieldErrors = COMPANY_FIELD_ERRORS;
  protected readonly filteredCompanies = computed(() => {
    const term = normalize(this.search());
    const situation = this.filter();
    return this.companies().filter((company) => {
      const matchesTerm =
        !term ||
        normalize(`${company.legalName} ${company.contactEmail} ${company.address}`).includes(term);
      const matchesSituation = situation === 'all' || company.situation === situation;
      return matchesTerm && matchesSituation;
    });
  });
  protected readonly activeCompanies = computed(
    () => this.companies().filter((company) => company.situation === 'active').length,
  );
  protected readonly inactiveCompanies = computed(
    () => this.companies().filter((company) => company.situation === 'inactive').length,
  );

  constructor() {
    afterNextRender(() => {
      this.ready.set(true);
      if (this.notice()) this.noticeTarget()?.nativeElement.focus();
    });
  }

  protected updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected updateFilter(event: Event): void {
    this.filter.set((event.target as HTMLSelectElement).value as CompanyFilter);
  }

  protected clearSearchAndFilter(): void {
    this.search.set('');
    this.filter.set('all');
    this.document.getElementById('company-search')?.focus();
  }

  protected clearNotice(): void {
    this.store.setNotice(null);
  }

  protected invalid(field: 'legalName' | 'contactEmail'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected openEdit(company: Company, trigger: HTMLButtonElement): void {
    if (!this.ready()) return;
    this.trigger = trigger;
    this.completing = false;
    this.dialogMode.set('edit');
    this.selectedCompany.set(company);
    this.submitted.set(false);
    this.form.reset(companyFormValue(company.endereco, company.legalName, company.contactEmail));
    afterNextRender(
      () => {
        if (this.dialogMode() !== 'edit' || this.dialog().nativeElement.open) return;
        this.dialog().nativeElement.showModal();
        this.editName()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected openDeactivate(company: Company, trigger: HTMLButtonElement): void {
    if (!this.ready() || company.situation === 'inactive') return;
    this.trigger = trigger;
    this.completing = false;
    this.dialogMode.set('deactivate');
    this.selectedCompany.set(company);
    afterNextRender(
      () => {
        if (this.dialogMode() !== 'deactivate' || this.dialog().nativeElement.open) return;
        this.dialog().nativeElement.showModal();
        this.cancelAction()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected closeDialog(): void {
    if (this.dialog().nativeElement.open) this.dialog().nativeElement.close();
  }

  protected onDialogClose(): void {
    if (!this.completing) this.trigger?.focus();
    this.trigger = undefined;
    this.completing = false;
    this.dialogMode.set(null);
    this.selectedCompany.set(null);
  }

  protected onBackdrop(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      this.closeDialog();
    }
  }

  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.dialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href], select:not([disabled]), textarea',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = this.document.activeElement;
    if ((event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }

  protected submitEdit(): void {
    const company = this.selectedCompany();
    if (!company || this.dialogMode() !== 'edit') return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const field = firstInvalidCompanyField(this.form);
      if (field) this.document.getElementById(`edit-company-${field}`)?.focus();
      return;
    }

    this.save(this.api.editarCliente(company.id, company.version, toDadosCliente(this.form)), {
      title: 'Empresa atualizada',
      detail: `Os dados de ${this.form.controls.legalName.value.trim()} foram salvos.`,
    });
  }

  protected confirmDeactivation(): void {
    const company = this.selectedCompany();
    if (!company || this.dialogMode() !== 'deactivate') return;
    this.save(this.api.inativarCliente(company.id), {
      title: 'Empresa inativada',
      detail: `${company.legalName} não aceita mais novos usuários nem contratos.`,
    });
  }

  private save(request: Observable<unknown>, success: { title: string; detail: string }): void {
    if (this.busy()) return;
    this.busy.set(true);
    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.store.setNotice({ tone: 'success', ...success });
        this.data.reload();
        this.finishDialogAndFocusNotice();
      },
      error: (erro: unknown) => {
        this.busy.set(false);
        this.store.setNotice({
          tone: 'error',
          title: 'Não foi possível salvar',
          detail: mensagemErro(erro),
        });
        // Conflito de versão: os dados mudaram; recarrega e fecha para o gestor reabrir.
        if (problema(erro)?.codigo === 'CONFLITO_VERSAO') this.data.reload();
        this.finishDialogAndFocusNotice();
      },
    });
  }

  private finishDialogAndFocusNotice(): void {
    this.completing = true;
    this.closeDialog();
    afterNextRender(() => this.noticeTarget()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }
}
