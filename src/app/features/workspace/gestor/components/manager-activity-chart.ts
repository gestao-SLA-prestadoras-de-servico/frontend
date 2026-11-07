import { ManagerTable, ManagerTableHead, ManagerTableBody } from './manager-table.directive';
import { ManagerPanel, ManagerSectionHeading } from './manager-surface.directive';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MANAGER_ACTIVITY_SAMPLE } from '../data/manager-dashboard-demo-data';

@Component({
  selector: 'app-manager-activity-chart',
  imports: [ManagerPanel, ManagerSectionHeading, ManagerTable, ManagerTableHead, ManagerTableBody],
  template: `
    <section appManagerPanel class="h-full" aria-labelledby="activity-heading">
      <h2 appManagerSectionHeading id="activity-heading">Atendimento ao longo do tempo</h2>
      <p class="mt-1 text-[13px] leading-5 text-ink3">
        Histórico fictício · 30 out a 05 nov de 2026
      </p>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex flex-wrap gap-4">
          <span class="inline-flex items-center gap-2"
            ><span class="size-2 rounded-sm bg-pri" aria-hidden="true"></span>Recebidos</span
          >
          <span class="inline-flex items-center gap-2"
            ><span class="size-2 rounded-sm bg-grn" aria-hidden="true"></span>Resolvidos</span
          >
        </div>
        <p class="tabular-nums text-ink2">{{ received }} recebidos · {{ resolved }} resolvidos</p>
      </div>
      <div class="relative mt-5 h-40 pl-7 sm:h-44" aria-hidden="true">
        <div
          class="absolute inset-y-0 left-0 flex w-5 flex-col justify-between text-right text-xs tabular-nums text-ink3"
        >
          <span>{{ scale }}</span
          ><span>{{ scale / 2 }}</span
          ><span>0</span>
        </div>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 left-7 flex flex-col justify-between"
        >
          <span class="border-t border-line/60"></span><span class="border-t border-line/60"></span
          ><span class="border-t border-line"></span>
        </div>
        <div class="relative grid h-full grid-cols-7 gap-2">
          @for (day of days; track day.date) {
            <div
              class="flex h-full items-end justify-center gap-1.5"
              [title]="
                day.date + ': ' + day.received + ' recebidos, ' + day.resolved + ' resolvidos'
              "
            >
              <span
                class="w-2.5 rounded-t-sm bg-pri sm:w-4"
                [style.height.%]="(day.received / scale) * 100"
              ></span>
              <span
                class="w-2.5 rounded-t-sm bg-grn sm:w-4"
                [style.height.%]="(day.resolved / scale) * 100"
              ></span>
            </div>
          }
        </div>
      </div>
      <div
        class="mt-2 grid grid-cols-7 gap-2 pl-7 text-center text-[11px] tabular-nums text-ink3"
        aria-hidden="true"
      >
        @for (day of days; track day.date) {
          <span>{{ day.date }}</span>
        }
      </div>
      <details class="mt-3">
        <summary
          class="w-fit cursor-pointer rounded-sm py-3 text-xs font-semibold text-pri-d underline underline-offset-4"
        >
          Ver dados do gráfico
        </summary>
        <table appManagerTable class="mt-2 text-xs tabular-nums">
          <caption class="sr-only">
            Chamados recebidos e resolvidos por dia na amostra fictícia
          </caption>
          <thead appManagerTableHead>
            <tr>
              <th class="py-2" scope="col">Data</th>
              <th class="py-2 text-right" scope="col">Recebidos</th>
              <th class="py-2 text-right" scope="col">Resolvidos</th>
            </tr>
          </thead>
          <tbody appManagerTableBody>
            @for (day of days; track day.date) {
              <tr class="border-t border-line">
                <th scope="row" class="py-2 font-normal">{{ day.date }}</th>
                <td class="py-2 text-right">{{ day.received }}</td>
                <td class="py-2 text-right">{{ day.resolved }}</td>
              </tr>
            }
          </tbody>
        </table>
      </details>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ManagerActivityChart {
  protected readonly days = MANAGER_ACTIVITY_SAMPLE;
  protected readonly received = this.days.reduce((total, day) => total + day.received, 0);
  protected readonly resolved = this.days.reduce((total, day) => total + day.resolved, 0);
  protected readonly scale =
    Math.ceil(Math.max(...this.days.map((day) => Math.max(day.received, day.resolved))) / 5) * 5;
}
