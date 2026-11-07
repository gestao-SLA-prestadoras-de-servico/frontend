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
import { DatePipe } from '@angular/common';
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
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary } from '@app/shared/ui/button';
import { Input } from '@app/shared/ui/input/input.directive';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import { CompanyDemoStore } from '../data/company-demo-store';
import {
  ContractDemoStore,
  ContractTerm,
  DemoContract,
  policyById,
  contractTerm,
} from '../data/contract-demo-store';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';

type TermFilter = 'all' | ContractTerm;

interface ContractRow {
  contract: DemoContract;
  companyName: string;
  policyCode: string;
  policyName: string;
  term: ContractTerm;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

@Component({
  selector: 'app-manager-contracts',
  imports: [
    RouterLink,
    ButtonPrimary,
    Input,
    DatePipe,
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
  ],
  templateUrl: './manager-contracts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerContracts {
  private readonly injector = inject(Injector);
  private readonly companiesStore = inject(CompanyDemoStore);
  private readonly store = inject(ContractDemoStore);
  private readonly detailsDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('detailsDialog');
  private readonly closeDetailsButton =
    viewChild<ElementRef<HTMLButtonElement>>('closeDetailsButton');
  private readonly noticeTarget = viewChild<ElementRef<HTMLElement>>('noticeTarget');
  private detailsTrigger?: HTMLButtonElement;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly ready = signal(false);
  protected readonly query = signal('');
  protected readonly filter = signal<TermFilter>('all');
  protected readonly selectedContract = signal<DemoContract | null>(null);
  protected readonly companies = this.companiesStore.companies;
  protected readonly contracts = this.store.contracts;
  protected readonly notice = this.store.notice;
  protected readonly rows = computed<readonly ContractRow[]>(() =>
    this.contracts().map((contract) => {
      const company = this.companies().find((candidate) => candidate.id === contract.companyId);
      const policy = policyById(contract.policyId);
      return {
        contract,
        companyName: company?.legalName ?? 'Empresa indisponível',
        policyCode: policy?.code ?? 'Política indisponível',
        policyName: policy?.name ?? 'Política indisponível',
        term: contractTerm(contract),
      };
    }),
  );
  protected readonly filteredRows = computed(() => {
    const term = normalize(this.query());
    const selectedTerm = this.filter();
    return this.rows().filter((row) => {
      const haystack = normalize(
        [row.contract.id, row.companyName, row.policyCode, row.policyName].join(' '),
      );
      return (
        (!term || haystack.includes(term)) && (selectedTerm === 'all' || row.term === selectedTerm)
      );
    });
  });
  protected readonly currentCount = computed(
    () => this.rows().filter((row) => row.term === 'current').length,
  );
  protected readonly futureCount = computed(
    () => this.rows().filter((row) => row.term === 'future').length,
  );
  protected readonly expiredCount = computed(
    () => this.rows().filter((row) => row.term === 'expired').length,
  );

  constructor() {
    afterNextRender(() => {
      this.ready.set(true);
      if (this.notice()) this.noticeTarget()?.nativeElement.focus();
    });
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected updateFilter(event: Event): void {
    this.filter.set((event.target as HTMLSelectElement).value as TermFilter);
  }

  protected clearFilters(): void {
    this.query.set('');
    this.filter.set('all');
  }

  protected clearNotice(): void {
    this.store.setNotice(null);
  }

  protected openDetails(contract: DemoContract, trigger: HTMLButtonElement): void {
    if (!this.ready()) return;
    this.detailsTrigger = trigger;
    this.selectedContract.set(contract);
    afterNextRender(
      () => {
        if (!this.selectedContract() || this.detailsDialog().nativeElement.open) return;
        this.detailsDialog().nativeElement.showModal();
        this.closeDetailsButton()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected closeDetails(): void {
    if (this.detailsDialog().nativeElement.open) this.detailsDialog().nativeElement.close();
  }

  protected onDetailsClose(): void {
    this.detailsTrigger?.focus();
    this.detailsTrigger = undefined;
    this.selectedContract.set(null);
  }

  protected onDetailsBackdrop(event: MouseEvent): void {
    const dialog = this.detailsDialog().nativeElement;
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      this.closeDetails();
    }
  }

  protected trapDetailsFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.detailsDialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = this.detailsDialog().nativeElement.ownerDocument.activeElement;
    if ((event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }

  protected companyName(id: number): string {
    return (
      this.companies().find((company) => company.id === id)?.legalName ?? 'Empresa indisponível'
    );
  }

  protected policyName(id: string): string {
    const policy = policyById(id);
    return policy ? policy.code + ' · ' + policy.name : 'Política indisponível';
  }

  protected termLabel(term: ContractTerm): string {
    if (term === 'current') return 'Vigente';
    if (term === 'future') return 'Futuro';
    return 'Vencido';
  }

  protected contractTermLabel(contract: DemoContract): string {
    return this.termLabel(contractTerm(contract));
  }
}
