import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manager-sla-health',
  imports: [RouterLink],
  template: `
    <section
      class="h-full rounded-deadline border border-line bg-sf p-4 sm:p-5"
      aria-labelledby="health-heading"
    >
      <h2 id="health-heading" class="text-base font-semibold">Saúde do SLA</h2>
      <p class="mt-1 text-[13px] leading-5 text-ink3">
        {{ total() }} chamados não finalizados · cenário atual
      </p>
      <div class="relative mx-auto mt-5 grid size-40 place-items-center">
        <svg
          class="pointer-events-none absolute inset-0 size-full -rotate-90"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="48" fill="none" class="stroke-bg" stroke-width="9" />
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            class="stroke-grn"
            stroke-width="9"
            pathLength="100"
            [attr.stroke-dasharray]="percentage() + ' 100'"
          />
        </svg>
        <p class="relative text-center">
          <span class="block text-[28px] font-semibold tabular-nums">{{
            total() ? percentage() + '%' : '—'
          }}</span
          ><span class="text-xs text-ink2">{{ total() ? 'sem violação' : 'Sem chamados' }}</span>
        </p>
      </div>
      <dl class="mt-5 space-y-3 text-[13px]">
        <div class="flex items-center justify-between gap-3">
          <dt class="inline-flex items-center gap-2">
            <span class="size-2 rounded-full bg-grn" aria-hidden="true"></span>Dentro do SLA
          </dt>
          <dd class="m-0 font-semibold tabular-nums">{{ total() - violated() }}</dd>
        </div>
        <div class="flex items-center justify-between gap-3">
          <dt class="inline-flex items-center gap-2">
            <span class="size-2 rounded-full bg-danger" aria-hidden="true"></span>Violados
          </dt>
          <dd class="m-0 font-semibold tabular-nums text-danger">{{ violated() }}</dd>
        </div>
      </dl>
      <a
        routerLink="/app/gestor/chamados"
        class="mt-4 inline-flex min-h-11 items-center rounded-sm text-xs font-semibold text-pri-d underline underline-offset-4"
        >Acompanhar prazos na fila</a
      >
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ManagerSlaHealth {
  readonly total = input.required<number>();
  readonly violated = input.required<number>();
  protected readonly percentage = computed(() =>
    this.total() ? Math.round(((this.total() - this.violated()) / this.total()) * 100) : 0,
  );
}
