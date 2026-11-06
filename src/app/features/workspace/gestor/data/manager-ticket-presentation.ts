import type { ManagerTicketPriority, ManagerTicketStatus } from './manager-ticket-demo-store';

export function managerTicketStatusClasses(status: ManagerTicketStatus): string {
  return {
    ABERTO: 'bg-pri-bg text-pri-d',
    ATRIBUIDO: 'bg-cyan text-navy',
    EM_ATENDIMENTO: 'bg-turquoise/20 text-navy',
    RESOLVIDO: 'bg-grn-bg text-grn-t',
    CANCELADO: 'bg-bg text-ink2',
    ENCERRADO: 'bg-grn-bg text-grn-t',
  }[status];
}

export function managerTicketPriorityClasses(priority: ManagerTicketPriority): string {
  return priority === 'Alta' ? 'bg-danger-bg text-danger' : 'bg-bg text-ink2';
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
