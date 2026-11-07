import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TechnicianPriority, TechnicianStatus } from '../technician-data';

const statusClasses: Record<TechnicianStatus, string> = {
  ATRIBUIDO: 'bg-pri-bg text-pri-d',
  EM_ATENDIMENTO: 'bg-[#fff1d6] text-[#754500]',
  RESOLVIDO: 'bg-grn-bg text-grn-t',
};

const priorityClasses: Record<TechnicianPriority, string> = {
  Crítica: 'bg-danger-bg text-danger',
  Alta: 'bg-[#fff1d6] text-[#754500]',
  Normal: 'bg-bg text-ink2',
  Baixa: 'bg-grn-bg text-grn-t',
};

const statusLabels: Record<TechnicianStatus, string> = {
  ATRIBUIDO: 'Atribuído',
  EM_ATENDIMENTO: 'Em atendimento',
  RESOLVIDO: 'Resolvido no exemplo',
};

@Component({
  selector: 'app-technician-ticket-badges',
  template: `
    <span
      class="inline-flex min-h-6 items-center rounded-status px-2.5 py-1 text-[11px] leading-tight font-semibold tracking-[0.01em]"
      [class]="statusClasses[status()]"
      >{{ statusLabels[status()] }}</span
    >
    <span
      class="inline-flex min-h-6 items-center rounded-status px-2.5 py-1 text-[11px] leading-tight font-semibold tracking-[0.01em]"
      [class]="priorityClasses[priority()]"
      >{{ priority() }}</span
    >
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianTicketBadges {
  readonly status = input.required<TechnicianStatus>();
  readonly priority = input.required<TechnicianPriority>();
  protected readonly statusClasses = statusClasses;
  protected readonly priorityClasses = priorityClasses;
  protected readonly statusLabels = statusLabels;
}
