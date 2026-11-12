import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { LucideDynamicIcon } from '@lucide/angular';
import { Brand } from '@app/shared/ui/brand/brand';
import { UserMenu } from '@app/shared/ui/user-menu/user-menu';
import { WorkspaceNavigation } from '../components/workspace-navigation/workspace-navigation';
import { WorkspaceNotifications } from '../components/workspace-notifications/workspace-notifications';
import { profileByKey, WORKSPACE_PROFILES } from '../data/workspace-data';
import { WORKSPACE_ICONS } from '../data/workspace-icons';
import { preventDefaultUnlessReplayed } from '../../../shared/utils/event-replay';

@Component({
  selector: 'app-workspace-shell',
  imports: [
    Brand,
    UserMenu,
    WorkspaceNavigation,
    WorkspaceNotifications,
    RouterLink,
    RouterOutlet,
    LucideDynamicIcon,
  ],
  templateUrl: './workspace-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class WorkspaceShell {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mobileDialog = viewChild<ElementRef<HTMLDialogElement>>('mobileDialog');
  private restoreMenuFocus = true;
  private readonly menuTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('menuTrigger');
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');
  protected readonly profiles = WORKSPACE_PROFILES;
  protected readonly icons = WORKSPACE_ICONS;
  private readonly context = signal(this.readContext());
  protected readonly profile = computed(() => this.context().profile);
  protected readonly page = computed(() => this.context().page);
  protected readonly menuOpen = signal(false);

  protected get contentHref(): string {
    return `${this.router.url.split('#')[0]}#workspace-content`;
  }

  protected skipToContent(event: MouseEvent): void {
    preventDefaultUnlessReplayed(event);
    const content = this.content()?.nativeElement;
    content?.focus({ preventScroll: true });
    content?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.context.set(this.readContext());
        this.closeNavigation(false);
      });
    afterNextRender(() => {
      const media = matchMedia('(min-width: 1024px)');
      const onChange = () => {
        if (!media.matches) return;
        const wasOpen = this.menuOpen();
        this.closeNavigation(false);
        if (wasOpen) document.getElementById('workspace-profile')?.focus();
      };
      media.addEventListener('change', onChange);
      this.destroyRef.onDestroy(() => media.removeEventListener('change', onChange));
    });
  }

  private readContext() {
    let snapshot = this.route.snapshot.firstChild;
    while (snapshot?.firstChild) snapshot = snapshot.firstChild;
    const data = snapshot?.data;
    const profile = profileByKey(data?.['profile']);
    return {
      profile,
      page:
        profile.pages.find((page) => page.key === data?.['page']) ??
        (data?.['breadcrumb']
          ? { key: data['page'] as string, title: data['breadcrumb'] as string }
          : undefined),
    };
  }

  protected switchProfile(event: Event): void {
    const key = (event.target as HTMLSelectElement).value;
    void this.router.navigateByUrl(profileByKey(key).home);
  }

  protected openNavigation(): void {
    this.restoreMenuFocus = true;
    this.mobileDialog()?.nativeElement.showModal();
    this.menuOpen.set(true);
    this.closeButton().nativeElement.focus();
  }

  protected closeNavigation(restoreFocus = true): void {
    const dialog = this.mobileDialog()?.nativeElement;
    if (!dialog?.open) return;
    this.restoreMenuFocus = restoreFocus;
    dialog.close();
    this.menuOpen.set(false);
  }

  protected onDialogClose(): void {
    this.menuOpen.set(false);
    if (this.restoreMenuFocus && this.menuTrigger().nativeElement.getClientRects().length)
      this.menuTrigger().nativeElement.focus();
    this.restoreMenuFocus = true;
  }

  protected onDialogKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const items = [
      ...(this.mobileDialog()?.nativeElement.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled])',
      ) ?? []),
    ].filter((element) => element.getClientRects().length);
    const first = items[0],
      last = items[items.length - 1];
    if (
      (event.shiftKey && document.activeElement === first) ||
      (!event.shiftKey && document.activeElement === last)
    ) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }

  protected onBackdrop(event: MouseEvent): void {
    const dialog = this.mobileDialog()?.nativeElement;
    if (!dialog || event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      this.closeNavigation();
  }

  protected signOut(): void {
    void this.router.navigate(['/login'], { queryParams: { estado: 'saida' } });
  }
  protected expireSession(): void {
    void this.router.navigateByUrl('/sessao-expirada');
  }
}
