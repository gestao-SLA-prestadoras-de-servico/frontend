import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ReportRow } from '../data/manager-report-demo-data';
import { ManagerPanel, ManagerSectionHeading } from './manager-surface.directive';
import { ManagerTable, ManagerTableBody, ManagerTableHead } from './manager-table.directive';
import { ManagerSlaRate } from './manager-sla-rate';

@Component({
  selector: 'app-manager-sla-report-table',
  imports: [
    ManagerPanel,
    ManagerSectionHeading,
    ManagerTable,
    ManagerTableHead,
    ManagerTableBody,
    ManagerSlaRate,
  ],
  template: `
    <section appManagerPanel="flush" [attr.aria-labelledby]="headingId()">
      <div class="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 p-4 sm:px-5">
        <h2 appManagerSectionHeading [id]="headingId()">{{ title() }}</h2>
        <p class="max-w-[54ch] text-xs leading-relaxed text-ink3">
          @if (kind() === 'client') {
            Percentual de chamados com o prazo cumprido.
          } @else {
            A resposta é do gestor; não é apurada por técnico.
          }
        </p>
      </div>
      <div class="hidden overflow-x-auto rounded-b-deadline md:block">
        <table appManagerTable class="min-w-[640px] table-fixed">
          <caption class="sr-only">
            {{
              title()
            }}
            · cumprimento de SLA na amostra demonstrativa
          </caption>
          <colgroup>
            <col class="w-[28%]" />
            <col class="w-[10%]" />
            <col class="w-[20%]" />
            <col class="w-[22%]" />
            <col class="w-[20%]" />
          </colgroup>
          <thead appManagerTableHead>
            <tr>
              <th scope="col" class="px-5 py-3">{{ subject() }}</th>
              <th scope="col" class="px-3 py-3 text-right">Chamados</th>
              <th scope="col" class="px-4 py-3">Resposta</th>
              <th scope="col" class="px-4 py-3">Atendimento em campo</th>
              <th scope="col" class="px-5 py-3">Resolução</th>
            </tr>
          </thead>
          <tbody appManagerTableBody>
            @for (row of rows(); track row.name) {
              <tr>
                <th scope="row" class="px-5 py-4 font-semibold">{{ row.name }}</th>
                <td class="px-3 py-4 text-right tabular-nums">{{ row.total }}</td>
                <td class="px-4 py-4"><app-manager-sla-rate [rate]="row.response" /></td>
                <td class="px-4 py-4"><app-manager-sla-rate [rate]="row.field" /></td>
                <td class="px-5 py-4"><app-manager-sla-rate [rate]="row.resolution" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <ul class="divide-y divide-line border-t border-line md:hidden">
        @for (row of rows(); track row.name) {
          <li class="p-4">
            <h3 class="text-sm font-semibold">{{ row.name }}</h3>
            <p class="mt-1 text-xs text-ink3">{{ row.total }} chamados apurados</p>
            <dl class="mt-4 space-y-3">
              <div class="grid grid-cols-[minmax(0,1fr)_minmax(100px,1fr)] items-center gap-4">
                <dt class="text-[13px] text-ink2">Resposta</dt>
                <dd class="m-0"><app-manager-sla-rate [rate]="row.response" /></dd>
              </div>
              <div class="grid grid-cols-[minmax(0,1fr)_minmax(100px,1fr)] items-center gap-4">
                <dt class="text-[13px] text-ink2">Atendimento em campo</dt>
                <dd class="m-0"><app-manager-sla-rate [rate]="row.field" /></dd>
              </div>
              <div class="grid grid-cols-[minmax(0,1fr)_minmax(100px,1fr)] items-center gap-4">
                <dt class="text-[13px] text-ink2">Resolução</dt>
                <dd class="m-0"><app-manager-sla-rate [rate]="row.resolution" /></dd>
              </div>
            </dl>
          </li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ManagerSlaReportTable {
  readonly kind = input.required<'client' | 'technician'>();
  readonly rows = input.required<readonly ReportRow[]>();
  protected readonly title = computed(() =>
    this.kind() === 'client' ? 'Por cliente' : 'Por técnico',
  );
  protected readonly subject = computed(() => (this.kind() === 'client' ? 'Cliente' : 'Técnico'));
  protected readonly headingId = computed(() => `report-${this.kind()}-heading`);
}
