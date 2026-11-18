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
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map } from 'rxjs';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { mensagemErro } from '@app/core/api/erros';
import { UsuariosApi } from '@app/core/api/usuarios.api';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import { ManagerUser, toManagerUser, UserStore } from '../data/user-store';

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
    WorkspaceLoadingState,
  ],
  templateUrl: './manager-users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerUsers {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly store = inject(UserStore);
  private readonly api = inject(UsuariosApi);
  private readonly cadastro = inject(CadastroApi);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('deactivateDialog');
  private readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelButton');
  private readonly noticeTarget = viewChild<ElementRef<HTMLElement>>('noticeTarget');
  private trigger?: HTMLButtonElement;
  private completing = false;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly data = rxResource({
    stream: () =>
      forkJoin({
        usuarios: this.api.listar({ sort: 'nome,asc' }),
        clientes: this.cadastro.clientes(),
        tecnicos: this.api.tecnicos(),
      }).pipe(
        map(({ usuarios, clientes, tecnicos }) => {
          const companies = new Map(clientes.map((c) => [c.id, c.razaoSocial]));
          const open = new Map(tecnicos.map((t) => [t.id, t.chamadosNaoFinalizados]));
          return usuarios.map((u) => toManagerUser(u, companies, open));
        }),
      ),
  });
  protected readonly loadError = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly users = computed(() => this.data.value() ?? []);
  /** `GET /usuarios/{id}/chamados-a-transferir` do usuário em inativação. */
  protected readonly transfer = rxResource({
    params: () => this.selectedUser()?.id,
    stream: ({ params: id }) => this.api.chamadosATransferir(id),
  });
  protected readonly busy = signal(false);
  protected readonly dialogError = signal<string | null>(null);
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
  protected readonly transferableCount = computed(() => {
    const counts = this.transfer.value();
    return counts ? counts.ATRIBUIDO + counts.EM_ATENDIMENTO + counts.RESOLVIDO : 0;
  });
  /** O backend exige substituto quando o técnico tem chamados não finalizados (RN-133). */
  protected readonly needsSubstitute = computed(() => this.transferableCount() > 0);

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
    if (!this.ready() || user.situation !== 'Ativo') return;
    this.trigger = trigger;
    this.completing = false;
    this.selectedUser.set(user);
    this.selectedSubstituteId.set('');
    this.dialogError.set(null);
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
    const substituteId = this.selectedSubstituteId();
    if (!selected || this.busy() || this.transfer.isLoading()) return;
    if (this.needsSubstitute() && !substituteId) return;
    const substitute = this.chosenSubstitute();
    const moved = this.transferableCount();
    this.busy.set(true);
    this.dialogError.set(null);
    this.api.inativar(selected.id, this.needsSubstitute() ? substituteId : undefined).subscribe({
      next: () => {
        this.busy.set(false);
        this.store.setNotice({
          tone: 'success',
          title: `${selected.name} foi inativado(a)`,
          detail:
            moved && substitute
              ? `${moved} ${moved === 1 ? 'chamado passou' : 'chamados passaram'} para ${substitute.name}. O acesso ao sistema foi bloqueado.`
              : 'O acesso ao sistema foi bloqueado.',
        });
        this.data.reload();
        this.completing = true;
        this.closeDialog();
        afterNextRender(() => this.noticeTarget()?.nativeElement.focus(), {
          injector: this.injector,
        });
      },
      error: (erro: unknown) => {
        this.busy.set(false);
        this.dialogError.set(mensagemErro(erro));
      },
    });
  }
}
