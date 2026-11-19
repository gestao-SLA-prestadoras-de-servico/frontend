import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { LucideDynamicIcon } from '@lucide/angular';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro } from '@app/core/api/erros';
import { ChamadoCliente } from '@app/core/api/modelos';
import { ButtonPrimary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ClientStatusBadge } from '../components/client-status';
import { ClientPriorityBadge } from '../components/client-priority';
import { CLIENT_PRIORITIES, CLIENT_STATUS_LABELS, toClientTicket } from '../data/client-data';

@Component({
  selector: 'app-client-tickets',
  imports: [
    DatePipe,
    RouterLink,
    ButtonPrimary,
    PageHeading,
    LucideDynamicIcon,
    ClientStatusBadge,
    ClientPriorityBadge,
  ],
  templateUrl: './client-tickets.html',
  styleUrl: '../client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTickets {
  private readonly api = inject(ChamadosApi);
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly statuses = Object.entries(CLIENT_STATUS_LABELS);
  protected readonly priorities = CLIENT_PRIORITIES;
  protected readonly query = signal('');
  protected readonly status = signal('');
  protected readonly priority = signal('');

  protected readonly data = rxResource({
    stream: () =>
      forkJoin({
        chamados: this.api.listarTodos<ChamadoCliente>({ sort: 'numero,desc' }),
        contagem: this.api.contagem(),
      }).pipe(
        map(({ chamados, contagem }) => ({ tickets: chamados.map(toClientTicket), contagem })),
      ),
  });
  protected readonly erro = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly tickets = computed(() => this.data.value()?.tickets ?? []);
  protected readonly summary = computed(() => {
    const c = this.data.value()?.contagem;
    return [
      {
        label: 'Em andamento',
        count: c ? c.ABERTO + c.ATRIBUIDO + c.EM_ATENDIMENTO : 0,
      },
      { label: 'Aguardando validação', count: c?.RESOLVIDO ?? 0 },
      { label: 'Encerrados', count: c ? c.ENCERRADO + c.CANCELADO : 0 },
    ];
  });
  protected readonly awaiting = computed(() =>
    this.tickets().find((t) => t.status === 'RESOLVIDO'),
  );
  protected readonly filtered = computed(() => {
    const query = this.normalize(this.query());
    return this.tickets().filter(
      (ticket) =>
        (!this.status() || ticket.status === this.status()) &&
        (!this.priority() || ticket.priority === this.priority()) &&
        this.normalize(`#${ticket.number} ${ticket.title} ${ticket.location}`).includes(query),
    );
  });
  protected value(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
  protected reset(): void {
    this.query.set('');
    this.status.set('');
    this.priority.set('');
  }
  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR')
      .trim();
  }
}
