import {
  ManagerTable,
  ManagerTableHead,
  ManagerTableBody,
} from '../components/manager-table.directive';
import { ManagerEmptyState } from '../components/manager-empty-state';
import { ManagerMetricCard } from '../components/manager-metric-card';
import { ManagerStatusBadge } from '../components/manager-status-badge';
import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerPanel,
  ManagerCollection,
  ManagerDialog,
  ManagerSectionHeading,
  ManagerLabel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { Input } from '@app/shared/ui/input/input.directive';
import { Select } from '@app/shared/ui/input/select.directive';
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
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonSecondary, ButtonPrimary } from '@app/shared/ui/button';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ManagerUser, UserDemoStore } from '../data/user-demo-store';

type RoleFilter = 'Todas' | ManagerUser['role'];
type SituationFilter = 'Todas' | ManagerUser['situation'];

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

@Component({
  selector: 'app-manager-users',
  imports: [
    RouterLink,
    ButtonSecondary,
    LucideDynamicIcon,
    Select,
    Input,
    ButtonPrimary,
    ManagerPanel,
    ManagerCollection,
    ManagerDialog,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerTextAction,
    ManagerPageHeader,
    ManagerStatusBadge,
    ManagerMetricCard,
    ManagerEmptyState,
    ManagerTable,
    ManagerTableHead,
    ManagerTableBody,
  ],
  templateUrl: './manager-users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerUsers {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly store = inject(UserDemoStore);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('deactivateDialog');
  private readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelButton');
  private readonly noticeTarget = viewChild<ElementRef<HTMLElement>>('noticeTarget');
  private trigger?: HTMLButtonElement;
  private completing = false;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly users = this.store.users;
  protected readonly notice = this.store.notice;
  protected readonly search = signal('');
  protected readonly roleFilter = signal<RoleFilter>('Todas');
  protected readonly situationFilter = signal<SituationFilter>('Todas');
  protected readonly selectedUser = signal<ManagerUser | null>(null);
  protected readonly selectedSubstituteId = signal('');
  protected readonly ready = signal(false);
  protected readonly filteredUsers = computed(() => {
    const query = normalize(this.search());
    return this.users().filter((user) => {
      const matchesQuery =
        !query || normalize(`${user.name} ${user.email} ${user.company ?? ''}`).includes(query);
      const matchesRole = this.roleFilter() === 'Todas' || user.role === this.roleFilter();
      const matchesSituation =
        this.situationFilter() === 'Todas' || user.situation === this.situationFilter();
      return matchesQuery && matchesRole && matchesSituation;
    });
  });
  protected readonly activeCount = computed(
    () => this.users().filter((user) => user.situation === 'Ativo').length,
  );
  protected readonly technicalCount = computed(
    () =>
      this.users().filter((user) => user.role === 'Técnico' && user.situation === 'Ativo').length,
  );
  protected readonly inactiveCount = computed(
    () => this.users().filter((user) => user.situation === 'Inativo').length,
  );
  protected readonly substitutes = computed(() =>
    this.users().filter(
      (user) =>
        user.role === 'Técnico' &&
        user.situation === 'Ativo' &&
        user.id !== this.selectedUser()?.id,
    ),
  );
  protected readonly chosenSubstitute = computed(
    () => this.substitutes().find((user) => user.id === this.selectedSubstituteId()) ?? null,
  );
  protected readonly substituteLoad = computed(() => {
    const substitute = this.chosenSubstitute();
    return substitute ? substitute.assigned + substitute.inProgress : 0;
  });
  protected readonly hasSubstituteConflict = computed(() => {
    const substitute = this.chosenSubstitute();
    return (
      !!substitute && this.substituteLoad() + this.transferableCount() > substitute.workloadLimit
    );
  });
  protected readonly transferableCount = computed(() => {
    const user = this.selectedUser();
    return user ? user.assigned + user.inProgress : 0;
  });

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  protected updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
  protected updateRole(event: Event): void {
    this.roleFilter.set((event.target as HTMLSelectElement).value as RoleFilter);
  }
  protected updateSituation(event: Event): void {
    this.situationFilter.set((event.target as HTMLSelectElement).value as SituationFilter);
  }
  protected updateSubstitute(event: Event): void {
    this.selectedSubstituteId.set((event.target as HTMLSelectElement).value);
  }
  protected clearNotice(): void {
    this.store.setNotice(null);
  }
  protected clearFilters(): void {
    this.search.set('');
    this.roleFilter.set('Todas');
    this.situationFilter.set('Todas');
    this.document.getElementById('user-search')?.focus();
  }

  protected openDeactivate(user: ManagerUser, trigger: HTMLButtonElement): void {
    if (!this.ready() || user.role !== 'Técnico' || user.situation !== 'Ativo') return;
    this.trigger = trigger;
    this.completing = false;
    this.selectedUser.set(user);
    this.selectedSubstituteId.set('');
    afterNextRender(
      () => {
        if (this.dialog().nativeElement.open) return;
        this.dialog().nativeElement.showModal();
        this.cancelButton()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected closeDialog(): void {
    if (this.dialog().nativeElement.open) this.dialog().nativeElement.close();
  }
  protected onDialogClose(): void {
    if (!this.completing) this.trigger?.focus();
    this.trigger = undefined;
    this.completing = false;
    this.selectedUser.set(null);
    this.selectedSubstituteId.set('');
  }
  protected onBackdrop(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      this.closeDialog();
  }
  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.dialog().nativeElement.querySelectorAll<HTMLElement>(
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

  protected confirmDeactivation(): void {
    const selected = this.selectedUser();
    const substitute = this.selectedSubstituteId();
    if (!selected || !substitute || this.hasSubstituteConflict()) return;
    const success = this.store.deactivate(selected.id, substitute);
    this.store.setNotice(
      success
        ? {
            tone: 'success',
            title: 'Inativação demonstrativa concluída',
            detail: `${selected.name} foi inativado(a) e ${this.transferableCount()} chamados foram indicados para ${this.users().find((user) => user.id === substitute)?.name}. Os dados permanecem somente nesta sessão.`,
          }
        : {
            tone: 'error',
            title: 'Não foi possível concluir a simulação',
            detail:
              'A substituição não está disponível neste exemplo. Feche a janela e selecione outro técnico.',
          },
    );
    this.completing = true;
    this.closeDialog();
    afterNextRender(() => this.noticeTarget()?.nativeElement.focus(), { injector: this.injector });
  }
}
