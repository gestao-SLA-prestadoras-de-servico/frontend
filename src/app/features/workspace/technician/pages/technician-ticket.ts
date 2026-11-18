import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, formatDate } from '@angular/common';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro, naoEncontrado } from '@app/core/api/erros';
import { ChamadoTecnico } from '@app/core/api/modelos';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCheck,
  LucideClock3,
  LucideMapPin,
} from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { MissingPage } from '../../components/missing-page/missing-page';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import { TechnicianEvidencePanel } from '../components/technician-evidence';
import { TechnicianTicketBadges } from '../components/technician-ticket-badges';
import {
  evidenceCountsForCompletion,
  evidencePending,
  TechnicianTicket,
  toTechnicianTicket,
} from '../technician-data';

interface TechnicianEvent {
  label: string;
  at: string;
  state: 'done' | 'current' | 'upcoming';
}

const quando = (iso?: string) =>
  iso ? formatDate(iso, 'dd/MM/yyyy, HH:mm', 'en-US', '-0300') : '';
const POLLING_MS = 3000;

@Component({
  selector: 'app-technician-ticket',
  imports: [
    DatePipe,
    RouterLink,
    LucideArrowLeft,
    LucideArrowRight,
    LucideCheck,
    LucideClock3,
    LucideMapPin,
    ButtonPrimary,
    ButtonSecondary,
    PageHeading,
    MissingPage,
    WorkspaceLoadingState,
    TechnicianEvidencePanel,
    TechnicianTicketBadges,
  ],
  templateUrl: './technician-ticket.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TechnicianTicketPage {
  private readonly route = inject(ActivatedRoute);
  private readonly injector = inject(Injector);
  private readonly api = inject(ChamadosApi);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  /**
   * `/app/tecnico/chamados/:id` abre o chamado; `/app/tecnico/atendimento` (sem id) abre o
   * atendimento em andamento que vence primeiro, ou nada.
   */
  protected readonly data = rxResource({
    params: () => this.params().get('id'),
    stream: ({ params: id }): Observable<TechnicianTicket | null> => {
      const alvo = id
        ? of(id)
        : this.api
            .listar<ChamadoTecnico>({
              estado: 'EM_ATENDIMENTO',
              size: 1,
              sort: 'proximoVencimento,asc',
            })
            .pipe(map((pagina) => pagina.content[0]?.id ?? null));
      return alvo.pipe(
        switchMap((chamadoId) =>
          chamadoId
            ? forkJoin({
                chamado: this.api.detalhe<ChamadoTecnico>(chamadoId),
                evidencias: this.api.evidencias(chamadoId),
                historico: this.api.historico(chamadoId),
              }).pipe(
                map(({ chamado, evidencias, historico }) =>
                  toTechnicianTicket(chamado, evidencias, historico),
                ),
              )
            : of(null),
        ),
      );
    },
  });
  protected readonly ticket = computed(() => this.data.value() ?? undefined);
  protected readonly missing = computed(() => naoEncontrado(this.data.error()));
  protected readonly loadError = computed(() =>
    this.data.error() && !this.missing() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly draft = signal('');
  protected readonly feedback = signal('');
  protected readonly actionError = signal<string | null>(null);
  protected readonly busy = signal(false);
  protected readonly hasValidEvidence = computed(
    () => this.ticket()?.evidences.some(evidenceCountsForCompletion) ?? false,
  );
  protected readonly canComplete = computed(() => {
    const ticket = this.ticket();
    return (
      !!ticket &&
      ticket.status === 'EM_ATENDIMENTO' &&
      ticket.technicalDescription.trim().length > 0 &&
      this.hasValidEvidence()
    );
  });
  protected readonly completeDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('completeDialog');
  protected readonly cancelComplete =
    viewChild.required<ElementRef<HTMLButtonElement>>('cancelComplete');
  protected readonly completeTrigger = viewChild<ElementRef<HTMLButtonElement>>('completeTrigger');
  protected readonly completionNotice = viewChild<ElementRef<HTMLElement>>('completionNotice');

  constructor() {
    effect(() => this.draft.set(this.ticket()?.technicalDescription ?? ''));
    // Evidência RECEBIDA/PROCESSANDO muda sozinha no backend: recarrega até estabilizar.
    effect((onCleanup) => {
      if (!this.ticket()?.evidences.some(evidencePending) || this.data.isLoading()) return;
      const timer = setTimeout(() => this.data.reload(), POLLING_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected onDescriptionInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected saveDescription(): void {
    const ticket = this.ticket();
    if (!ticket || ticket.status !== 'EM_ATENDIMENTO' || !this.draft().trim()) return;
    this.run(this.api.salvarDescricao(ticket.id, this.draft().trim()), 'Descrição técnica salva.');
  }

  protected start(): void {
    const ticket = this.ticket();
    if (ticket) this.run(this.api.iniciarAtendimento(ticket.id), 'Atendimento iniciado.');
  }

  protected openCompletion(): void {
    if (!this.canComplete()) return;
    this.actionError.set(null);
    this.completeDialog().nativeElement.showModal();
    this.cancelComplete().nativeElement.focus();
  }

  protected cancelCompletion(): void {
    this.completeDialog().nativeElement.close();
  }

  protected confirmCompletion(): void {
    const ticket = this.ticket();
    if (!ticket || !this.canComplete()) return;
    this.run(this.api.concluirAtendimento(ticket.id), 'Atendimento concluído.', () => {
      this.completeDialog().nativeElement.close();
      afterNextRender(() => this.completionNotice()?.nativeElement.focus(), {
        injector: this.injector,
      });
    });
  }

  protected onCompletionDialogClose(): void {
    const trigger = this.completeTrigger()?.nativeElement;
    if (trigger?.isConnected && !trigger.disabled) trigger.focus();
  }

  private run(request: Observable<unknown>, success: string, after?: () => void): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.actionError.set(null);
    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.feedback.set(success);
        this.data.reload();
        after?.();
      },
      error: (erro: unknown) => {
        this.busy.set(false);
        this.actionError.set(mensagemErro(erro));
      },
    });
  }

  protected readonly stepLabels = [
    'Atendimento',
    'Descrição técnica',
    'Evidências',
    'Revisão',
  ] as const;
  protected readonly stepStates = computed(() => {
    const current = this.ticket();
    if (!current) return this.stepLabels.map(() => 'upcoming' as const);
    if (current.status !== 'ATRIBUIDO' && current.status !== 'EM_ATENDIMENTO')
      return this.stepLabels.map(() => 'done' as const);

    const started = current.status === 'EM_ATENDIMENTO';
    const hasDescription = current.technicalDescription.trim().length > 0;
    const hasEvidence = current.evidences.some(evidenceCountsForCompletion);

    if (!started) return this.stepLabels.map((_, index) => (index === 0 ? 'current' : 'upcoming'));

    return this.stepLabels.map((_, index) => {
      if (index === 0) return 'done';
      if (index === 1) return hasDescription ? 'done' : hasEvidence ? 'upcoming' : 'current';
      if (index === 2) return hasEvidence ? 'done' : hasDescription ? 'current' : 'upcoming';
      return hasEvidence ? 'current' : 'upcoming';
    });
  });
  protected readonly timelineEvents = computed<readonly TechnicianEvent[]>(() => {
    const current = this.ticket();
    if (!current) return [];

    const started = current.status !== 'ATRIBUIDO';
    const resolved = started && current.status !== 'EM_ATENDIMENTO';
    const hasDescription = current.technicalDescription.trim().length > 0;
    const evidence = current.evidences.find(evidenceCountsForCompletion);

    return [
      { label: 'Chamado atribuído a você', at: quando(current.assignedAt), state: 'done' },
      {
        label: started ? 'Atendimento iniciado' : 'Início do atendimento',
        at: started ? quando(current.startedAt) : 'Aguardando ação',
        state: started ? 'done' : 'current',
      },
      {
        label: 'Descrição técnica',
        at: hasDescription ? 'Salva' : started ? 'Aguardando registro' : 'Próxima etapa',
        state: resolved || hasDescription ? 'done' : started && !evidence ? 'current' : 'upcoming',
      },
      {
        label: 'Evidências válidas',
        at: evidence
          ? quando(evidence.recordedAt)
          : started
            ? 'Aguarda evidência válida'
            : 'Próxima etapa',
        state: resolved || evidence ? 'done' : started && hasDescription ? 'current' : 'upcoming',
      },
      {
        label: 'Revisão e conclusão',
        at: resolved
          ? 'Concluída'
          : evidence && hasDescription
            ? 'Disponível para revisão'
            : 'Aguarda descrição e evidência',
        state: resolved ? 'done' : started && evidence && hasDescription ? 'current' : 'upcoming',
      },
    ];
  });
}
