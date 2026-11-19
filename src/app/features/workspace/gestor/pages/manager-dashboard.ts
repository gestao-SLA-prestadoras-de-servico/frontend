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
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro } from '@app/core/api/erros';
import { UsuariosApi } from '@app/core/api/usuarios.api';
import { loadManagerTickets, ManagerTicketStatus } from '../data/manager-ticket';
import { ManagerActivityChart } from '../components/manager-activity-chart';
import { ManagerMetricCard } from '../components/manager-metric-card';
import { ManagerSlaHealth } from '../components/manager-sla-health';
import { ManagerTeamWorkload } from '../components/manager-team-workload';
import { ManagerTicketBadge } from '../components/manager-ticket-badge';
import { ManagerTicketClocks } from '../components/manager-ticket-clocks';
import { MANAGER_REPORT_SAMPLE } from '../data/manager-report-demo-data';
import { ManagerSlaSummary } from '../components/manager-sla-summary';

const NON_FINAL_STATUSES: readonly ManagerTicketStatus[] = [
  'ABERTO',
  'ATRIBUIDO',
  'EM_ATENDIMENTO',
  'RESOLVIDO',
];

@Component({
  selector: 'app-manager-dashboard',
  imports: [
    DatePipe,
    RouterLink,
    LucideDynamicIcon,
    ManagerActivityChart,
    ManagerMetricCard,
    ManagerSlaSummary,
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
  private readonly chamados = inject(ChamadosApi);
  private readonly usuarios = inject(UsuariosApi);
  private readonly cadastro = inject(CadastroApi);
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly data = rxResource({
    stream: () => loadManagerTickets(this.chamados, this.usuarios, this.cadastro),
  });
  protected readonly loadError = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly tickets = computed(() => this.data.value() ?? []);

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
      // Violados primeiro; depois o que vence antes.
      .sort(
        (left, right) =>
          Number(right.overdue) - Number(left.overdue) ||
          (left.nextDeadline ?? '9').localeCompare(right.nextDeadline ?? '9'),
      ),
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

  protected readonly monthlyReport = MANAGER_REPORT_SAMPLE;

  protected readonly violatedCount = computed(
    () => this.attentionTickets().filter((ticket) => ticket.overdue).length,
  );
}
