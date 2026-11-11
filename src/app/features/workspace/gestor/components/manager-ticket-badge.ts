import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { ManagerTicketPriority, ManagerTicketStatus } from '../data/manager-ticket-demo-store';
import { MANAGER_TICKET_BADGES } from '../data/manager-ticket-presentation';

@Component({
  selector: 'app-manager-ticket-badge',
  imports: [LucideDynamicIcon],
  template: `
    <span
      class="inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 text-xs font-semibold"
      [class]="badge().classes"
    >
      <svg class="size-3.5 shrink-0" [lucideIcon]="badge().icon" aria-hidden="true"></svg>
      {{ badge().label }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
})
export class ManagerTicketBadge {
  readonly value = input.required<ManagerTicketStatus | ManagerTicketPriority>();
  protected readonly badge = computed(() => MANAGER_TICKET_BADGES[this.value()]);
}
