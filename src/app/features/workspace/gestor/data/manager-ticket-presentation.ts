import {
  LucideChevronsUp,
  LucideCircleCheck,
  LucideCircleDot,
  LucideCircleX,
  LucideLockKeyhole,
  LucideMinus,
  LucideUserRoundCheck,
  LucideWrench,
} from '@lucide/angular';
import type { ManagerTicketPriority, ManagerTicketStatus } from './manager-ticket-demo-store';

export const MANAGER_TICKET_BADGES = {
  ABERTO: { label: 'Aberto', icon: LucideCircleDot, classes: 'bg-pri-bg text-pri-d' },
  ATRIBUIDO: { label: 'Atribuído', icon: LucideUserRoundCheck, classes: 'bg-cyan text-navy' },
  EM_ATENDIMENTO: {
    label: 'Em atendimento',
    icon: LucideWrench,
    classes: 'bg-turquoise/20 text-navy',
  },
  RESOLVIDO: { label: 'Resolvido', icon: LucideCircleCheck, classes: 'bg-grn-bg text-grn-t' },
  CANCELADO: { label: 'Cancelado', icon: LucideCircleX, classes: 'bg-bg text-ink2' },
  ENCERRADO: { label: 'Encerrado', icon: LucideLockKeyhole, classes: 'bg-grn-bg text-grn-t' },
  Alta: { label: 'Alta', icon: LucideChevronsUp, classes: 'bg-danger-bg text-danger' },
  Normal: { label: 'Normal', icon: LucideMinus, classes: 'bg-bg text-ink2' },
} as const;

export function managerTicketStatusClasses(status: ManagerTicketStatus): string {
  return MANAGER_TICKET_BADGES[status].classes;
}

export function managerTicketPriorityClasses(priority: ManagerTicketPriority): string {
  return MANAGER_TICKET_BADGES[priority].classes;
}

export function managerDeadlineClasses(value: string): string {
  const normalized = value.toLocaleLowerCase('pt-BR');

  if (normalized.includes('violad') || normalized.includes('atrasad')) {
    return 'bg-danger-bg text-danger';
  }
  if (normalized.includes('cumprid')) {
    return 'bg-grn-bg text-grn-t';
  }
  if (normalized.includes('cancelad') || normalized.includes('encerrad')) {
    return 'bg-bg text-ink2';
  }
  return 'bg-pri-bg text-pri-d';
}
