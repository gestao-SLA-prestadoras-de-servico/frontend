import { Injectable, signal } from '@angular/core';
import { ProfileKey } from './workspace-data';

export type NotificationProfile = Exclude<ProfileKey, 'cliente'>;
export type NotificationKind =
  'sla' | 'completed' | 'assigned' | 'reassigned' | 'reopened' | 'removed';
export interface DemoNotification {
  readonly id: string;
  readonly kind: NotificationKind;
  readonly title: string;
  readonly ticketId: number;
  readonly ticketTitle: string;
  readonly createdAt: string;
  readonly read: boolean;
}

// Snapshot fictício. As datas não dependem do relógio atual; a leitura existe só em memória.
const NOTIFICATIONS: Record<NotificationProfile, readonly DemoNotification[]> = {
  gestor: [
    {
      id: 'manager-response',
      kind: 'sla',
      title: 'Prazo de resposta violado',
      ticketId: 1043,
      ticketTitle: 'Instabilidade no ponto de rede',
      createdAt: '2026-11-05T10:40:00-03:00',
      read: false,
    },
    {
      id: 'manager-completed',
      kind: 'completed',
      title: 'Atendimento concluído pelo técnico',
      ticketId: 1038,
      ticketTitle: 'Ajuste da bomba de circulação',
      createdAt: '2026-11-05T09:20:00-03:00',
      read: false,
    },
    {
      id: 'manager-previous',
      kind: 'completed',
      title: 'Atendimento concluído pelo técnico',
      ticketId: 1032,
      ticketTitle: 'Luminárias do corredor',
      createdAt: '2026-11-04T15:10:00-03:00',
      read: true,
    },
  ],
  tecnico: [
    {
      id: 'technician-assigned',
      kind: 'assigned',
      title: 'Chamado atribuído a você',
      ticketId: 1041,
      ticketTitle: 'Oscilação no quadro elétrico',
      createdAt: '2026-11-05T09:10:00-03:00',
      read: false,
    },
    {
      id: 'technician-reassigned',
      kind: 'reassigned',
      title: 'Atendimento reatribuído a você',
      ticketId: 1042,
      ticketTitle: 'Falha no sistema de climatização',
      createdAt: '2026-11-05T08:15:00-03:00',
      read: false,
    },
    {
      id: 'technician-reopened',
      kind: 'reopened',
      title: 'Cliente reabriu o chamado',
      ticketId: 1042,
      ticketTitle: 'Falha no sistema de climatização',
      createdAt: '2026-11-04T11:02:00-03:00',
      read: true,
    },
    {
      id: 'technician-removed',
      kind: 'removed',
      title: 'Você foi removido de uma atribuição anterior',
      ticketId: 1041,
      ticketTitle: 'Oscilação no quadro elétrico',
      createdAt: '2026-11-03T16:40:00-03:00',
      read: true,
    },
  ],
};

export function groupNotifications(items: readonly DemoNotification[]) {
  const days = new Map<string, DemoNotification[]>();
  for (const item of [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    const day = item.createdAt.slice(0, 10);
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

@Injectable({ providedIn: 'root' })
export class NotificationDemoStore {
  private readonly items = signal<Record<NotificationProfile, readonly DemoNotification[]>>({
    ...NOTIFICATIONS,
  });

  forProfile(profile: ProfileKey): readonly DemoNotification[] {
    return profile === 'cliente' ? [] : this.items()[profile];
  }

  markRead(profile: ProfileKey, id: string): void {
    if (
      profile === 'cliente' ||
      !this.forProfile(profile).some((item) => item.id === id && !item.read)
    )
      return;
    this.items.update((current) => ({
      ...current,
      [profile]: current[profile].map((item) => (item.id === id ? { ...item, read: true } : item)),
    }));
  }

  markAllRead(profile: ProfileKey): void {
    if (profile === 'cliente' || this.forProfile(profile).every((item) => item.read)) return;
    this.items.update((current) => ({
      ...current,
      [profile]: current[profile].map((item) => ({ ...item, read: true })),
    }));
  }
}
