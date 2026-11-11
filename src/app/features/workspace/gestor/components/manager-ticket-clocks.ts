import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideCheck, LucideDynamicIcon, LucideTriangleAlert } from '@lucide/angular';
import { ManagerTicket } from '../data/manager-ticket-demo-store';
import { managerDeadlineClasses } from '../data/manager-ticket-presentation';

@Component({
  selector: 'app-manager-ticket-clocks',
  imports: [LucideDynamicIcon],
  template: `
    @if (ticket().status === 'CANCELADO') {
      <p class="text-xs leading-relaxed text-ink3">Sem apuração de SLA</p>
    } @else {
      <ul class="flex flex-wrap gap-1.5" aria-label="Relógios de SLA">
        @for (clock of clocks(); track clock.label) {
          <li
            class="relative inline-flex min-h-6 items-center gap-1 whitespace-nowrap rounded-status px-2 py-0.5 text-[11px] leading-relaxed tabular-nums"
            [class]="clock.classes"
            [title]="clock.label + ': ' + clock.value"
          >
            <span class="sr-only">{{ clock.label }}: {{ clock.value }}</span>
            <span class="font-semibold" aria-hidden="true">{{ clock.shortLabel }}</span>
            @if (clock.fulfilled) {
              <svg class="size-3 shrink-0" [lucideIcon]="checkIcon" aria-hidden="true"></svg>
            } @else if (clock.violated) {
              <svg class="size-3 shrink-0" [lucideIcon]="alertIcon" aria-hidden="true"></svg>
              <span aria-hidden="true">Violado</span>
            } @else {
              <span aria-hidden="true">{{ clock.value }}</span>
            }
          </li>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerTicketClocks {
  readonly ticket = input.required<ManagerTicket>();
  protected readonly checkIcon = LucideCheck;
  protected readonly alertIcon = LucideTriangleAlert;
  protected readonly clocks = computed(() => {
    const ticket = this.ticket();
    return [
      { label: 'Resposta', shortLabel: 'Resp', value: ticket.responseClock },
      { label: 'Atendimento em campo', shortLabel: 'Campo', value: ticket.fieldClock },
      { label: 'Resolução', shortLabel: 'Resol', value: ticket.resolutionClock },
    ].map((clock) => ({
      ...clock,
      classes: managerDeadlineClasses(clock.value),
      fulfilled: /cumprid/i.test(clock.value),
      violated: /violad|atrasad/i.test(clock.value),
    }));
  });
}
