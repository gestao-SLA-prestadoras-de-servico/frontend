import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReportRate } from '../data/manager-report-demo-data';

@Component({
  selector: 'app-manager-sla-rate',
  template: `
    @if (rate(); as current) {
      <div class="flex items-center gap-2.5">
        <span class="h-1.5 min-w-10 flex-1 overflow-hidden rounded-full bg-bg" aria-hidden="true">
          <span
            class="block h-full rounded-full"
            [class]="current.percentage >= 90 ? 'bg-grn' : 'bg-danger'"
            [style.width.%]="current.percentage"
          ></span>
        </span>
        <span class="min-w-10 text-right text-[13px] font-semibold tabular-nums">
          <span class="sr-only"
            >{{ current.fulfilled }} de {{ current.total }} chamados no prazo,
          </span>
          {{ current.percentage }}%
        </span>
      </div>
    } @else {
      <span class="text-sm text-ink3">
        <span aria-hidden="true">—</span>
        <span class="sr-only">Não se aplica: a resposta é responsabilidade do gestor.</span>
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ManagerSlaRate {
  readonly rate = input.required<ReportRate | null>();
}
