import { ManagerTicketBadge } from '../components/manager-ticket-badge';
import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerPanel,
  ManagerDialog,
  ManagerSectionHeading,
  ManagerLabel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { Textarea } from '@app/shared/ui/input/textarea.directive';
import { Select } from '@app/shared/ui/input/select.directive';
import { DatePipe, DOCUMENT, NgClass } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { concat, forkJoin, map, Observable, toArray } from 'rxjs';
import { LucideDynamicIcon } from '@lucide/angular';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro, naoEncontrado, problema } from '@app/core/api/erros';
import { ChamadoGestor, Prioridade } from '@app/core/api/modelos';
import { UsuariosApi } from '@app/core/api/usuarios.api';
import { ButtonSecondary, ButtonPrimary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { EvidenceDownload, EvidenceImage } from '../../components/evidence-image';
import { SlaApuracao } from '../../components/sla-apuracao';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { Deadline } from '../../data/chamado';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import {
  ACTIVE_STATUSES,
  loadManagerNames,
  ManagerTicketEvidence,
  ManagerTicketPriority,
  toManagerTicket,
} from '../data/manager-ticket';
import { loadSlaPolicies, SLA_CLOCKS, windowExample } from '../data/sla-policy-data';

const PRIORIDADE: Record<ManagerTicketPriority, Prioridade> = { Alta: 'ALTA', Normal: 'NORMAL' };
const POLLING_MS = 3000;
const EVIDENCE_LABELS: Record<ManagerTicketEvidence['status'], string> = {
  RECEBIDA: 'Recebida',
  PROCESSANDO: 'Processando',
  DISPONIVEL: 'Disponível',
  FALHA: 'Falha',
  EXPURGADA: 'Expurgada',
};

type AssignmentMode = 'initial' | 'reassign' | null;

@Component({
  selector: 'app-manager-ticket-detail',
  imports: [
    NgClass,
    RouterLink,
    ButtonSecondary,
    PageHeading,
    LucideDynamicIcon,
    Select,
    Textarea,
    ButtonPrimary,
    ManagerPanel,
    ManagerDialog,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerTextAction,
    ManagerPageHeader,
    ManagerTicketBadge,
    DatePipe,
    EvidenceImage,
    EvidenceDownload,
    SlaApuracao,
    WorkspaceLoadingState,
  ],
  templateUrl: './manager-ticket-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerTicketDetail {
  private readonly api = inject(ChamadosApi);
  private readonly usuarios = inject(UsuariosApi);
  private readonly cadastro = inject(CadastroApi);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('triageDialog');
  private readonly assignmentDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('assignmentDialog');
  private readonly cancelDialog = viewChild.required<ElementRef<HTMLDialogElement>>('cancelDialog');
  private readonly evidenceDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('evidenceDialog');
  private readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelTriageButton');
  private readonly cancelAssignmentButton =
    viewChild<ElementRef<HTMLButtonElement>>('cancelAssignmentButton');
  private readonly cancelSafetyButton =
    viewChild<ElementRef<HTMLButtonElement>>('cancelSafetyButton');
  private readonly cancelEvidenceButton =
    viewChild<ElementRef<HTMLButtonElement>>('cancelEvidenceButton');
  private readonly positionField = viewChild<ElementRef<HTMLTextAreaElement>>('firstPositionField');
  private readonly cancelReasonField =
    viewChild<ElementRef<HTMLTextAreaElement>>('cancelReasonField');
  private readonly evidenceNoticeTarget =
    viewChild<ElementRef<HTMLElement>>('evidenceNoticeTarget');
  private readonly noticeTarget = viewChild<ElementRef<HTMLElement>>('triageNotice');
  private readonly assignmentNoticeTarget =
    viewChild<ElementRef<HTMLElement>>('assignmentNoticeTarget');
  private readonly cancelNoticeTarget = viewChild<ElementRef<HTMLElement>>('cancelNoticeTarget');
  private trigger?: HTMLButtonElement;
  private assignmentTrigger?: HTMLButtonElement;
  private cancelTrigger?: HTMLButtonElement;
  private evidenceTrigger?: HTMLButtonElement;
  protected readonly ready = signal(false);
  private completing = false;
  private readonly routeId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.snapshot.paramMap.get('id') ?? '',
  });
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly evidenceLabels = EVIDENCE_LABELS;

  protected readonly data = rxResource({
    params: () => this.routeId(),
    stream: ({ params: id }) =>
      forkJoin({
        chamado: this.api.detalhe<ChamadoGestor>(id),
        historico: this.api.historico(id),
        evidencias: this.api.evidencias(id),
        names: loadManagerNames(this.usuarios, this.cadastro),
        politicas: loadSlaPolicies(this.cadastro),
        tecnicos: this.usuarios.tecnicos(),
        sla: this.api.sla(id),
      }).pipe(
        map(({ chamado, historico, evidencias, names, politicas, tecnicos, sla }) => ({
          sla,
          ticket: toManagerTicket(chamado, names, historico, evidencias),
          matrix: politicas
            .flatMap((p) => p.versions)
            .find((v) => v.id === chamado.politicaVersaoId)?.matrix,
          tecnicos,
        })),
      ),
  });
  protected readonly ticket = computed(() => this.data.value()?.ticket ?? null);
  protected readonly missing = computed(() => naoEncontrado(this.data.error()));
  protected readonly loadError = computed(() =>
    this.data.error() && !this.missing() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly busy = signal(false);
  protected readonly selectedEvidence = computed(
    () =>
      this.ticket()?.evidences.find((evidence) => evidence.id === this.selectedEvidenceId()) ??
      null,
  );
  /** A prioridade pode mudar até o técnico resolver; o posicionamento é registrado uma vez. */
  protected readonly canTriage = computed(() =>
    ACTIVE_STATUSES.includes(this.ticket()?.status ?? 'ENCERRADO'),
  );
  protected readonly needsFirstPosition = computed(() => !this.ticket()?.firstPosition);
  protected readonly selectedPriority = signal<ManagerTicketPriority>('Normal');
  protected readonly firstPosition = signal('');
  protected readonly submitted = signal(false);
  protected readonly reviewOpen = signal(false);
  protected readonly successMessage = signal('');
  protected readonly triageError = signal<string | null>(null);
  protected readonly triagePriorities: readonly ManagerTicketPriority[] = ['Alta', 'Normal'];
  /** Prazos reais da versão da política com que o chamado foi aberto. */
  protected readonly priorityOptions = computed(() => {
    const matrix = this.data.value()?.matrix;
    const of = (key: 'alta' | 'normal') =>
      SLA_CLOCKS.map((clock) => ({
        label: clock.shortLabel,
        value: matrix ? windowExample(matrix[key][clock.key]).replace(' de janela', '') : '—',
      }));
    return { Alta: of('alta'), Normal: of('normal') } as Record<
      ManagerTicketPriority,
      readonly { label: string; value: string }[]
    >;
  });
  protected readonly priorityChanged = computed(
    () => this.selectedPriority() !== this.ticket()?.definedPriority,
  );
  protected readonly assignmentMode = signal<AssignmentMode>(null);
  protected readonly selectedTechnicianId = signal('');
  protected readonly assignmentNotice = signal('');
  protected readonly assignmentError = signal<string | null>(null);
  protected readonly cancelNotice = signal('');
  protected readonly cancelReason = signal('');
  protected readonly cancelSubmitted = signal(false);
  protected readonly cancelServerError = signal<string | null>(null);
  protected readonly cancelError = computed(
    () => this.cancelSubmitted() && this.cancelReason().trim().length < 10,
  );
  protected readonly selectedEvidenceId = signal('');
  protected readonly reprocessingEvidenceId = signal<string | null>(null);
  protected readonly evidenceNotice = signal<{
    tone: 'loading' | 'success' | 'error';
    title: string;
    detail: string;
  } | null>(null);
  /** Preferência escolhida nesta tela até o recarregamento confirmar. */
  private readonly notificationOverride = signal<boolean | null>(null);
  protected readonly notificationDisabled = computed(() => {
    const ticket = this.ticket();
    return !ticket || ['CANCELADO', 'ENCERRADO'].includes(ticket.status) || this.busy();
  });
  protected readonly notificationPreference = computed(
    () => this.notificationOverride() ?? this.ticket()?.notifyOnCompletion ?? false,
  );
  protected readonly notificationState = computed(() =>
    this.notificationDisabled() && !this.busy()
      ? 'Indisponível'
      : this.notificationPreference()
        ? 'Ligado'
        : 'Desligado',
  );
  protected readonly notificationNotice = signal('');
  protected readonly technicians = computed(() =>
    (this.data.value()?.tecnicos ?? [])
      .filter((t) => t.sub !== this.ticket()?.technicianSub)
      .map((t) => ({ id: t.id, sub: t.sub, name: t.nome, open: t.chamadosNaoFinalizados })),
  );
  protected readonly selectedTechnician = computed(
    () => this.technicians().find((user) => user.id === this.selectedTechnicianId()) ?? null,
  );
  protected readonly canAssign = computed(() =>
    ACTIVE_STATUSES.includes(this.ticket()?.status ?? 'ENCERRADO'),
  );
  protected readonly canCancel = computed(() =>
    ACTIVE_STATUSES.includes(this.ticket()?.status ?? 'ENCERRADO'),
  );

  constructor() {
    afterNextRender(() => this.ready.set(true));
    // Ao abrir (ou trocar de) chamado, a triagem parte da prioridade atual.
    effect(() => {
      const ticket = this.ticket();
      if (!ticket) return;
      this.selectedPriority.set(
        ticket.definedPriority ?? ticket.suggestedPriority ?? ticket.priority,
      );
    });
    // Evidências em RECEBIDA/PROCESSANDO mudam sozinhas no backend: recarrega até estabilizar.
    effect((onCleanup) => {
      const pending = this.ticket()?.evidences.some(
        (e) => e.status === 'RECEBIDA' || e.status === 'PROCESSANDO',
      );
      if (!pending || this.data.isLoading()) return;
      const timer = setTimeout(() => this.data.reload(), POLLING_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected deadlineClasses(deadline: Deadline): string {
    return deadline.state === 'overdue'
      ? 'bg-danger-bg text-danger'
      : deadline.state === 'fulfilled'
        ? 'bg-grn-bg text-grn-t'
        : 'bg-pri-bg text-pri-d';
  }

  /** Executa uma ação, recarrega o chamado e devolve o erro em português (ou null). */
  private run(request: Observable<unknown>, done: (erro: string | null) => void): void {
    if (this.busy()) return;
    this.busy.set(true);
    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.data.reload();
        done(null);
      },
      error: (erro: unknown) => {
        this.busy.set(false);
        if (problema(erro)?.codigo === 'CONFLITO_VERSAO') this.data.reload();
        done(mensagemErro(erro));
      },
    });
  }

  protected updatePriority(priority: ManagerTicketPriority): void {
    this.selectedPriority.set(priority);
  }

  protected updateFirstPosition(event: Event): void {
    this.firstPosition.set((event.target as HTMLTextAreaElement).value);
  }

  protected submitTriage(trigger: HTMLButtonElement): void {
    if (!this.ready() || !this.canTriage()) return;
    this.submitted.set(true);
    this.triageError.set(null);
    if (this.invalidFirstPosition() || (!this.needsFirstPosition() && !this.priorityChanged())) {
      this.positionField()?.nativeElement.focus();
      return;
    }
    this.trigger = trigger;
    this.completing = false;
    this.reviewOpen.set(true);
    afterNextRender(
      () => {
        if (this.dialog().nativeElement.open) return;
        this.dialog().nativeElement.showModal();
        this.cancelButton()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected closeTriageReview(): void {
    if (this.dialog().nativeElement.open) this.dialog().nativeElement.close();
  }

  protected onTriageDialogClose(): void {
    if (!this.completing) this.trigger?.focus();
    this.trigger = undefined;
    this.completing = false;
    this.reviewOpen.set(false);
  }

  protected onTriageBackdrop(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      this.closeTriageReview();
  }

  protected trapTriageFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.dialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href]',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (
      (event.shiftKey && this.document.activeElement === first) ||
      (!event.shiftKey && this.document.activeElement === last)
    ) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }

  /** Prioridade (se mudou) e depois o primeiro posicionamento (se ainda não houver). */
  protected confirmTriage(): void {
    const ticket = this.ticket();
    if (!ticket || !this.reviewOpen() || this.invalidFirstPosition()) return;
    const positioning = this.needsFirstPosition();
    const steps: Observable<unknown>[] = [];
    if (this.priorityChanged())
      steps.push(this.api.definirPrioridade(ticket.id, PRIORIDADE[this.selectedPriority()]));
    if (positioning) steps.push(this.api.posicionar(ticket.id, this.firstPosition().trim()));
    this.run(concat(...steps).pipe(toArray()), (erro) => {
      this.triageError.set(erro);
      if (erro) return;
      this.successMessage.set(
        positioning
          ? 'Triagem registrada e primeiro posicionamento enviado ao cliente.'
          : `Prioridade alterada para ${this.selectedPriority()}. Os prazos foram recalculados.`,
      );
      this.firstPosition.set('');
      this.submitted.set(false);
      this.completing = true;
      this.closeTriageReview();
      afterNextRender(() => this.noticeTarget()?.nativeElement.focus(), {
        injector: this.injector,
      });
    });
  }

  protected clearSuccess(): void {
    this.successMessage.set('');
  }

  protected updateTechnician(event: Event): void {
    this.selectedTechnicianId.set((event.target as HTMLSelectElement).value);
  }

  protected openAssignment(trigger: HTMLButtonElement): void {
    const item = this.ticket();
    if (!this.ready() || !item || !this.canAssign()) return;
    this.assignmentTrigger = trigger;
    this.completing = false;
    this.assignmentMode.set(item.technician ? 'reassign' : 'initial');
    this.selectedTechnicianId.set('');
    this.assignmentError.set(null);
    afterNextRender(
      () => {
        if (this.assignmentDialog().nativeElement.open) return;
        this.assignmentDialog().nativeElement.showModal();
        this.cancelAssignmentButton()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected closeAssignment(): void {
    if (this.assignmentDialog().nativeElement.open) this.assignmentDialog().nativeElement.close();
  }

  protected onAssignmentDialogClose(): void {
    if (!this.completing) this.assignmentTrigger?.focus();
    this.assignmentTrigger = undefined;
    this.completing = false;
    this.assignmentMode.set(null);
    this.selectedTechnicianId.set('');
  }

  protected onAssignmentBackdrop(event: MouseEvent): void {
    const dialog = this.assignmentDialog().nativeElement;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      this.closeAssignment();
  }

  protected trapAssignmentFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.assignmentDialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), select:not([disabled])',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (
      (event.shiftKey && this.document.activeElement === first) ||
      (!event.shiftKey && this.document.activeElement === last)
    ) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }

  protected confirmAssignment(): void {
    const item = this.ticket();
    const candidate = this.selectedTechnician();
    if (!item || !candidate) return;
    const previous = item.technician;
    this.run(this.api.atribuir(item.id, candidate.sub, item.version), (erro) => {
      this.assignmentError.set(erro);
      if (erro) return;
      this.assignmentNotice.set(
        previous
          ? `Responsável alterado de ${previous} para ${candidate.name}. Os dois foram notificados.`
          : `${candidate.name} agora é o técnico responsável e foi notificado(a).`,
      );
      this.completing = true;
      this.closeAssignment();
      afterNextRender(() => this.assignmentNoticeTarget()?.nativeElement.focus(), {
        injector: this.injector,
      });
    });
  }

  protected clearAssignmentNotice(): void {
    this.assignmentNotice.set('');
  }

  protected openCancellation(trigger: HTMLButtonElement): void {
    if (!this.ready() || !this.canCancel()) return;
    this.cancelTrigger = trigger;
    this.completing = false;
    this.cancelReason.set('');
    this.cancelSubmitted.set(false);
    this.cancelServerError.set(null);
    afterNextRender(
      () => {
        if (this.cancelDialog().nativeElement.open) return;
        this.cancelDialog().nativeElement.showModal();
        this.cancelSafetyButton()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected updateCancelReason(event: Event): void {
    this.cancelReason.set((event.target as HTMLTextAreaElement).value);
  }

  protected closeCancellation(): void {
    if (this.cancelDialog().nativeElement.open) this.cancelDialog().nativeElement.close();
  }

  protected onCancelDialogClose(): void {
    if (!this.completing) this.cancelTrigger?.focus();
    this.cancelTrigger = undefined;
    this.completing = false;
  }

  protected onCancelBackdrop(event: MouseEvent): void {
    const dialog = this.cancelDialog().nativeElement;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      this.closeCancellation();
  }

  protected trapCancelFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.cancelDialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (
      (event.shiftKey && this.document.activeElement === first) ||
      (!event.shiftKey && this.document.activeElement === last)
    ) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }

  protected confirmCancellation(): void {
    this.cancelSubmitted.set(true);
    if (this.cancelReason().trim().length < 10) {
      this.cancelReasonField()?.nativeElement.focus();
      return;
    }
    const ticket = this.ticket();
    if (!ticket) return;
    this.run(this.api.cancelar(ticket.id, this.cancelReason().trim()), (erro) => {
      this.cancelServerError.set(erro);
      if (erro) return;
      this.cancelNotice.set('Chamado cancelado. Os relógios de SLA foram encerrados.');
      this.completing = true;
      this.closeCancellation();
      afterNextRender(() => this.cancelNoticeTarget()?.nativeElement.focus(), {
        injector: this.injector,
      });
    });
  }

  protected clearCancelNotice(): void {
    this.cancelNotice.set('');
  }

  protected openEvidenceReprocess(evidenceId: string, trigger: HTMLButtonElement): void {
    const evidence = this.ticket()?.evidences.find((item) => item.id === evidenceId);
    if (!this.ready() || !evidence || evidence.status !== 'FALHA') return;
    this.evidenceTrigger = trigger;
    this.completing = false;
    this.selectedEvidenceId.set(evidenceId);
    afterNextRender(
      () => {
        if (this.evidenceDialog().nativeElement.open) return;
        this.evidenceDialog().nativeElement.showModal();
        this.cancelEvidenceButton()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected closeEvidenceDialog(): void {
    if (this.evidenceDialog().nativeElement.open) this.evidenceDialog().nativeElement.close();
  }

  protected onEvidenceDialogClose(): void {
    const trigger = this.evidenceTrigger;
    if (!this.completing && trigger?.isConnected) {
      afterNextRender(() => trigger.focus(), { injector: this.injector });
    }
    this.evidenceTrigger = undefined;
    this.completing = false;
    this.selectedEvidenceId.set('');
  }

  protected onEvidenceBackdrop(event: MouseEvent): void {
    const dialog = this.evidenceDialog().nativeElement;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      this.closeEvidenceDialog();
  }

  protected trapEvidenceFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.evidenceDialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), select:not([disabled])',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (
      (event.shiftKey && this.document.activeElement === first) ||
      (!event.shiftKey && this.document.activeElement === last)
    ) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }

  protected confirmEvidenceReprocess(): void {
    const evidence = this.selectedEvidence();
    if (!evidence || evidence.status !== 'FALHA') return;
    this.reprocessingEvidenceId.set(evidence.id);
    this.run(this.api.reprocessarEvidencia(evidence.id), (erro) => {
      this.reprocessingEvidenceId.set(null);
      this.evidenceNotice.set(
        erro
          ? { tone: 'error', title: 'Não foi possível reprocessar', detail: erro }
          : {
              tone: 'loading',
              title: 'Reprocessamento iniciado',
              detail:
                'O arquivo original foi preservado. A miniatura atualiza sozinha em instantes.',
            },
      );
      this.completing = true;
      this.closeEvidenceDialog();
      afterNextRender(() => this.evidenceNoticeTarget()?.nativeElement.focus(), {
        injector: this.injector,
      });
    });
  }

  protected clearEvidenceNotice(): void {
    this.evidenceNotice.set(null);
  }

  protected updateNotificationPreference(event: Event): void {
    const ticket = this.ticket();
    if (!ticket || this.notificationDisabled()) return;
    const enabled = (event.target as HTMLInputElement).checked;
    this.notificationOverride.set(enabled);
    this.run(this.api.preferenciaNotificacao(ticket.id, enabled), (erro) => {
      this.notificationOverride.set(erro ? !enabled : null);
      this.notificationNotice.set(
        erro ??
          (enabled
            ? 'Você será avisado(a) quando este chamado for concluído.'
            : 'Você não receberá aviso de conclusão deste chamado.'),
      );
    });
  }

  protected clearNotificationNotice(): void {
    this.notificationNotice.set('');
  }

  protected hasProcessingEvidence(evidences: readonly ManagerTicketEvidence[]): boolean {
    return evidences.some((evidence) => evidence.status === 'PROCESSANDO');
  }

  protected isInProgress(): boolean {
    return this.ticket()?.status === 'EM_ATENDIMENTO';
  }

  protected invalidFirstPosition(): boolean {
    return this.needsFirstPosition() && this.submitted() && this.firstPosition().trim().length < 12;
  }
}
