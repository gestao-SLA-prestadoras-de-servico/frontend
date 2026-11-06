import { DOCUMENT } from '@angular/common';
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
import { ManagerTicketDemoStore, ManagerTicketPriority } from '../data/manager-ticket-demo-store';

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

@Component({
  selector: 'app-manager-ticket-detail',
  imports: [RouterLink, ButtonSecondary, PageHeading, LucideDynamicIcon],
  templateUrl: './manager-ticket-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerTicketDetail {
  private readonly store = inject(ManagerTicketDemoStore);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('triageDialog');
  private readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelTriageButton');
  private readonly positionField = viewChild<ElementRef<HTMLTextAreaElement>>('firstPositionField');
  private readonly noticeTarget = viewChild<ElementRef<HTMLElement>>('triageNotice');
  private trigger?: HTMLButtonElement;
  protected readonly ready = signal(false);
  private completing = false;
  private readonly routeId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    {
      initialValue: Number(this.route.snapshot.paramMap.get('id')),
    },
  );
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly ticket = computed(() => this.store.byId(this.routeId()));
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
