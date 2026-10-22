import { Component, ElementRef, viewChild } from '@angular/core';
import { Icon } from './icon';
import { ActionLabel } from './action-label';

@Component({
  selector: 'app-availability-dialog',
  imports: [Icon, ActionLabel],
  template: `
    <dialog
      #dialog
      aria-labelledby="availability-title"
      aria-describedby="availability-description"
      (close)="restoreFocus()"
      (keydown)="keepFocusInDialog($event)"
    >
      <button class="close" type="button" aria-label="Fechar aviso" (click)="close()">
        <app-icon name="close" />
      </button>
      <app-icon class="dialog-symbol" name="clock" />
      <h2 id="availability-title">Estamos construindo a Nivelo</h2>
      <p id="availability-description">
        A Nivelo está em desenvolvimento. O acesso ao sistema ainda não está disponível.
      </p>
      <button class="button button-primary" type="button" autofocus (click)="close()">
        <app-action-label label="Entendi" />
      </button>
    </dialog>
  `,
  styles: `
    dialog {
      position: fixed;
      inset: 0;
      margin: auto;
      width: min(460px, calc(100% - 40px));
      max-height: calc(100dvh - 40px);
      padding: 36px;
      color: var(--ink);
      background: var(--sf);
      border: 0;
      border-radius: var(--radius);
      box-shadow: var(--shadow-dialog);
    }
    dialog::backdrop {
      background: rgb(11 37 69 / 55%);
    }
    @supports (transition-behavior: allow-discrete) {
      dialog {
        opacity: 0;
        transform: scale(0.98);
        transition:
          opacity var(--motion-overlay-out) var(--ease-out),
          transform var(--motion-overlay-out) var(--ease-out),
          display var(--motion-overlay-out) allow-discrete,
          overlay var(--motion-overlay-out) allow-discrete;
      }
      dialog[open] {
        opacity: 1;
        transform: none;
        transition-duration: var(--motion-overlay-in);
      }
      dialog::backdrop {
        opacity: 0;
        transition:
          opacity var(--motion-overlay-out) var(--ease-out),
          display var(--motion-overlay-out) allow-discrete,
          overlay var(--motion-overlay-out) allow-discrete;
      }
      dialog[open]::backdrop {
        opacity: 1;
        transition-duration: var(--motion-overlay-in);
      }
      @starting-style {
        dialog[open] {
          opacity: 0;
          transform: scale(0.98);
        }
        dialog[open]::backdrop {
          opacity: 0;
        }
      }
    }
    @media (prefers-reduced-motion: reduce) {
      dialog {
        transform: none;
      }
      @starting-style {
        dialog[open] {
          transform: none;
        }
      }
    }
    .close {
      position: absolute;
      right: 8px;
      top: 8px;
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: var(--radius-control);
      background: transparent;
      color: var(--ink2);
      transition: background-color var(--motion-feedback) var(--ease-out);
    }
    .close:hover {
      background: var(--bg);
    }
    .dialog-symbol {
      width: 36px;
      height: 36px;
      color: var(--pri);
      margin-bottom: 20px;
    }
    h2 {
      font-size: 1.75rem;
    }
    p {
      color: var(--ink2);
      margin: 16px 0 28px;
    }
    .button {
      width: 100%;
    }
    @media (max-width: 400px) {
      dialog {
        padding: 28px;
      }
    }
  `,
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
