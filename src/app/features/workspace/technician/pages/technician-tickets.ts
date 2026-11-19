import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro } from '@app/core/api/erros';
import { ChamadoTecnico } from '@app/core/api/modelos';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import { statusLabels } from '../components/technician-ticket-badges';
import { TechnicianTicketCard } from '../components/technician-ticket-card';
import { TechnicianPriority, TechnicianStatus, toTechnicianTicket } from '../technician-data';

type StatusFilter = TechnicianStatus | 'ATIVOS' | 'TODOS';
const ATIVOS: readonly TechnicianStatus[] = ['ATRIBUIDO', 'EM_ATENDIMENTO'];

@Component({
  selector: 'app-technician-tickets',
  imports: [TechnicianTicketCard, PageHeading, WorkspaceLoadingState],
  templateUrl: './technician-tickets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TechnicianTickets {
  private readonly api = inject(ChamadosApi);
  protected readonly data = rxResource({
    stream: () =>
      this.api
        .listarTodos<ChamadoTecnico>({ sort: 'proximoVencimento,asc' })
        .pipe(map((chamados) => chamados.map((c) => toTechnicianTicket(c)))),
  });
  protected readonly erro = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  private readonly tickets = computed(() => this.data.value() ?? []);
  protected readonly statusFilter = signal<StatusFilter>('ATIVOS');
  protected readonly priorityFilter = signal<TechnicianPriority | 'TODAS'>('TODAS');
  protected readonly visibleTickets = computed(() =>
    this.tickets().filter(
      (ticket) =>
        (this.statusFilter() === 'TODOS' ||
          (this.statusFilter() === 'ATIVOS'
            ? ATIVOS.includes(ticket.status)
            : ticket.status === this.statusFilter())) &&
        (this.priorityFilter() === 'TODAS' || ticket.priority === this.priorityFilter()),
    ),
  );
  protected readonly assignedCount = computed(
    () => this.tickets().filter((ticket) => ticket.status === 'ATRIBUIDO').length,
  );
  protected readonly activeCount = computed(
    () => this.tickets().filter((ticket) => ticket.status === 'EM_ATENDIMENTO').length,
  );

  protected readonly statuses: readonly { value: StatusFilter; label: string }[] = [
    { value: 'ATIVOS', label: 'Em aberto' },
    { value: 'ATRIBUIDO', label: statusLabels.ATRIBUIDO },
    { value: 'EM_ATENDIMENTO', label: statusLabels.EM_ATENDIMENTO },
    { value: 'RESOLVIDO', label: statusLabels.RESOLVIDO },
    { value: 'ENCERRADO', label: statusLabels.ENCERRADO },
    { value: 'TODOS', label: 'Todos os estados' },
  ];
  protected readonly priorities: readonly { value: TechnicianPriority | 'TODAS'; label: string }[] =
    [
      { value: 'TODAS', label: 'Todas as prioridades' },
      { value: 'Alta', label: 'Alta' },
      { value: 'Normal', label: 'Normal' },
    ];

  protected setStatus(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as StatusFilter);
  }

  protected setPriority(event: Event): void {
    this.priorityFilter.set(
      (event.target as HTMLSelectElement).value as TechnicianPriority | 'TODAS',
    );
  }

  protected clearFilters(): void {
    this.statusFilter.set('ATIVOS');
    this.priorityFilter.set('TODAS');
  }

  protected readonly filtersActive = computed(
    () => this.statusFilter() !== 'ATIVOS' || this.priorityFilter() !== 'TODAS',
  );
}
