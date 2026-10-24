import { Component, ElementRef, viewChild } from '@angular/core';
import { ActionLabel } from '../action-label/action-label';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-availability-dialog',
  imports: [Icon, ActionLabel],
  templateUrl: './availability-dialog.html',
  styleUrl: './availability-dialog.css',
})
export class AvailabilityDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private trigger: HTMLElement | null = null;

  get isOpen(): boolean {
    return this.dialog().nativeElement.open;
  }

  open(trigger: HTMLElement): void {
    this.trigger = trigger;
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  protected keepFocusInDialog(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const dialog = this.dialog().nativeElement;
    const buttons = dialog.querySelectorAll<HTMLButtonElement>('button');
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const active = dialog.ownerDocument.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected restoreFocus(): void {
    this.trigger?.focus({ preventScroll: true });
    this.trigger = null;
  }
}
