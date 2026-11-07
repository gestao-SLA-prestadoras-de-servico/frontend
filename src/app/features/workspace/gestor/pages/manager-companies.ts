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
import { Textarea } from '@app/shared/ui/input/textarea.directive';
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
import { CompanyDemoStore, CompanySituation, DemoCompany } from '../data/company-demo-store';
import {
  COMPANY_FIELD_ERRORS,
  CompanyField,
  createCompanyForm,
  firstInvalidCompanyField,
} from '../data/company-form';
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
    Textarea,
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
  ],
  templateUrl: './manager-companies.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerCompanies {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly store = inject(CompanyDemoStore);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('companyDialog');
  private readonly editName = viewChild<ElementRef<HTMLInputElement>>('editName');
  private readonly cancelAction = viewChild<ElementRef<HTMLButtonElement>>('cancelAction');
  private readonly noticeTarget = viewChild<ElementRef<HTMLElement>>('noticeTarget');
  private trigger?: HTMLButtonElement;
  private completing = false;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly companies = this.store.companies;
  protected readonly notice = this.store.notice;
  protected readonly search = signal('');
  protected readonly filter = signal<CompanyFilter>('all');
  protected readonly ready = signal(false);
  protected readonly dialogMode = signal<DialogMode>(null);
  protected readonly selectedCompany = signal<DemoCompany | null>(null);
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

  protected invalid(field: CompanyField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected openEdit(company: DemoCompany, trigger: HTMLButtonElement): void {
    if (!this.ready()) return;
    this.trigger = trigger;
    this.completing = false;
    this.dialogMode.set('edit');
    this.selectedCompany.set(company);
    this.submitted.set(false);
    this.form.reset({
      legalName: company.legalName,
      contactEmail: company.contactEmail,
      address: company.address,
    });
    afterNextRender(
      () => {
        if (this.dialogMode() !== 'edit' || this.dialog().nativeElement.open) return;
        this.dialog().nativeElement.showModal();
        this.editName()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected openDeactivate(company: DemoCompany, trigger: HTMLButtonElement): void {
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

    const updated = this.store.update(company.id, this.form.getRawValue());
    if (!updated) {
      this.store.setNotice({
        tone: 'error',
        title: 'Não foi possível atualizar a empresa',
        detail: 'Feche o diálogo, atualize a lista e tente novamente.',
      });
    } else {
      this.store.setNotice({
        tone: 'success',
        title: 'Edição demonstrativa concluída',
        detail: 'Os dados foram atualizados somente nesta sessão, sem envio ou persistência.',
      });
    }
    this.finishDialogAndFocusNotice();
  }

  protected confirmDeactivation(): void {
    const company = this.selectedCompany();
    if (!company || this.dialogMode() !== 'deactivate') return;
    const updated = this.store.deactivate(company.id);
    this.store.setNotice(
      updated
        ? {
            tone: 'success',
            title: 'Inativação demonstrativa concluída',
            detail:
              'A situação foi alterada somente na lista desta sessão. Nenhum cadastro real foi alterado.',
          }
        : {
            tone: 'error',
            title: 'Não foi possível inativar a empresa',
            detail: 'Feche o diálogo, atualize a lista e tente novamente.',
          },
    );
    this.finishDialogAndFocusNotice();
  }

  private finishDialogAndFocusNotice(): void {
    this.completing = true;
    this.closeDialog();
    afterNextRender(() => this.noticeTarget()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }
}
