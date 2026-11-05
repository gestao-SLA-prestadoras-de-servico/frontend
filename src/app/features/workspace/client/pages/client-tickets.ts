import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ClientNotice } from '../components/client-notice';
import { ClientStatusBadge } from '../components/client-status';
import {
  CLIENT_PRIORITIES,
  CLIENT_STATUS_LABELS,
  CLIENT_TICKETS,
  ClientTicket,
} from '../data/client-data';

@Component({
  selector: 'app-client-tickets',
  imports: [
    DatePipe,
    RouterLink,
    ButtonPrimary,
    PageHeading,
    LucideDynamicIcon,
    ClientNotice,
    ClientStatusBadge,
  ],
  templateUrl: './client-tickets.html',
  styleUrl: '../client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTickets {
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly tickets = CLIENT_TICKETS;
  protected readonly statuses = Object.entries(CLIENT_STATUS_LABELS);
  protected readonly priorities = CLIENT_PRIORITIES;
  protected readonly query = signal('');
  protected readonly status = signal('');
  protected readonly priority = signal('');
  protected readonly scene = signal('normal');
  protected readonly summary = [
    {
      label: 'Em andamento',
      count: this.tickets.filter((t) => !['RESOLVIDO', 'ENCERRADO'].includes(t.status)).length,
    },
    {
      label: 'Aguardando validação',
      count: this.tickets.filter((t) => t.status === 'RESOLVIDO').length,
    },
    { label: 'Encerrados', count: this.tickets.filter((t) => t.status === 'ENCERRADO').length },
  ];
  protected readonly awaiting = this.tickets.find((t) => t.status === 'RESOLVIDO');
  protected readonly filtered = computed(() => {
    if (this.scene() === 'empty') return [];
    const query = this.normalize(this.query());
    return this.tickets.filter(
      (ticket) =>
        (!this.status() || ticket.status === this.status()) &&
        (!this.priority() || ticket.priority === this.priority()) &&
        this.normalize(`#${ticket.id} ${ticket.title} ${ticket.location}`).includes(query),
    );
  });
  protected value(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
  protected nextDeadline(ticket: ClientTicket) {
    return ticket.deadlines.find((deadline) => deadline.state !== 'fulfilled');
  }
  protected reset(): void {
    this.query.set('');
    this.status.set('');
    this.priority.set('');
    this.scene.set('normal');
  }
  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR')
      .trim();
  }
}
