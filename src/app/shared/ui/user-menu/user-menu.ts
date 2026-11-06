import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { LucideChevronDown, LucideClock3, LucideDynamicIcon, LucideLogOut } from '@lucide/angular';

@Component({
  selector: 'app-user-menu',
  imports: [LucideDynamicIcon],
  templateUrl: './user-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block', '(focusout)': 'onFocusOut($event)' },
})
export class UserMenu {
  readonly displayName = input.required<string>();
  readonly email = input.required<string>();
  readonly roleLabel = input.required<string>();
  readonly initials = input.required<string>();
  readonly signOut = output<void>();
  readonly expireSession = output<void>();
  protected readonly open = signal(false);
  protected readonly icons = {
    chevron: LucideChevronDown,
    clock: LucideClock3,
    logout: LucideLogOut,
  };
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly items = viewChildren<ElementRef<HTMLButtonElement>>('menuItem');

  protected toggle(): void {
    if (this.open()) this.close(true);
    else this.openAt(0);
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.openAt(event.key === 'ArrowDown' ? 0 : 1);
    } else if (event.key === 'Escape') this.close(true);
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
      return;
    }
    if (event.key === 'Tab') {
      // Let native Tab continue from the trigger instead of trapping focus in the menu.
      this.close(true);
      return;
    }
    const elements = this.items().map((item) => item.nativeElement);
    const index = elements.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = (index + 1) % elements.length;
        break;
      case 'ArrowUp':
        next = (index - 1 + elements.length) % elements.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = elements.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    elements[next]?.focus();
  }

  protected select(action: 'expire' | 'exit'): void {
    this.close(true);
    if (action === 'exit') this.signOut.emit();
    else this.expireSession.emit();
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) this.close(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onOutsidePointer(event: PointerEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close(false);
  }

  private openAt(index: number): void {
    this.open.set(true);
    afterNextRender(
      () => {
        if (this.open()) this.items()[index]?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  private close(restoreFocus: boolean): void {
    if (!this.open()) return;
    this.open.set(false);
    if (restoreFocus) this.trigger().nativeElement.focus();
  }
}
