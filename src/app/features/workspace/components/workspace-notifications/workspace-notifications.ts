import { DatePipe, DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  OnChanges,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import {
  LucideBellOff,
  LucideCircleCheck,
  LucideDynamicIcon,
  LucideLoaderCircle,
  LucideRotateCcw,
} from '@lucide/angular';
import { ButtonSecondary } from '@app/shared/ui/button';
import { preventDefaultUnlessReplayed } from '@app/shared/utils/event-replay';
import { ProfileKey } from '../../data/workspace-data';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import {
  AppNotification,
  groupNotifications,
  NotificationStore,
} from '../../data/notification-store';

@Component({
  selector: 'app-workspace-notifications',
  imports: [RouterLink, LucideDynamicIcon, ButtonSecondary, DatePipe],
  templateUrl: './workspace-notifications.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block shrink-0', '(focusout)': 'onFocusOut($event)' },
})
export class WorkspaceNotifications implements OnChanges {
  readonly profile = input.required<ProfileKey>();
  protected readonly store = inject(NotificationStore);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  protected readonly open = signal(false);
  protected readonly feedback = signal('');
  protected readonly groups = computed(() => groupNotifications(this.store.items()));
  /** Nula enquanto a primeira carga não terminou ou falhou. */
  protected readonly unread = computed(() =>
    this.store.status() === 'ready' ? this.store.unread() : null,
  );
  protected readonly unreadLabel = computed(() => {
    const count = this.unread();
    return count === null
      ? 'Contagem indisponível'
      : count === 0
        ? 'Nenhuma não lida'
        : `${count} ${count === 1 ? 'não lida' : 'não lidas'}`;
  });
  protected readonly bellLabel = computed(
    () => 'Notificações, ' + this.unreadLabel().toLocaleLowerCase('pt-BR'),
  );
  protected readonly icons = {
    ...WORKSPACE_ICONS,
    check: LucideCircleCheck,
    empty: LucideBellOff,
    loading: LucideLoaderCircle,
    reopen: LucideRotateCcw,
  };
  protected readonly kindIcons = {
    sla: WORKSPACE_ICONS.sla,
    completed: LucideCircleCheck,
    assigned: WORKSPACE_ICONS.users,
    reopened: LucideRotateCcw,
    removed: WORKSPACE_ICONS.users,
  };

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.close(false));
    this.store.start(inject(DestroyRef));
  }

  ngOnChanges(): void {
    this.close(false);
    this.feedback.set('');
  }

  protected toggle(): void {
    if (this.open()) this.close(true);
    else {
      this.store.refresh();
      this.open.set(true);
      afterNextRender(
        () => {
          if (this.open()) this.heading()?.nativeElement.focus();
        },
        { injector: this.injector },
      );
    }
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown') return;
    preventDefaultUnlessReplayed(event);
    if (!this.open()) this.toggle();
    else this.heading()?.nativeElement.focus();
  }

  protected close(restoreFocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    if (restoreFocus) this.trigger().nativeElement.focus();
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) this.close(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onOutsidePointer(event: PointerEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close(false);
  }

  @HostListener('document:keydown.escape', ['$event'])
  protected onEscape(event: Event): void {
    if (!this.open()) return;
    preventDefaultUnlessReplayed(event);
    event.stopPropagation();
    this.close(true);
  }

  protected markRead(notification: AppNotification): void {
    this.store.markRead(notification.id);
    this.feedback.set('Notificação marcada como lida.');
    this.document.getElementById(`notification-${notification.id}`)?.focus({ preventScroll: true });
  }

  protected markAllRead(): void {
    this.closeButton()?.nativeElement.focus({ preventScroll: true });
    this.store.markAllRead();
    this.feedback.set('Todas as notificações foram marcadas como lidas.');
  }

  protected ticketPath(notification: AppNotification): string {
    return `/app/${this.profile()}/chamados/${notification.ticketId}`;
  }

  protected openNotification(notification: AppNotification, event: MouseEvent): void {
    this.store.markRead(notification.id);
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    const samePage = this.router.url.split(/[?#]/)[0] === this.ticketPath(notification);
    this.close(false);
    if (samePage) this.document.querySelector<HTMLElement>('main h1')?.focus();
  }
}
