import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ManagerTicketDemoStore } from '../data/manager-ticket-demo-store';

@Component({
  selector: 'app-manager-dashboard',
  imports: [RouterLink, PageHeading, LucideDynamicIcon],
  templateUrl: './manager-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerDashboard {
  private readonly store = inject(ManagerTicketDemoStore);
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly tickets = this.store.tickets;
  protected readonly openCount = computed(
    () =>
      this.tickets().filter((ticket) =>
        ['ABERTO', 'ATRIBUIDO', 'EM_ATENDIMENTO'].includes(ticket.status),
      ).length,
  );
  protected readonly resolvedCount = computed(
    () =>
      this.tickets().filter((ticket) => ['RESOLVIDO', 'ENCERRADO'].includes(ticket.status)).length,
  );
  protected readonly overdueCount = computed(
    () => this.tickets().filter((ticket) => ticket.overdue).length,
  );
  protected readonly priorityTickets = computed(() =>
    this.tickets().filter((ticket) =>
      ['ABERTO', 'ATRIBUIDO', 'EM_ATENDIMENTO'].includes(ticket.status),
    ),
  );
}
