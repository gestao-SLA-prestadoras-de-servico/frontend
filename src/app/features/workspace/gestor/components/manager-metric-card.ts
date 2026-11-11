import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  LucideAlarmClock,
  LucideCircleCheck,
  LucideClipboardCheck,
  LucideDynamicIcon,
  LucideFolderOpen,
  LucideInbox,
  LucideTriangleAlert,
  LucideWrench,
  LucideBuilding2,
  LucideUsers,
  LucideUserRoundCheck,
  LucideCircleMinus,
  LucideFileText,
  LucideCalendarCheck,
  LucideCalendarClock,
  LucideCalendarX,
} from '@lucide/angular';

const METRIC_ICONS = {
  violated: LucideTriangleAlert,
  triage: LucideInbox,
  service: LucideWrench,
  validation: LucideClipboardCheck,
  open: LucideFolderOpen,
  resolved: LucideCircleCheck,
  overdue: LucideAlarmClock,
  companies: LucideBuilding2,
  users: LucideUsers,
  technicians: LucideUserRoundCheck,
  active: LucideCircleCheck,
  inactive: LucideCircleMinus,
  contracts: LucideFileText,
  current: LucideCalendarCheck,
  future: LucideCalendarClock,
  expired: LucideCalendarX,
};

export type ManagerMetricIcon = keyof typeof METRIC_ICONS;
export type ManagerMetricTone = 'blue' | 'green' | 'danger' | 'neutral';

@Component({
  selector: 'app-manager-metric-card',
  imports: [LucideDynamicIcon],
  template: `
    <dl
      class="h-full min-w-0 rounded-deadline"
      [class]="
        variant() === 'outlined'
          ? 'border border-line bg-sf p-4 text-ink'
          : 'p-3 sm:p-4 ' + tones[tone()]
      "
    >
      <dt
        class="flex items-start text-xs leading-5 sm:text-sm"
        [class]="
          variant() === 'outlined'
            ? 'flex-col-reverse gap-3'
            : 'flex-col-reverse gap-2 sm:flex-row sm:justify-between'
        "
      >
        <span [class]="variant() === 'outlined' ? 'min-h-10 text-ink2 xl:min-h-5' : ''">{{
          label()
        }}</span>
        <span
          [class]="
            variant() === 'outlined'
              ? 'grid size-8 place-items-center rounded-status ' + tones[tone()]
              : 'contents'
          "
        >
          <svg
            class="size-4 shrink-0 sm:size-5"
            [lucideIcon]="icons[icon()]"
            aria-hidden="true"
          ></svg>
        </span>
      </dt>
      <dd class="m-0 mt-2">
        <span class="block text-[28px] leading-none font-semibold tabular-nums"
          >{{ value() }}{{ suffix() }}</span
        >
        @if (note()) {
          <span
            class="mt-2 block text-xs leading-5"
            [class]="variant() === 'outlined' ? 'text-ink3' : ''"
            >{{ note() }}</span
          >
        }
      </dd>
    </dl>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-w-0',
  },
})
export class ManagerMetricCard {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly suffix = input('');
  readonly icon = input.required<ManagerMetricIcon>();
  readonly tone = input<ManagerMetricTone>('blue');
  readonly variant = input<'tinted' | 'outlined'>('tinted');
  readonly note = input('');
  protected readonly icons = METRIC_ICONS;
  protected readonly tones = {
    blue: 'bg-pri-bg text-pri-d',
    green: 'bg-grn-bg text-grn-t',
    danger: 'bg-danger-bg text-danger',
    neutral: 'bg-bg text-navy',
  };
}
