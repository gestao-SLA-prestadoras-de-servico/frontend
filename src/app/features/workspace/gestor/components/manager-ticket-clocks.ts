import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideDynamicIcon, LucideTriangleAlert } from '@lucide/angular';
import { ManagerTicket } from '../data/manager-ticket';

/**
 * Resumo de SLA para listas: a listagem do backend não traz os relógios, só o próximo
 * vencimento e se o chamado já teve violação.
 */
@Component({
  selector: 'app-manager-ticket-clocks',
  imports: [LucideDynamicIcon, DatePipe],
  template: `
    @if (ticket().status === 'CANCELADO') {
      <p class="text-xs leading-relaxed text-ink3">Sem apuração de SLA</p>
    } @else {
      <ul class="flex flex-wrap gap-1.5" aria-label="Situação do SLA">
        @if (ticket().overdue) {
          <li
            class="inline-flex min-h-6 items-center gap-1 whitespace-nowrap rounded-status bg-danger-bg px-2 py-0.5 text-[11px] font-semibold leading-relaxed text-danger"
          >
            <svg class="size-3 shrink-0" [lucideIcon]="alertIcon" aria-hidden="true"></svg>
            Prazo violado
          </li>
        }
        @if (ticket().nextDeadline; as due) {
          <li
            class="inline-flex min-h-6 items-center gap-1 whitespace-nowrap rounded-status bg-pri-bg px-2 py-0.5 text-[11px] leading-relaxed tabular-nums text-pri-d"
          >
            <span class="font-semibold">Próximo</span>
            <time [attr.datetime]="due">{{ due | date: 'dd/MM HH:mm' : '-0300' }}</time>
          </li>
        } @else if (!ticket().overdue) {
          <li class="text-xs leading-relaxed text-ink3">Sem prazo correndo</li>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerTicketClocks {
  readonly ticket = input.required<ManagerTicket>();
  protected readonly alertIcon = LucideTriangleAlert;
}
