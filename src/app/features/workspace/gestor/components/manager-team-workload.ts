import {
  ManagerPanel,
  ManagerSectionHeading,
  ManagerTextAction,
} from './manager-surface.directive';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { mensagemErro } from '@app/core/api/erros';
import { UsuariosApi } from '@app/core/api/usuarios.api';

/** Chamados não finalizados por técnico ativo (`GET /api/tecnicos`). */
@Component({
  selector: 'app-manager-team-workload',
  imports: [RouterLink, ManagerPanel, ManagerSectionHeading, ManagerTextAction],
  template: `
    <section appManagerPanel aria-labelledby="workload-heading">
      <h2 appManagerSectionHeading id="workload-heading">Carga da equipe</h2>
      <p class="mt-1 text-[13px] leading-5 text-ink3">Chamados não finalizados por técnico ativo</p>
      @if (error(); as message) {
        <p class="mt-5 text-sm text-danger" role="alert">{{ message }}</p>
      } @else if (data.isLoading() && !technicians().length) {
        <p class="mt-5 text-sm text-ink2" role="status">Carregando equipe…</p>
      } @else {
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
                  <span class="text-xs tabular-nums text-ink2">
                    {{ technician.open }} {{ technician.open === 1 ? 'chamado' : 'chamados' }}
                  </span>
                </div>
                <div class="mt-2 h-2 overflow-hidden rounded-full bg-bg" aria-hidden="true">
                  <span
                    class="block h-full rounded-full bg-pri"
                    [style.width.%]="technician.share"
                  ></span>
                </div>
              </div>
            </li>
          } @empty {
            <li class="py-4 text-sm text-ink2">Nenhum técnico ativo.</li>
          }
        </ul>
        <p class="mt-1 text-xs leading-5 text-ink3">
          A barra compara com o técnico mais carregado da equipe.
        </p>
      }
      <a appManagerTextAction routerLink="/app/gestor/usuarios" class="mt-3 text-xs">Ver equipe</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ManagerTeamWorkload {
  private readonly api = inject(UsuariosApi);
  protected readonly data = rxResource({ stream: () => this.api.tecnicos() });
  protected readonly error = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly technicians = computed(() => {
    const tecnicos = this.data.value() ?? [];
    const max = Math.max(1, ...tecnicos.map((t) => t.chamadosNaoFinalizados));
    return tecnicos
      .map((t) => ({
        id: t.id,
        name: t.nome,
        open: t.chamadosNaoFinalizados,
        share: (t.chamadosNaoFinalizados / max) * 100,
        initials: t.nome
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join('')
          .toUpperCase(),
      }))
      .sort((left, right) => right.open - left.open);
  });
}
