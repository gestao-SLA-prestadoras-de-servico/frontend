import {
  ManagerTable,
  ManagerTableHead,
  ManagerTableBody,
} from '../components/manager-table.directive';
import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerPanel,
  ManagerSectionHeading,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { ButtonPrimary } from '@app/shared/ui/button';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ManagerTicketDemoStore, ManagerTicketStatus } from '../data/manager-ticket-demo-store';
import { ManagerActivityChart } from '../components/manager-activity-chart';
import { ManagerMetricCard } from '../components/manager-metric-card';
import { ManagerSlaHealth } from '../components/manager-sla-health';
import { ManagerTeamWorkload } from '../components/manager-team-workload';
import { ManagerTicketBadge } from '../components/manager-ticket-badge';
import { ManagerTicketClocks } from '../components/manager-ticket-clocks';

const NON_FINAL_STATUSES: readonly ManagerTicketStatus[] = [
  'ABERTO',
  'ATRIBUIDO',
  'EM_ATENDIMENTO',
  'RESOLVIDO',
];

const MONTHLY_SLA_SAMPLE = [
  { label: 'Resposta', fulfilled: 54, violated: 2 },
  { label: 'Atendimento em campo', fulfilled: 51, violated: 5 },
  { label: 'Resolução', fulfilled: 49, violated: 7 },
].map((metric) => {
  const total = metric.fulfilled + metric.violated;

  return {
    ...metric,
    total,
    percentage: Math.round((metric.fulfilled / total) * 100),
  };
});

@Component({
  selector: 'app-manager-dashboard',
  imports: [
    RouterLink,
    LucideDynamicIcon,
    ManagerActivityChart,
    ManagerMetricCard,
    ManagerSlaHealth,
    ManagerTeamWorkload,
    ManagerTicketBadge,
    ManagerTicketClocks,
    ButtonPrimary,
    ManagerPanel,
    ManagerSectionHeading,
    ManagerTextAction,
    ManagerPageHeader,
    ManagerTable,
    ManagerTableHead,
    ManagerTableBody,
  ],
  templateUrl: './manager-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerDashboard {
  private readonly ticketStore = inject(ManagerTicketDemoStore);
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly tickets = this.ticketStore.tickets;

  protected readonly indicators = computed(() => {
    const tickets = this.tickets();

    return [
      {
        label: 'Violados',
        value: tickets.filter((ticket) => ticket.overdue).length,
        note: 'Prazos já vencidos',
        icon: 'violated' as const,
        tone: 'danger' as const,
      },
      {
        label: 'Aguardando triagem',
        value: tickets.filter((ticket) => ticket.status === 'ABERTO').length,
        note: 'Chamados abertos',
        icon: 'triage' as const,
        tone: 'blue' as const,
      },
      {
        label: 'Em atendimento',
        value: tickets.filter((ticket) => ticket.status === 'EM_ATENDIMENTO').length,
        note: 'Execução em andamento',
        icon: 'service' as const,
        tone: 'blue' as const,
      },
      {
        label: 'Aguardando validação',
        value: tickets.filter((ticket) => ticket.status === 'RESOLVIDO').length,
        note: 'Resolvidos pelo técnico',
        icon: 'validation' as const,
        tone: 'green' as const,
      },
    ];
  });

  protected readonly attentionTickets = computed(() =>
    this.tickets()
      .filter((ticket) => NON_FINAL_STATUSES.includes(ticket.status))
      .sort((left, right) => Number(right.overdue) - Number(left.overdue)),
  );

  protected readonly statusBreakdown = computed(() => {
    const tickets = this.tickets().filter((ticket) => NON_FINAL_STATUSES.includes(ticket.status));
    const states: readonly { status: ManagerTicketStatus; label: string }[] = [
      { status: 'ABERTO', label: 'Aguardando triagem' },
      { status: 'ATRIBUIDO', label: 'Atribuído' },
      { status: 'EM_ATENDIMENTO', label: 'Em atendimento' },
      { status: 'RESOLVIDO', label: 'Aguardando validação' },
    ];

    return states.map(({ status, label }) => {
      const count = tickets.filter((ticket) => ticket.status === status).length;

      return {
        status,
        label,
        count,
        share: tickets.length ? (count / tickets.length) * 100 : 0,
      };
    });
  });

  protected readonly nonFinalizedCount = computed(
    () => this.tickets().filter((ticket) => NON_FINAL_STATUSES.includes(ticket.status)).length,
  );

  protected readonly monthlySla = MONTHLY_SLA_SAMPLE;

  protected readonly violatedCount = computed(
    () => this.attentionTickets().filter((ticket) => ticket.overdue).length,
  );
}
