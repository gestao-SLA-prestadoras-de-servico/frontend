import { DatePipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import { ClientTicket } from '../data/client-data';

type ReviewAction = 'confirm' | 'reopen';
@Component({
  selector: 'app-client-review',
  imports: [DatePipe, ReactiveFormsModule, ButtonPrimary, ButtonSecondary],
  templateUrl: './client-review.html',
  styleUrl: '../client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientReview {
  readonly ticket = input.required<ClientTicket>();
  private readonly injector = inject(Injector);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('reviewDialog');
  private readonly cancel = viewChild<ElementRef<HTMLButtonElement>>('cancel');
  private readonly reasonField = viewChild<ElementRef<HTMLTextAreaElement>>('reasonField');
  private readonly feedback = viewChild<ElementRef<HTMLElement>>('feedback');
  private trigger?: HTMLButtonElement;
  private completing = false;
  protected readonly ready = signal(false);
  protected readonly action = signal<ReviewAction>('confirm');
  protected readonly result = signal<ReviewAction | null>(null);
  protected readonly attempted = signal(false);
  protected readonly reason = new FormControl('', {
    nonNullable: true,
    validators: [
      (control) => {
        const length = String(control.value).trim().length;
        return length >= 20 && length <= 1000 ? null : { reason: true };
      },
    ],
  });
  protected readonly form = new FormGroup({ reason: this.reason });

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }
  protected get invalidReason(): boolean {
    return this.reason.invalid && (this.reason.touched || this.attempted());
  }
  protected open(action: ReviewAction, trigger: HTMLButtonElement): void {
    if (this.ticket().status !== 'RESOLVIDO' || !this.ready()) return;
    this.trigger = trigger;
    this.completing = false;
    this.action.set(action);
    this.attempted.set(false);
    this.reason.reset();
    afterNextRender(
      () => {
        this.dialog().nativeElement.showModal();
        (action === 'reopen'
          ? this.reasonField()?.nativeElement
          : this.cancel()?.nativeElement
        )?.focus();
      },
      { injector: this.injector },
    );
  }
  protected close(): void {
    this.dialog().nativeElement.close();
  }
  protected onClose(): void {
    // A successful submit focuses its feedback after rendering. Firefox dispatches
    // the close event later; restoring the trigger here would steal that focus.
    if (!this.completing) this.trigger?.focus();
  }
  protected onBackdrop(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      this.close();
  }
  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.dialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]),textarea',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0],
      last = elements[elements.length - 1];
    const active = this.dialog().nativeElement.ownerDocument.activeElement;
    if ((event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }
  protected submit(): void {
    if (this.ticket().status !== 'RESOLVIDO') return;
    this.attempted.set(true);
    this.reason.markAsTouched();
    if (this.action() === 'reopen' && this.reason.invalid) {
      this.reasonField()?.nativeElement.focus();
      return;
    }
    this.result.set(this.action());
    this.completing = true;
    this.close();
    afterNextRender(() => this.feedback()?.nativeElement.focus(), { injector: this.injector });
  }
}
