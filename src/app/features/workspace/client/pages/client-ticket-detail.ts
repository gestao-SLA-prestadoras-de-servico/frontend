import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { LucideDynamicIcon } from '@lucide/angular';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro, naoEncontrado } from '@app/core/api/erros';
import { ChamadoCliente } from '@app/core/api/modelos';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { EvidenceDownload, EvidenceImage } from '../../components/evidence-image';
import { SlaApuracao } from '../../components/sla-apuracao';
import { MissingPage } from '../../components/missing-page/missing-page';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ClientDeadlines } from '../components/client-deadlines';
import { ClientReview } from '../components/client-review';
import { ClientStatusBadge } from '../components/client-status';
import { ClientPriorityBadge } from '../components/client-priority';
import { toClientEvent, toClientTicket } from '../data/client-data';

@Component({
  selector: 'app-client-ticket-detail',
  imports: [
    DatePipe,
    RouterLink,
    PageHeading,
    LucideDynamicIcon,
    ClientStatusBadge,
    ClientPriorityBadge,
    ClientDeadlines,
    ClientReview,
    EvidenceImage,
    EvidenceDownload,
    SlaApuracao,
    MissingPage,
    WorkspaceLoadingState,
  ],
  templateUrl: './client-ticket-detail.html',
  styleUrl: '../client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTicketDetail {
  private readonly api = inject(ChamadosApi);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly icons = WORKSPACE_ICONS;

  protected readonly data = rxResource({
    params: () => this.params().get('id') ?? '',
    stream: ({ params: id }) =>
      forkJoin({
        chamado: this.api.detalhe<ChamadoCliente>(id),
        historico: this.api.historico(id),
        evidencias: this.api.evidencias(id),
        contratos: this.api.meusContratos(),
        sla: this.api.sla(id),
      }).pipe(
        map(({ chamado, historico, evidencias, contratos, sla }) => ({
          sla,
          ticket: toClientTicket(chamado),
          events: historico.map(toClientEvent),
          evidences: evidencias.flatMap((grupo) => grupo.evidencias),
          contract:
            contratos.find((c) => c.id === chamado.contratoId)?.codigo ?? 'Fora de vigência',
        })),
      ),
  });
  protected readonly missing = computed(() => naoEncontrado(this.data.error()));
  protected readonly erro = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
}
