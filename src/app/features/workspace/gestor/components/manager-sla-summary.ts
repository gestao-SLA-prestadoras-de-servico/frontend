import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReportClock, ReportRate } from '../data/manager-report-demo-data';
import { ManagerPanel, ManagerSectionHeading } from './manager-surface.directive';

@Component({
  selector: 'app-manager-sla-summary',
  imports: [ManagerPanel, ManagerSectionHeading],
  template: `
    <section appManagerPanel [attr.aria-label]="title()">
      <div class="flex flex-wrap items-baseline justify-between gap-3">
        <h2 appManagerSectionHeading>{{ title() }}</h2>
        <p class="text-xs leading-relaxed text-ink2">{{ context() }}</p>
      </div>
      <ul class="mt-4 grid gap-5 sm:grid-cols-3">
        @for (clock of clocks(); track clock.key) {
          <li>
            <p class="text-[13px] font-medium text-ink2">{{ clock.label }}</p>
            <div class="mt-3 flex h-2.5 overflow-hidden rounded-full bg-bg" aria-hidden="true">
              <span class="bg-grn" [style.width.%]="clock.percentage"></span>
              <span class="bg-danger" [style.width.%]="100 - clock.percentage"></span>
            </div>
            <p class="mt-2 text-[13px] leading-relaxed">
              <span class="font-semibold tabular-nums">{{ clock.percentage }}%</span> no prazo
              <span class="mt-1 block text-ink2"
                >{{ clock.fulfilled }} cumpridos · {{ clock.violated }} violados</span
              >
            </p>
          </li>
        }
      </ul>
      <div
        class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink2"
        aria-label="Legenda do gráfico"
      >
        <span class="inline-flex items-center gap-2"
          ><span class="h-2 w-5 rounded-sm bg-grn" aria-hidden="true"></span>Dentro do prazo</span
        >
        <span class="inline-flex items-center gap-2"
          ><span class="h-2 w-5 rounded-sm bg-danger" aria-hidden="true"></span>Fora do prazo</span
        >
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ManagerSlaSummary {
  readonly title = input('Cumprimento por prazo');
  readonly context = input('Amostra de demonstração');
  readonly clocks = input.required<readonly (ReportRate & { key: ReportClock; label: string })[]>();
}
