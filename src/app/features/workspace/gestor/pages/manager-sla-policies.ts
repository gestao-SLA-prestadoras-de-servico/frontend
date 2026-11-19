import {
  ManagerTable,
  ManagerTableHead,
  ManagerTableBody,
} from '../components/manager-table.directive';
import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerPanel,
  ManagerCollection,
  ManagerSectionHeading,
  ManagerLabel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { Select } from '@app/shared/ui/input/select.directive';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { mensagemErro } from '@app/core/api/erros';
import { ButtonPrimary } from '@app/shared/ui/button';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import {
  currentPolicyVersion,
  loadSlaPolicies,
  previousPolicyVersion,
  SLA_CLOCKS,
  SLA_PRIORITIES,
  SlaClock,
  SlaPolicy,
  SlaPolicyVersion,
  SlaPriority,
  windowExample,
} from '../data/sla-policy-data';

interface PolicyVersionReference {
  policy: SlaPolicy;
  version: SlaPolicyVersion;
}

interface ComparisonRow {
  priority: SlaPriority;
  clock: SlaClock;
  label: string;
  currentMinutes: number;
  comparisonMinutes: number;
  changed: boolean;
}

@Component({
  selector: 'app-manager-sla-policies',
  imports: [
    RouterLink,
    DatePipe,
    ButtonPrimary,
    Select,
    ManagerPanel,
    ManagerCollection,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerTextAction,
    ManagerPageHeader,
    ManagerTable,
    ManagerTableHead,
    ManagerTableBody,
    WorkspaceLoadingState,
  ],
  templateUrl: './manager-sla-policies.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerSlaPolicies {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CadastroApi);
  protected readonly data = rxResource({ stream: () => loadSlaPolicies(this.api) });
  protected readonly loadError = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly policies = computed(() => this.data.value() ?? []);
  private readonly allVersions = computed<readonly PolicyVersionReference[]>(() =>
    this.policies().flatMap((policy) => policy.versions.map((version) => ({ policy, version }))),
  );
  protected readonly clocks = SLA_CLOCKS;
  protected readonly priorities = SLA_PRIORITIES;
  protected readonly selectedPolicyId = signal(this.route.snapshot.queryParamMap.get('policy'));
  protected readonly selectedComparisonId = signal<string | null>(null);
  /** Indefinida só enquanto carrega ou se não houver nenhuma política. */
  protected readonly selectedPolicy = computed<SlaPolicy | undefined>(
    () =>
      this.policies().find((policy) => policy.id === this.selectedPolicyId()) ?? this.policies()[0],
  );
  protected readonly currentVersion = computed(() => {
    const policy = this.selectedPolicy();
    return policy ? currentPolicyVersion(policy) : undefined;
  });
  protected readonly comparisonOptions = computed(() =>
    this.allVersions().filter(({ version }) => version.id !== this.currentVersion()?.id),
  );
  protected readonly comparisonTarget = computed<PolicyVersionReference | undefined>(() => {
    const options = this.comparisonOptions();
    const policy = this.selectedPolicy();
    const previous = policy && previousPolicyVersion(policy, this.currentVersion()?.id ?? '');
    return (
      options.find(({ version }) => version.id === this.selectedComparisonId()) ??
      (previous && policy ? { policy, version: previous } : options[0])
    );
  });
  protected readonly comparisonRows = computed<readonly ComparisonRow[]>(() => {
    const current = this.currentVersion()?.matrix;
    const comparison = this.comparisonTarget()?.version.matrix;
    if (!current || !comparison) return [];
    return this.priorities.flatMap((priority) =>
      this.clocks.map((clock) => {
        const currentMinutes = current[priority.key][clock.key];
        const comparisonMinutes = comparison[priority.key][clock.key];
        return {
          priority: priority.key,
          clock: clock.key,
          label: `${priority.label} · ${clock.shortLabel}`,
          currentMinutes,
          comparisonMinutes,
          changed: currentMinutes !== comparisonMinutes,
        };
      }),
    );
  });

  protected onPolicyChange(event: Event): void {
    this.selectedPolicyId.set((event.target as HTMLSelectElement).value);
    this.selectedComparisonId.set(null);
  }

  protected onComparisonChange(event: Event): void {
    this.selectedComparisonId.set((event.target as HTMLSelectElement).value);
  }

  protected compareVersion(version: SlaPolicyVersion): void {
    if (version.id === this.currentVersion()?.id) return;
    this.selectedComparisonId.set(version.id);
  }

  protected formatMinutes(minutes: number): string {
    return new Intl.NumberFormat('pt-BR').format(minutes);
  }

  protected windowCopy(minutes: number): string {
    return windowExample(minutes);
  }

  protected priorityLabel(priority: SlaPriority): string {
    return this.priorities.find((candidate) => candidate.key === priority)?.label ?? priority;
  }

  protected editLink(): readonly string[] {
    return ['/app/gestor/politicas/editar'];
  }
}
