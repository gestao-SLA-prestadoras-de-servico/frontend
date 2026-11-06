import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import {
  ManagerTicketDemoStore,
  ManagerTicketPriority,
  ManagerTicketStatus,
} from '../data/manager-ticket-demo-store';

type TicketFilter = 'Todas' | ManagerTicketStatus;
type PriorityFilter = 'Todas' | ManagerTicketPriority;

@Component({
  selector: 'app-manager-tickets',
  imports: [RouterLink, PageHeading, LucideDynamicIcon],
  templateUrl: './manager-tickets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerTickets {
  private readonly store = inject(ManagerTicketDemoStore);
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly allTickets = this.store.tickets;
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
  protected statusLabel(status: ManagerTicketStatus): string {
    return {
      ABERTO: 'Aberto',
      ATRIBUIDO: 'Atribuído',
      EM_ATENDIMENTO: 'Em atendimento',
      RESOLVIDO: 'Resolvido',
      CANCELADO: 'Cancelado',
      ENCERRADO: 'Encerrado',
    }[status];
  }
}
