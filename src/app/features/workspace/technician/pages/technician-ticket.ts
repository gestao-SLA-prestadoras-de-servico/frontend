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
import { toSignal } from '@angular/core/rxjs-interop';
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
import { TechnicianEvidencePanel } from '../components/technician-evidence';
import { TechnicianTicketBadges } from '../components/technician-ticket-badges';
import { TechnicianDemoStore } from '../technician-demo-store';
import { evidenceCountsForCompletion, TechnicianEvent } from '../technician-data';

@Component({
  selector: 'app-technician-ticket',
  imports: [
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
  protected readonly store = inject(TechnicianDemoStore);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly ticketId = computed(() => Number(this.params().get('id') ?? 1042));
  protected readonly ticket = computed(() => this.store.ticket(this.ticketId()));
  protected readonly draft = signal('');
  protected readonly feedback = signal('');
  protected readonly canComplete = computed(() => this.store.canComplete(this.ticketId()));
  protected readonly hasValidEvidence = computed(
    () => this.ticket()?.evidences.some(evidenceCountsForCompletion) ?? false,
  );
  protected readonly completeDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('completeDialog');
  protected readonly cancelComplete =
    viewChild.required<ElementRef<HTMLButtonElement>>('cancelComplete');
  protected readonly completeTrigger = viewChild<ElementRef<HTMLButtonElement>>('completeTrigger');
  protected readonly completionNotice = viewChild<ElementRef<HTMLElement>>('completionNotice');

  constructor() {
    effect(() => this.draft.set(this.ticket()?.technicalDescription ?? ''));
  }

  protected onDescriptionInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected saveDescription(): void {
    const ticket = this.ticket();
    if (!ticket || ticket.status !== 'EM_ATENDIMENTO') return;
    this.store.saveDescription(ticket.id, this.draft());
    this.feedback.set('Descrição técnica salva nesta demonstração.');
  }

  protected start(): void {
    if (this.store.start(this.ticketId()))
      this.feedback.set('Atendimento iniciado nesta demonstração.');
  }

  protected openCompletion(): void {
    if (!this.canComplete()) return;
    this.completeDialog().nativeElement.showModal();
    this.cancelComplete().nativeElement.focus();
  }

  protected cancelCompletion(): void {
    this.completeDialog().nativeElement.close();
  }

  protected confirmCompletion(): void {
    if (!this.store.complete(this.ticketId())) return;
    this.feedback.set('Atendimento concluído no exemplo. Nenhum chamado foi alterado no servidor.');
    this.completeDialog().nativeElement.close();
    afterNextRender(() => this.completionNotice()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }

  protected onCompletionDialogClose(): void {
    const trigger = this.completeTrigger()?.nativeElement;
    if (trigger?.isConnected && !trigger.disabled) trigger.focus();
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
    if (current.status === 'RESOLVIDO') return this.stepLabels.map(() => 'done' as const);

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
    const resolved = current.status === 'RESOLVIDO';
    const hasDescription = current.technicalDescription.trim().length > 0;
    const evidence = current.evidences.find(evidenceCountsForCompletion);
    const [assignedEvent, startEvent] = current.events;

    return [
      { ...assignedEvent, state: 'done' },
      { ...startEvent, state: started ? 'done' : 'current' },
      {
        label: 'Descrição técnica',
        at: hasDescription
          ? 'Salva nesta demonstração'
          : started
            ? 'Aguardando registro'
            : 'Próxima etapa',
        state: resolved || hasDescription ? 'done' : started && !evidence ? 'current' : 'upcoming',
      },
      {
        label: 'Evidências válidas',
        at: evidence?.recordedAt ?? (started ? 'Aguarda evidência válida' : 'Próxima etapa'),
        state: resolved || evidence ? 'done' : started && hasDescription ? 'current' : 'upcoming',
      },
      {
        label: 'Revisão e conclusão',
        at: resolved
          ? 'Concluída no exemplo'
          : evidence
            ? 'Disponível para revisão'
            : 'Aguarda evidência válida',
        state: resolved ? 'done' : started && evidence ? 'current' : 'upcoming',
      },
    ];
  });
}
