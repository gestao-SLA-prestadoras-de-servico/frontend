import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserDemoStore } from '../data/user-demo-store';

@Component({
  selector: 'app-manager-team-workload',
  imports: [RouterLink],
  template: `
    <section
      class="rounded-deadline border border-line bg-sf p-4 sm:p-5"
      aria-labelledby="workload-heading"
    >
      <h2 id="workload-heading" class="text-base font-semibold">Carga da equipe</h2>
      <p class="mt-1 text-[13px] leading-5 text-ink3">Atribuídos + em atendimento por técnico</p>
      <ul class="mt-5 divide-y divide-line">
        @for (technician of technicians(); track technician.id) {
          <li class="flex items-start gap-3 py-4 first:pt-0">
            <span
              class="grid size-9 shrink-0 place-items-center rounded-full bg-pri-bg text-xs font-semibold text-pri-d"
              aria-hidden="true"
              >{{ technician.initials }}</span
            >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span class="text-sm font-semibold">{{ technician.name }}</span>
                <span class="text-xs tabular-nums text-ink2"
                  >{{ technician.activeTickets }} de {{ technician.workloadLimit }}</span
                >
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-bg" aria-hidden="true">
                <span
                  class="block h-full rounded-full"
                  [class]="
                    technician.activeTickets > technician.workloadLimit ? 'bg-danger' : 'bg-pri'
                  "
                  [style.width.%]="technician.loadShare"
                ></span>
              </div>
              <p
                class="mt-1 text-xs"
                [class]="
                  technician.activeTickets >= technician.workloadLimit ? 'text-danger' : 'text-ink3'
                "
              >
                {{
                  technician.activeTickets >= technician.workloadLimit
                    ? 'No limite de capacidade'
                    : technician.workloadLimit - technician.activeTickets + ' vagas disponíveis'
                }}
              </p>
            </div>
          </li>
        } @empty {
          <li class="py-4 text-sm text-ink2">Nenhum técnico ativo.</li>
        }
      </ul>
      <p class="mt-1 text-xs leading-5 text-ink3">Carga fictícia de toda a carteira da equipe.</p>
      <a
        routerLink="/app/gestor/usuarios"
        class="mt-3 inline-flex min-h-11 items-center rounded-sm text-xs font-semibold text-pri-d underline underline-offset-4"
        >Ver equipe e disponibilidade</a
      >
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ManagerTeamWorkload {
  private readonly userStore = inject(UserDemoStore);
  protected readonly technicians = computed(() =>
    this.userStore
      .users()
      .filter((user) => user.role === 'Técnico' && user.situation === 'Ativo')
      .map((user) => {
        const activeTickets = user.assigned + user.inProgress;
        return {
          ...user,
          activeTickets,
          initials: user.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join(''),
          loadShare: user.workloadLimit
            ? Math.min((activeTickets / user.workloadLimit) * 100, 100)
            : activeTickets
              ? 100
              : 0,
        };
      })
      .sort((left, right) => right.activeTickets - left.activeTickets),
  );
}
