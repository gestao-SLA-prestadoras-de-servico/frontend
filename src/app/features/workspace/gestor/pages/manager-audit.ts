import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon, LucideLockKeyhole } from '@lucide/angular';
import { ButtonSecondary } from '@app/shared/ui/button';
import { Select } from '@app/shared/ui/input/select.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ManagerAuditOperationBadge } from '../components/manager-audit-operation-badge';
import { ManagerEmptyState } from '../components/manager-empty-state';
import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerLabel,
  ManagerPanel,
  ManagerSectionHeading,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import {
  ManagerTable,
  ManagerTableBody,
  ManagerTableHead,
} from '../components/manager-table.directive';
import { ManagerTicketBadge } from '../components/manager-ticket-badge';
import {
  AUDIT_ACTORS,
  AUDIT_ENTITIES,
  AUDIT_OPERATIONS,
  AUDIT_RECORDS,
  AuditActor,
  AuditEntity,
  AuditPeriod,
  AuditRecord,
  filterAuditRecords,
} from '../data/manager-audit-demo-data';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-manager-audit',
  imports: [
    RouterLink,
    LucideDynamicIcon,
    ButtonSecondary,
    Select,
    ManagerPageHeader,
    ManagerPanel,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerTextAction,
    ManagerTable,
    ManagerTableBody,
    ManagerTableHead,
    ManagerAuditOperationBadge,
    ManagerTicketBadge,
    ManagerEmptyState,
  ],
  templateUrl: './manager-audit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerAudit {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private returnTarget: HTMLElement | null = null;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly lockIcon = LucideLockKeyhole;
  protected readonly actors = AUDIT_ACTORS;
  protected readonly operations = AUDIT_OPERATIONS;
  protected readonly actorOptions = Object.entries(AUDIT_ACTORS).map(([key, actor]) => ({
    key,
    label: actor.name,
  }));
  protected readonly entityOptions = Object.entries(AUDIT_ENTITIES).map(([key, label]) => ({
    key,
    label,
  }));
  protected readonly actor = signal<AuditActor | 'all'>('all');
  protected readonly entity = signal<AuditEntity | 'all'>('all');
  protected readonly period = signal<AuditPeriod>('last30');
  protected readonly pageIndex = signal(0);
  protected readonly selectedId = signal<string | null>('audit-007');
  protected readonly filteredRecords = computed(() =>
    filterAuditRecords(AUDIT_RECORDS, {
      actor: this.actor(),
      entity: this.entity(),
      period: this.period(),
    }),
  );
  protected readonly pageCount = computed(() =>
    Math.ceil(this.filteredRecords().length / PAGE_SIZE),
  );
  protected readonly pageRecords = computed(() =>
    this.filteredRecords().slice(this.pageIndex() * PAGE_SIZE, (this.pageIndex() + 1) * PAGE_SIZE),
  );
  protected readonly selectedRecord = computed<AuditRecord | null>(
    () =>
      this.pageRecords().find((record) => record.id === this.selectedId()) ??
      this.pageRecords()[0] ??
      null,
  );
  protected readonly firstResult = computed(() =>
    this.filteredRecords().length ? this.pageIndex() * PAGE_SIZE + 1 : 0,
  );
  protected readonly lastResult = computed(() =>
    Math.min((this.pageIndex() + 1) * PAGE_SIZE, this.filteredRecords().length),
  );
  protected readonly hasFilters = computed(
    () => this.actor() !== 'all' || this.entity() !== 'all' || this.period() !== 'last30',
  );

  protected changeActor(event: Event): void {
    this.actor.set((event.target as HTMLSelectElement).value as AuditActor | 'all');
    this.resetPage();
  }
  protected changeEntity(event: Event): void {
    this.entity.set((event.target as HTMLSelectElement).value as AuditEntity | 'all');
    this.resetPage();
  }
  protected changePeriod(event: Event): void {
    this.period.set((event.target as HTMLSelectElement).value as AuditPeriod);
    this.resetPage();
  }
  protected clearFilters(): void {
    this.actor.set('all');
    this.entity.set('all');
    this.period.set('last30');
    this.resetPage();
    this.document.getElementById('audit-actor')?.focus();
  }
  protected changePage(direction: -1 | 1): void {
    const next = this.pageIndex() + direction;
    if (next < 0 || next >= this.pageCount()) return;
    this.pageIndex.set(next);
    this.selectedId.set(null);
    this.returnTarget = null;
    const focusId =
      direction === 1
        ? next + 1 >= this.pageCount()
          ? 'audit-previous'
          : 'audit-next'
        : next === 0
          ? 'audit-next'
          : 'audit-previous';
    afterNextRender(() => this.document.getElementById(focusId)?.focus(), {
      injector: this.injector,
    });
  }
  protected selectRecord(record: AuditRecord, trigger: HTMLElement): void {
    this.selectedId.set(record.id);
    this.returnTarget = trigger;
    if (this.document.defaultView?.matchMedia('(max-width: 1279px)').matches) {
      afterNextRender(() => this.document.getElementById('audit-detail-heading')?.focus(), {
        injector: this.injector,
      });
    }
  }
  protected returnToList(): void {
    const prefix = this.document.defaultView?.matchMedia('(min-width: 768px)').matches
      ? 'audit-table-'
      : 'audit-mobile-';
    const fallback = this.document.getElementById(`${prefix}${this.selectedRecord()?.id}`);
    (this.returnTarget?.getClientRects().length ? this.returnTarget : fallback)?.focus();
  }
  protected recordLabel(record: AuditRecord): string {
    return `Ver registro: ${AUDIT_OPERATIONS[record.operation].label}, ${record.entity.label}, ${record.date} às ${record.time}`;
  }
  private resetPage(): void {
    this.pageIndex.set(0);
    this.selectedId.set(null);
    this.returnTarget = null;
  }
}
