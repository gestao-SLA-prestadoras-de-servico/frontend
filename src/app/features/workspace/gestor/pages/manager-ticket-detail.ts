import { DOCUMENT, NgClass } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonSecondary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import {
  ManagerTicketDemoStore,
  ManagerTicketEvidence,
  ManagerTicketPriority,
} from '../data/manager-ticket-demo-store';
import { UserDemoStore } from '../data/user-demo-store';
import {
  managerDeadlineClasses,
  managerTicketPriorityClasses,
  managerTicketStatusClasses,
} from '../data/manager-ticket-presentation';

const PRIORITY_REFERENCE = {
  Alta: [
    { label: 'Resposta', value: '30 min' },
    { label: 'Campo', value: '270 min' },
    { label: 'Resolução', value: '1.080 min' },
  ],
  Normal: [
    { label: 'Resposta', value: '120 min' },
    { label: 'Campo', value: '540 min' },
    { label: 'Resolução', value: '2.160 min' },
  ],
} satisfies Record<ManagerTicketPriority, readonly { label: string; value: string }[]>;

type AssignmentMode = 'initial' | 'reassign' | null;

@Component({
  selector: 'app-manager-ticket-detail',
  imports: [NgClass, RouterLink, ButtonSecondary, PageHeading, LucideDynamicIcon],
  templateUrl: './manager-ticket-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerTicketDetail {
  private readonly store = inject(ManagerTicketDemoStore);
  private readonly userStore = inject(UserDemoStore);
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
  private readonly routeId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    {
      initialValue: Number(this.route.snapshot.paramMap.get('id')),
    },
  );
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly statusClasses = managerTicketStatusClasses;
  protected readonly priorityClasses = managerTicketPriorityClasses;
  protected readonly deadlineClasses = managerDeadlineClasses;
  protected readonly ticket = computed(() => this.store.byId(this.routeId()));
  protected readonly selectedEvidence = computed(
    () =>
      this.ticket()?.evidences.find((evidence) => evidence.id === this.selectedEvidenceId()) ??
      null,
  );
  protected readonly isOpenTicket = computed(() => this.ticket()?.status === 'ABERTO');
  protected readonly selectedPriority = signal<ManagerTicketPriority>('Alta');
  protected readonly firstPosition = signal('');
  protected readonly submitted = signal(false);
  protected readonly reviewOpen = signal(false);
  protected readonly successMessage = signal('');
  protected readonly priorityOptions = PRIORITY_REFERENCE;
  protected readonly triagePriorities: readonly ManagerTicketPriority[] = ['Alta', 'Normal'];
  protected readonly selectedPriorityReference = computed(
    () => PRIORITY_REFERENCE[this.selectedPriority()],
  );
  protected readonly assignmentMode = signal<AssignmentMode>(null);
  protected readonly selectedTechnicianId = signal('');
  protected readonly assignmentNotice = signal('');
  protected readonly cancelNotice = signal('');
  protected readonly cancelReason = signal('');
  protected readonly cancelSubmitted = signal(false);
  protected readonly cancelError = computed(
    () => this.cancelSubmitted() && this.cancelReason().trim().length < 10,
  );
  protected readonly selectedEvidenceId = signal('');
  protected readonly reprocessOutcome = signal<'DISPONÍVEL' | 'FALHA'>('DISPONÍVEL');
  protected readonly reprocessingEvidenceId = signal<string | null>(null);
  protected readonly evidenceNotice = signal<{
    tone: 'loading' | 'success' | 'error';
    title: string;
    detail: string;
  } | null>(null);
  protected readonly notificationOverrides = signal<Readonly<Record<number, boolean>>>({});
  protected readonly notificationDisabled = computed(() => {
    const ticket = this.ticket();
    return (
      !ticket ||
      ticket.notifyOnCompletion === null ||
      ['CANCELADO', 'ENCERRADO'].includes(ticket.status)
    );
  });
  protected readonly notificationPreference = computed(() => {
    const ticket = this.ticket();
    if (!ticket || this.notificationDisabled()) return false;
    return this.notificationOverrides()[ticket.id] ?? ticket.notifyOnCompletion ?? false;
  });
  protected readonly notificationState = computed(() =>
    this.notificationDisabled()
      ? 'Indisponível'
      : this.notificationPreference()
        ? 'Ligado'
        : 'Desligado',
  );
  protected readonly notificationNotice = signal('');
  protected readonly technicians = computed(() =>
    this.userStore
      .users()
      .filter(
        (user) =>
          user.role === 'Técnico' &&
          user.situation === 'Ativo' &&
          user.name !== this.ticket()?.technician,
      ),
  );
  protected readonly selectedTechnician = computed(
    () => this.technicians().find((user) => user.id === this.selectedTechnicianId()) ?? null,
  );
  protected readonly assignmentLoadAfter = computed(() => {
    const technician = this.selectedTechnician();
    return technician ? technician.assigned + technician.inProgress + 1 : 0;
  });
  protected readonly assignmentConflict = computed(() => {
    const technician = this.selectedTechnician();
    return !!technician && this.assignmentLoadAfter() > technician.workloadLimit;
  });
  protected readonly canAssign = computed(() =>
    ['ABERTO', 'ATRIBUIDO', 'EM_ATENDIMENTO'].includes(this.ticket()?.status ?? ''),
  );
  protected readonly canCancel = computed(() =>
    ['ABERTO', 'ATRIBUIDO', 'EM_ATENDIMENTO'].includes(this.ticket()?.status ?? ''),
  );

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  protected updatePriority(priority: ManagerTicketPriority): void {
    this.selectedPriority.set(priority);
  }

  protected updateFirstPosition(event: Event): void {
    this.firstPosition.set((event.target as HTMLTextAreaElement).value);
  }

  protected submitTriage(trigger: HTMLButtonElement): void {
    if (!this.ready() || !this.isOpenTicket()) return;
    this.submitted.set(true);
    if (this.firstPosition().trim().length < 12) {
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

  protected confirmTriage(): void {
    if (!this.reviewOpen() || this.firstPosition().trim().length < 12) return;
    this.successMessage.set(
      'Triagem demonstrativa confirmada. O chamado e os prazos permaneceram inalterados.',
    );
    this.completing = true;
    this.closeTriageReview();
    afterNextRender(() => this.noticeTarget()?.nativeElement.focus(), { injector: this.injector });
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
    if (!item || !candidate || this.assignmentConflict()) return;
    const previous = item.technician;
    const kind = item.status === 'EM_ATENDIMENTO' ? 'inProgress' : 'assigned';
    const assigned = this.store.assign(item.id, candidate.name);
    if (assigned) {
      this.userStore.transferOpenAssignment(previous, candidate.name, kind);
      this.assignmentNotice.set(
        this.assignmentMode() === 'initial'
          ? `Técnico responsável atualizado para ${candidate.name} no exemplo. A fila mudou somente nesta sessão.`
          : `Responsável alterado de ${previous} para ${candidate.name} somente nesta sessão. Prazos já cumpridos permanecem como referência.`,
      );
    } else {
      this.assignmentNotice.set(
        'Não foi possível concluir esta simulação. Confira a situação do chamado e tente novamente.',
      );
    }
    this.completing = true;
    this.closeAssignment();
    afterNextRender(() => this.assignmentNoticeTarget()?.nativeElement.focus(), {
      injector: this.injector,
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
    this.cancelNotice.set(
      'Confirmação demonstrativa registrada. O status e os dados do chamado permaneceram inalterados.',
    );
    this.completing = true;
    this.closeCancellation();
    afterNextRender(() => this.cancelNoticeTarget()?.nativeElement.focus(), {
      injector: this.injector,
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
    this.reprocessOutcome.set('DISPONÍVEL');
    afterNextRender(
      () => {
        if (this.evidenceDialog().nativeElement.open) return;
        this.evidenceDialog().nativeElement.showModal();
        this.cancelEvidenceButton()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected updateReprocessOutcome(event: Event): void {
    this.reprocessOutcome.set((event.target as HTMLSelectElement).value as 'DISPONÍVEL' | 'FALHA');
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
    const ticket = this.ticket();
    const evidence = this.selectedEvidence();
    if (!ticket || !evidence || evidence.status !== 'FALHA') return;
    const evidenceId = evidence.id;
    const outcome = this.reprocessOutcome();
    if (!this.store.setEvidenceStatus(ticket.id, evidenceId, 'PROCESSANDO')) return;
    this.reprocessingEvidenceId.set(evidenceId);
    this.evidenceNotice.set({
      tone: 'loading',
      title: 'Reprocessando miniatura',
      detail: 'Estado de carregamento demonstrativo. O arquivo original não foi enviado novamente.',
    });
    this.completing = true;
    this.closeEvidenceDialog();
    afterNextRender(() => this.evidenceNoticeTarget()?.nativeElement.focus(), {
      injector: this.injector,
    });

    const finish = (): void => {
      this.store.setEvidenceStatus(ticket.id, evidenceId, outcome);
      this.reprocessingEvidenceId.set(null);
      this.evidenceNotice.set(
        outcome === 'DISPONÍVEL'
          ? {
              tone: 'success',
              title: 'Miniatura disponível',
              detail: 'A demonstração terminou sem erro. O arquivo original permaneceu preservado.',
            }
          : {
              tone: 'error',
              title: 'Nova falha na demonstração',
              detail:
                'A miniatura continua indisponível. O arquivo original permaneceu preservado.',
            },
      );
      afterNextRender(() => this.evidenceNoticeTarget()?.nativeElement.focus(), {
        injector: this.injector,
      });
    };
    const view = this.document.defaultView;
    if (view) view.setTimeout(finish, 1200);
    else finish();
  }

  protected clearEvidenceNotice(): void {
    this.evidenceNotice.set(null);
  }

  protected updateNotificationPreference(event: Event): void {
    const ticket = this.ticket();
    if (!ticket || this.notificationDisabled()) return;
    const enabled = (event.target as HTMLInputElement).checked;
    this.notificationOverrides.update((choices) => ({ ...choices, [ticket.id]: enabled }));
    this.notificationNotice.set(
      enabled
        ? 'Avisos de conclusão ligados neste chamado apenas para o seu usuário Gestor. A escolha não foi salva.'
        : 'Avisos de conclusão desligados neste chamado apenas para o seu usuário Gestor. A escolha não foi salva.',
    );
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
    return this.submitted() && this.firstPosition().trim().length < 12;
  }
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
