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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonPrimary } from '@app/shared/ui/button';
import {
  currentPolicyVersion,
  DemoSlaPolicy,
  firstSlaPolicy,
  inconsistentPriorities,
  policyById,
  previousPolicyVersion,
  SLA_CLOCKS,
  SLA_POLICY_DEMOS,
  SLA_PRIORITIES,
  SlaClock,
  SlaPolicyVersion,
  SlaPriority,
  windowExample,
} from '../data/sla-policy-demo-data';

interface PolicyVersionReference {
  policy: DemoSlaPolicy;
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

function versionReferences(): readonly PolicyVersionReference[] {
  return SLA_POLICY_DEMOS.flatMap((policy) =>
    policy.versions.map((version) => ({ policy, version })),
  );
}

const ALL_VERSIONS = versionReferences();
const DEFAULT_POLICY_ID = 'policy-building';
const FALLBACK_POLICY = firstSlaPolicy();
const DEFAULT_POLICY = policyById(DEFAULT_POLICY_ID) ?? FALLBACK_POLICY;
function defaultComparison(policy: DemoSlaPolicy): PolicyVersionReference {
  const previous = previousPolicyVersion(policy, currentPolicyVersion(policy).id);
  if (previous) return { policy, version: previous };
  return (
    ALL_VERSIONS.find(({ policy: candidate }) => candidate.id !== policy.id) ?? {
      policy,
      version: currentPolicyVersion(policy),
    }
  );
}

const DEFAULT_COMPARISON = defaultComparison(DEFAULT_POLICY);
const INCONSISTENCY_EXAMPLE = ALL_VERSIONS.find(
  ({ version }) => inconsistentPriorities(version.matrix).length > 0,
);

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
  ],
  templateUrl: './manager-sla-policies.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerSlaPolicies {
  private readonly route = inject(ActivatedRoute);
  private readonly initialPolicyId =
    policyById(this.route.snapshot.queryParamMap.get('policy') ?? '')?.id ?? DEFAULT_POLICY_ID;
  protected readonly policies = SLA_POLICY_DEMOS;
  protected readonly clocks = SLA_CLOCKS;
  protected readonly priorities = SLA_PRIORITIES;
  protected readonly selectedPolicyId = signal(this.initialPolicyId);
  protected readonly selectedComparisonId = signal(DEFAULT_COMPARISON.version.id);
  protected readonly selectedPolicy = computed(
    () => policyById(this.selectedPolicyId()) ?? FALLBACK_POLICY,
  );
  protected readonly currentVersion = computed(() => currentPolicyVersion(this.selectedPolicy()));
  protected readonly comparisonOptions = computed(() =>
    ALL_VERSIONS.filter(({ version }) => version.id !== this.currentVersion().id),
  );
  protected readonly comparisonTarget = computed(
    () =>
      ALL_VERSIONS.find(({ version }) => version.id === this.selectedComparisonId()) ??
      defaultComparison(this.selectedPolicy()),
  );
  protected readonly comparisonRows = computed<readonly ComparisonRow[]>(() => {
    const current = this.currentVersion().matrix;
    const comparison = this.comparisonTarget().version.matrix;
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
  protected readonly inconsistentVersions = computed(() =>
    this.selectedPolicy()
      .versions.map((version) => ({
        version,
        priorities: inconsistentPriorities(version.matrix),
      }))
      .filter(({ priorities }) => priorities.length > 0),
  );
  protected readonly inconsistencyExample = INCONSISTENCY_EXAMPLE;

  protected onPolicyChange(event: Event): void {
    const policyId = (event.target as HTMLSelectElement).value;
    const policy = policyById(policyId);
    if (!policy) return;
    this.selectedPolicyId.set(policy.id);
    this.selectedComparisonId.set(defaultComparison(policy).version.id);
  }

  protected onComparisonChange(event: Event): void {
    this.selectedComparisonId.set((event.target as HTMLSelectElement).value);
  }

  protected compareVersion(version: SlaPolicyVersion): void {
    if (version.id === this.currentVersion().id) return;
    this.selectedComparisonId.set(version.id);
  }

  protected openInconsistencyExample(): void {
    if (!this.inconsistencyExample) return;
    this.selectedPolicyId.set(this.inconsistencyExample.policy.id);
    this.selectedComparisonId.set(this.inconsistencyExample.version.id);
  }

  protected isVersionInconsistent(version: SlaPolicyVersion): boolean {
    return inconsistentPriorities(version.matrix).length > 0;
  }

  protected versionWarning(version: SlaPolicyVersion): string {
    const priorities = inconsistentPriorities(version.matrix).map((priority) =>
      this.priorityLabel(priority),
    );
    return priorities.length ? `Ordem inconsistente · ${priorities.join(' e ')}` : '';
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
