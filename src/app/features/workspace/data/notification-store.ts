import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Notificacao, NotificacoesApi, TipoNotificacao } from '@app/core/api/notificacoes.api';

export type NotificationKind = 'sla' | 'completed' | 'assigned' | 'reopened' | 'removed';

export interface AppNotification {
  readonly id: string;
  readonly kind: NotificationKind;
  readonly title: string;
  readonly ticketId: string;
  readonly ticketNumber: string;
  readonly ticketTitle: string;
  readonly createdAt: string;
  readonly read: boolean;
}

const KIND: Record<TipoNotificacao, NotificationKind> = {
  ATRIBUICAO: 'assigned',
  REMOCAO: 'removed',
  REABERTURA: 'reopened',
  CONCLUSAO: 'completed',
  VIOLACAO: 'sla',
};

const TITLE: Record<TipoNotificacao, string> = {
  ATRIBUICAO: 'Chamado atribuído a você',
  REMOCAO: 'Você deixou de ser o responsável',
  REABERTURA: 'Chamado reaberto pelo cliente',
  CONCLUSAO: 'Atendimento concluído',
  VIOLACAO: 'Prazo de SLA violado',
};

export function toAppNotification(n: Notificacao): AppNotification {
  return {
    id: n.id,
    kind: KIND[n.tipo],
    title: n.mensagem?.trim() || TITLE[n.tipo],
    ticketId: n.chamadoId,
    ticketNumber: n.numeroChamado,
    ticketTitle: n.titulo,
    createdAt: n.criadoEm,
    read: n.lidaEm !== null,
  };
}

/** Dia no fuso de Brasília (YYYY-MM-DD), para não trocar de dia perto da meia-noite UTC. */
const dayInBrasilia = (iso: string) =>
  new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });

export function groupNotifications(items: readonly AppNotification[]) {
  const days = new Map<string, AppNotification[]>();
  for (const item of [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    const day = dayInBrasilia(item.createdAt);
    days.set(day, [...(days.get(day) ?? []), item]);
  }
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return [...days].map(([day, notifications]) => ({
    day,
    label: formatter.format(new Date(`${day}T12:00:00Z`)),
    notifications,
  }));
}

const POLLING_MS = 60_000;

/**
 * Sino do técnico e do gestor. O ms-notificacoes não tem push (SSE/WebSocket), então a lista
 * é recarregada a cada 60 s enquanto a aba está visível.
 */
@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly api = inject(NotificacoesApi);
  readonly items = signal<readonly AppNotification[]>([]);
  readonly unread = signal(0);
  readonly status = signal<'idle' | 'loading' | 'ready' | 'error'>('idle');
  private timer?: ReturnType<typeof setInterval>;
  private users = 0;

  /** Chamado por quem mostra o sino; para o polling quando ninguém mais usa. */
  start(destroyRef: DestroyRef): void {
    if (this.users++ === 0) {
      this.refresh();
      this.timer = setInterval(() => {
        if (!document.hidden) this.refresh();
      }, POLLING_MS);
    }
    destroyRef.onDestroy(() => {
      if (--this.users === 0) clearInterval(this.timer);
    });
  }

  refresh(): void {
    if (this.status() === 'idle') this.status.set('loading');
    this.api.listar().subscribe({
      next: (pagina) => {
        this.items.set(pagina.itens.map(toAppNotification));
        this.unread.set(pagina.totalNaoLidas);
        this.status.set('ready');
      },
      error: () => this.status.set(this.items().length ? 'ready' : 'error'),
    });
  }

  markRead(id: string): void {
    const item = this.items().find((n) => n.id === id);
    if (!item || item.read) return;
    this.setRead([id]);
    this.api.marcarLida(id).subscribe({ error: () => this.refresh() });
  }

  /** Não há endpoint em lote: marca uma a uma as não lidas carregadas. */
  markAllRead(): void {
    const ids = this.items()
      .filter((n) => !n.read)
      .map((n) => n.id);
    if (!ids.length) return;
    this.setRead(ids);
    forkJoin(ids.map((id) => this.api.marcarLida(id))).subscribe({
      next: () => this.refresh(),
      error: () => this.refresh(),
    });
  }

  private setRead(ids: readonly string[]): void {
    this.items.update((items) => items.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)));
    this.unread.update((count) => Math.max(0, count - ids.length));
  }
}
