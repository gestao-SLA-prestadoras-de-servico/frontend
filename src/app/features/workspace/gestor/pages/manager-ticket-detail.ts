import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LucideDynamicIcon } from '@lucide/angular';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ManagerTicketDemoStore } from '../data/manager-ticket-demo-store';

@Component({
  selector: 'app-manager-ticket-detail',
  imports: [RouterLink, PageHeading, LucideDynamicIcon],
  templateUrl: './manager-ticket-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerTicketDetail {
  private readonly store = inject(ManagerTicketDemoStore);
  private readonly route = inject(ActivatedRoute);
  private readonly routeId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    {
      initialValue: Number(this.route.snapshot.paramMap.get('id')),
    },
  );
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly ticket = computed(() => this.store.byId(this.routeId()));
  protected statusLabel(status: string): string {
    return (
      {
        ABERTO: 'Aberto',
        ATRIBUIDO: 'Atribuído',
        EM_ATENDIMENTO: 'Em atendimento',
        RESOLVIDO: 'Resolvido',
        CANCELADO: 'Cancelado',
        ENCERRADO: 'Encerrado',
      }[status] ?? status
    );
  }
}
