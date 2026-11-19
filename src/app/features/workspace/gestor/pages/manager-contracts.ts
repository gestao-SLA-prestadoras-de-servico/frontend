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
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map } from 'rxjs';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { mensagemErro } from '@app/core/api/erros';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import {
  Contract,
  ContractStore,
  ContractTerm,
  contractTerm,
  toContract,
  todayIso,
} from '../data/contract-store';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';

type TermFilter = 'all' | ContractTerm;

interface ContractRow {
  contract: Contract;
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
    WorkspaceLoadingState,
  ],
  templateUrl: './manager-contracts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerContracts {
  private readonly injector = inject(Injector);
  private readonly store = inject(ContractStore);
  private readonly api = inject(CadastroApi);
  private readonly detailsDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('detailsDialog');
  private readonly closeDetailsButton =
    viewChild<ElementRef<HTMLButtonElement>>('closeDetailsButton');
  private readonly noticeTarget = viewChild<ElementRef<HTMLElement>>('noticeTarget');
  private detailsTrigger?: HTMLButtonElement;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly today = todayIso();
  protected readonly ready = signal(false);
  protected readonly query = signal('');
  protected readonly filter = signal<TermFilter>('all');
  protected readonly selectedContract = signal<Contract | null>(null);
  protected readonly data = rxResource({
    stream: () =>
      forkJoin({
        contratos: this.api.contratos({ sort: 'codigo,asc' }),
        clientes: this.api.clientes(),
        politicas: this.api.politicas(),
      }).pipe(
        map(({ contratos, clientes, politicas }) => ({
          contracts: contratos.map(toContract),
          companies: new Map(clientes.map((c) => [c.id, c.razaoSocial])),
          policies: politicas,
        })),
      ),
  });
  protected readonly loadError = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly policies = computed(() => this.data.value()?.policies ?? []);
  protected readonly contracts = computed(() => this.data.value()?.contracts ?? []);
  protected readonly notice = this.store.notice;
  protected readonly linkPolicyId = signal('');
  protected readonly linking = signal(false);
  protected readonly linkError = signal<string | null>(null);
  protected readonly rows = computed<readonly ContractRow[]>(() =>
    this.contracts().map((contract) => {
      const policy = this.policies().find((p) => p.id === contract.policyId);
      return {
        contract,
        companyName: this.companyName(contract.companyId),
        policyCode: policy ? `v${policy.versaoAtual.numero}` : 'Sem política',
        policyName: policy?.nome ?? 'Chamados bloqueados até vincular',
        term: contractTerm(contract),
      };
    }),
  );
  protected readonly filteredRows = computed(() => {
    const term = normalize(this.query());
    const selectedTerm = this.filter();
    return this.rows().filter((row) => {
      const haystack = normalize(
        [row.contract.code, row.companyName, row.policyCode, row.policyName].join(' '),
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

  protected openDetails(contract: Contract, trigger: HTMLButtonElement): void {
    if (!this.ready()) return;
    this.detailsTrigger = trigger;
    this.selectedContract.set(contract);
    this.linkPolicyId.set(contract.policyId ?? this.policies()[0]?.id ?? '');
    this.linkError.set(null);
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

  protected companyName(id: string): string {
    return this.data.value()?.companies.get(id) ?? 'Empresa indisponível';
  }

  protected policyName(id: string | null): string {
    const policy = this.policies().find((p) => p.id === id);
    return policy ? `${policy.nome} · v${policy.versaoAtual.numero}` : 'Sem política vinculada';
  }

  protected onLinkPolicyChange(event: Event): void {
    this.linkPolicyId.set((event.target as HTMLSelectElement).value);
  }

  /** Vincula ou troca a política; chamados novos passam a usar a versão vigente dela. */
  protected linkPolicy(): void {
    const contract = this.selectedContract();
    const policyId = this.linkPolicyId();
    if (!contract || !policyId || this.linking()) return;
    this.linking.set(true);
    this.linkError.set(null);
    this.api.vincularPolitica(contract.id, policyId).subscribe({
      next: (contrato) => {
        this.linking.set(false);
        this.selectedContract.set(toContract(contrato));
        this.data.reload();
      },
      error: (erro: unknown) => {
        this.linking.set(false);
        this.linkError.set(mensagemErro(erro));
      },
    });
  }

  protected termLabel(term: ContractTerm): string {
    if (term === 'current') return 'Vigente';
    if (term === 'future') return 'Futuro';
    return 'Vencido';
  }

  protected contractTermLabel(contract: Contract): string {
    return this.termLabel(contractTerm(contract));
  }
}
