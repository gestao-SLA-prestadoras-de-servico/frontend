import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  LucideCalendarCheck,
  LucideCalendarClock,
  LucideCalendarX,
  LucideCircleCheck,
  LucideCircleMinus,
  LucideDynamicIcon,
} from '@lucide/angular';

const STATUS_BADGES = {
  active: { label: 'Ativa', icon: LucideCircleCheck, classes: 'bg-grn-bg text-grn-t' },
  inactive: { label: 'Inativa', icon: LucideCircleMinus, classes: 'bg-bg text-ink2' },
  current: { label: 'Vigente', icon: LucideCalendarCheck, classes: 'bg-grn-bg text-grn-t' },
  future: { label: 'Futuro', icon: LucideCalendarClock, classes: 'bg-pri-bg text-pri-d' },
  expired: { label: 'Vencido', icon: LucideCalendarX, classes: 'bg-danger-bg text-danger' },
};

@Component({
  selector: 'app-manager-status-badge',
  imports: [LucideDynamicIcon],
  template: `<span
    class="inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 text-xs font-semibold"
    [class]="badge().classes"
    ><svg class="size-3.5 shrink-0" [lucideIcon]="badge().icon" aria-hidden="true"></svg
    >{{ label() || badge().label }}</span
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
})
export class ManagerStatusBadge {
  readonly value = input.required<keyof typeof STATUS_BADGES>();
  readonly label = input('');
  protected readonly badge = computed(() => STATUS_BADGES[this.value()]);
}
