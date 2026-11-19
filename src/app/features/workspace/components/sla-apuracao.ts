import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ApuracaoSla } from '@app/core/api/modelos';
import { RELOGIO_LABEL } from '../data/chamado';

/** Resultado final de cada prazo, congelado quando o chamado foi encerrado. */
@Component({
  selector: 'app-sla-apuracao',
  imports: [DatePipe],
  template: `
    @if (apuracao().apurado) {
      <section class="rounded-deadline border border-line p-5" aria-labelledby="sla-apuracao-title">
        <h2 id="sla-apuracao-title" class="text-base font-semibold tracking-normal">
          Apuração final do SLA
        </h2>
        <p class="mt-1 text-xs text-ink3">
          Prioridade {{ apuracao().prioridade === 'ALTA' ? 'Alta' : 'Normal' }} · apurada em
          {{ apuracao().congeladaEm | date: 'dd/MM/yyyy, HH:mm' : '-0300' }}
        </p>
        <dl class="mt-4 grid gap-3 sm:grid-cols-3">
          @for (relogio of apuracao().relogios ?? []; track relogio.tipo) {
            <div
              class="rounded-deadline p-3"
              [class]="
                relogio.resultado === 'CUMPRIDO'
                  ? 'bg-grn-bg text-grn-t'
                  : 'bg-danger-bg text-danger'
              "
            >
              <dt class="text-xs">{{ labels[relogio.tipo] }}</dt>
              <dd class="m-0 mt-1 text-sm font-semibold">
                {{ relogio.resultado === 'CUMPRIDO' ? 'Cumprido' : 'Violado' }}
              </dd>
              <dd class="m-0 mt-1 text-xs">
                {{
                  relogio.resultado === 'CUMPRIDO'
                    ? 'em ' + (relogio.cumpridoEm | date: 'dd/MM, HH:mm' : '-0300')
                    : 'prazo era ' + (relogio.venceEm | date: 'dd/MM, HH:mm' : '-0300')
                }}
              </dd>
              @if (relogio.violouEmCicloAnterior) {
                <dd class="m-0 mt-1 text-xs">Violado antes de uma reabertura.</dd>
              }
            </div>
          }
        </dl>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block empty:hidden' },
})
export class SlaApuracao {
  readonly apuracao = input.required<ApuracaoSla>();
  protected readonly labels = RELOGIO_LABEL;
}
