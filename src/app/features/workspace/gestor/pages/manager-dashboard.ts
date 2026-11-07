import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ManagerTicketDemoStore, ManagerTicketStatus } from '../data/manager-ticket-demo-store';
import {
  managerTicketPriorityClasses,
  managerTicketStatusClasses,
} from '../data/manager-ticket-presentation';
import { UserDemoStore } from '../data/user-demo-store';

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
  imports: [NgClass, RouterLink, PageHeading, LucideDynamicIcon],
  templateUrl: './manager-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerDashboard {
  private readonly ticketStore = inject(ManagerTicketDemoStore);
  private readonly userStore = inject(UserDemoStore);
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly statusClasses = managerTicketStatusClasses;
  protected readonly priorityClasses = managerTicketPriorityClasses;
  protected readonly tickets = this.ticketStore.tickets;

  protected readonly indicators = computed(() => {
    const tickets = this.tickets();

    return [
      {
        label: 'Violados',
        value: tickets.filter((ticket) => ticket.overdue).length,
        note: 'Prazos já vencidos',
        valueClass: 'text-danger',
      },
      {
        label: 'Aguardando triagem',
        value: tickets.filter((ticket) => ticket.status === 'ABERTO').length,
        note: 'Chamados abertos',
        valueClass: 'text-pri-d',
      },
      {
        label: 'Em atendimento',
        value: tickets.filter((ticket) => ticket.status === 'EM_ATENDIMENTO').length,
        note: 'Execução em andamento',
        valueClass: 'text-navy',
      },
      {
        label: 'Aguardando validação',
        value: tickets.filter((ticket) => ticket.status === 'RESOLVIDO').length,
        note: 'Resolvidos pelo técnico',
        valueClass: 'text-grn-t',
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

  protected readonly activeTechnicians = computed(() =>
    this.userStore
      .users()
      .filter((user) => user.role === 'Técnico' && user.situation === 'Ativo')
      .map((user) => {
        const activeTickets = user.assigned + user.inProgress;
        const loadLimit = user.workloadLimit;

        return {
          ...user,
          activeTickets,
          loadShare: loadLimit
            ? Math.min((activeTickets / loadLimit) * 100, 100)
            : activeTickets
              ? 100
              : 0,
        };
      })
      .sort((left, right) => right.activeTickets - left.activeTickets),
  );

  protected statusLabel(status: ManagerTicketStatus): string {
    return {
      ABERTO: 'Aguardando triagem',
      ATRIBUIDO: 'Atribuído',
      EM_ATENDIMENTO: 'Em atendimento',
      RESOLVIDO: 'Aguardando validação',
      CANCELADO: 'Cancelado',
      ENCERRADO: 'Encerrado',
    }[status];
  }
}
