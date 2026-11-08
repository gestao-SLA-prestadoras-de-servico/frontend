import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClientDeadline } from '../data/client-data';

@Component({
  selector: 'app-client-deadlines',
  imports: [DatePipe],
  template: `<dl class="grid gap-3 sm:grid-cols-3" aria-label="Prazos do atendimento">
    @for (deadline of deadlines(); track deadline.key) {
      <div class="rounded-deadline border border-line p-5">
        <dt class="text-sm font-medium">{{ deadline.label }}</dt>
        <dd class="m-0 mt-3">
          <p
            class="text-sm font-semibold"
            [class.text-grn-t]="deadline.state === 'fulfilled'"
            [class.text-danger]="deadline.state === 'overdue'"
          >
            {{
              deadline.state === 'fulfilled'
                ? 'Cumprido'
                : deadline.state === 'overdue'
                  ? 'Prazo ultrapassado'
                  : 'Em andamento'
            }}
          </p>
          <p class="mt-2 text-xs text-ink3">Prazo contratual</p>
          <time class="text-sm tabular-nums" [attr.datetime]="deadline.target">{{
            deadline.target | date: 'dd/MM/yyyy, HH:mm' : '-0300'
          }}</time>
          @if (deadline.completedAt) {
            <p class="mt-2 text-xs text-ink3">
              Concluído em
              <time class="tabular-nums" [attr.datetime]="deadline.completedAt">{{
                deadline.completedAt | date: 'dd/MM, HH:mm' : '-0300'
              }}</time>
            </p>
          } @else {
            <p class="mt-2 text-xs text-ink3">Sem conclusão registrada no exemplo.</p>
          }
        </dd>
      </div>
    }
  </dl>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ClientDeadlines {
  readonly deadlines = input.required<readonly ClientDeadline[]>();
}
