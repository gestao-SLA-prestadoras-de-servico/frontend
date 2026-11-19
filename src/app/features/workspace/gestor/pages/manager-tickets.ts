import {
  ManagerTable,
  ManagerTableHead,
  ManagerTableBody,
} from '../components/manager-table.directive';
import { ManagerEmptyState } from '../components/manager-empty-state';
import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerCollection,
  ManagerSectionHeading,
  ManagerLabel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { Select } from '@app/shared/ui/input/select.directive';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { rxResource } from '@angular/core/rxjs-interop';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro } from '@app/core/api/erros';
import { UsuariosApi } from '@app/core/api/usuarios.api';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import {
  loadManagerTickets,
  ManagerTicketPriority,
  ManagerTicketStatus,
} from '../data/manager-ticket';
import { ManagerTicketBadge } from '../components/manager-ticket-badge';
import { ManagerTicketClocks } from '../components/manager-ticket-clocks';
import { ManagerMetricCard } from '../components/manager-metric-card';

type TicketFilter = 'Todas' | ManagerTicketStatus;
type PriorityFilter = 'Todas' | ManagerTicketPriority;

@Component({
  selector: 'app-manager-tickets',
  imports: [
    DatePipe,
    RouterLink,
    LucideDynamicIcon,
    ManagerTicketBadge,
    ManagerTicketClocks,
    ManagerMetricCard,
    Select,
    ManagerCollection,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerTextAction,
    ManagerPageHeader,
    ManagerEmptyState,
    ManagerTable,
    ManagerTableHead,
    ManagerTableBody,
    WorkspaceLoadingState,
  ],
  templateUrl: './manager-tickets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerTickets {
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
  protected readonly allTickets = computed(() => this.data.value() ?? []);
  protected readonly clientFilter = signal('Todas');
  protected readonly technicianFilter = signal('Todos');
  protected readonly statusFilter = signal<TicketFilter>('Todas');
  protected readonly priorityFilter = signal<PriorityFilter>('Todas');
  protected readonly clients = computed(() =>
    [...new Set(this.allTickets().map((ticket) => ticket.client))].sort(),
  );
  protected readonly technicians = computed(() =>
    [
      ...new Set(
        this.allTickets()
          .map((ticket) => ticket.technician)
          .filter((name): name is string => !!name),
      ),
    ].sort(),
  );
  protected readonly filteredTickets = computed(() => {
    const client = this.clientFilter();
    const technician = this.technicianFilter();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    return this.allTickets().filter(
      (ticket) =>
        (client === 'Todas' || ticket.client === client) &&
        (technician === 'Todos' || ticket.technician === technician) &&
        (status === 'Todas' || ticket.status === status) &&
        (priority === 'Todas' || ticket.priority === priority),
    );
  });
  protected readonly openCount = computed(
    () =>
      this.allTickets().filter((ticket) =>
        ['ABERTO', 'ATRIBUIDO', 'EM_ATENDIMENTO'].includes(ticket.status),
      ).length,
  );
  protected readonly resolvedCount = computed(
    () =>
      this.allTickets().filter((ticket) => ['RESOLVIDO', 'ENCERRADO'].includes(ticket.status))
        .length,
  );
  protected readonly overdueCount = computed(
    () => this.allTickets().filter((ticket) => ticket.overdue).length,
  );

  protected updateClient(event: Event): void {
    this.clientFilter.set((event.target as HTMLSelectElement).value);
  }
  protected updateTechnician(event: Event): void {
    this.technicianFilter.set((event.target as HTMLSelectElement).value);
  }
  protected updateStatus(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as TicketFilter);
  }
  protected updatePriority(event: Event): void {
    this.priorityFilter.set((event.target as HTMLSelectElement).value as PriorityFilter);
  }
  protected clearFilters(): void {
    this.clientFilter.set('Todas');
    this.technicianFilter.set('Todos');
    this.statusFilter.set('Todas');
    this.priorityFilter.set('Todas');
  }
}
