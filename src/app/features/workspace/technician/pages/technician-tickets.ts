import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TechnicianDemoStore } from '../technician-demo-store';
import { TechnicianPriority, TechnicianStatus } from '../technician-data';
import { TechnicianTicketCard } from '../components/technician-ticket-card';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';

@Component({
  selector: 'app-technician-tickets',
  imports: [TechnicianTicketCard, PageHeading],
  templateUrl: './technician-tickets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TechnicianTickets {
  protected readonly store = inject(TechnicianDemoStore);
  protected readonly statusFilter = signal<TechnicianStatus | 'TODOS'>('TODOS');
  protected readonly priorityFilter = signal<TechnicianPriority | 'TODAS'>('TODAS');
  protected readonly visibleTickets = computed(() =>
    this.store
      .tickets()
      .filter(
        (ticket) =>
          (this.statusFilter() === 'TODOS' || ticket.status === this.statusFilter()) &&
          (this.priorityFilter() === 'TODAS' || ticket.priority === this.priorityFilter()),
      ),
  );
  protected readonly assignedCount = computed(
    () => this.store.tickets().filter((ticket) => ticket.status === 'ATRIBUIDO').length,
  );
  protected readonly activeCount = computed(
    () => this.store.tickets().filter((ticket) => ticket.status === 'EM_ATENDIMENTO').length,
  );

  protected readonly statuses: readonly { value: TechnicianStatus | 'TODOS'; label: string }[] = [
    { value: 'TODOS', label: 'Todos os estados' },
    { value: 'ATRIBUIDO', label: 'Atribuído' },
    { value: 'EM_ATENDIMENTO', label: 'Em atendimento' },
    { value: 'RESOLVIDO', label: 'Resolvido no exemplo' },
  ];
  protected readonly priorities: readonly { value: TechnicianPriority | 'TODAS'; label: string }[] =
    [
      { value: 'TODAS', label: 'Todas as prioridades' },
      { value: 'Crítica', label: 'Crítica' },
      { value: 'Alta', label: 'Alta' },
      { value: 'Normal', label: 'Normal' },
      { value: 'Baixa', label: 'Baixa' },
    ];

  protected setStatus(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as TechnicianStatus | 'TODOS');
  }

  protected setPriority(event: Event): void {
    this.priorityFilter.set(
      (event.target as HTMLSelectElement).value as TechnicianPriority | 'TODAS',
    );
  }

  protected clearFilters(): void {
    this.statusFilter.set('TODOS');
    this.priorityFilter.set('TODAS');
  }

  protected readonly filtersActive = computed(
    () => this.statusFilter() !== 'TODOS' || this.priorityFilter() !== 'TODAS',
  );
}
