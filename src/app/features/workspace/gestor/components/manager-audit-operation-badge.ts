import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideDynamicIcon, LucideRotateCcw } from '@lucide/angular';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { AUDIT_OPERATIONS, AuditOperation } from '../data/manager-audit-demo-data';

const OPERATION_ICONS = {
  evidence: WORKSPACE_ICONS.image,
  status: WORKSPACE_ICONS.service,
  violation: WORKSPACE_ICONS.sla,
  priority: WORKSPACE_ICONS.chevron,
  opened: WORKSPACE_ICONS.tickets,
  reopened: LucideRotateCcw,
  assigned: WORKSPACE_ICONS.users,
  validated: WORKSPACE_ICONS.audit,
  purged: WORKSPACE_ICONS.image,
  deactivated: WORKSPACE_ICONS.users,
  created: WORKSPACE_ICONS.add,
};

@Component({
  selector: 'app-manager-audit-operation-badge',
  imports: [LucideDynamicIcon],
  template: `<span
    class="inline-flex min-h-7 items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-semibold leading-snug"
    [class]="tones[operation().tone]"
    ><svg class="size-3.5 shrink-0" [lucideIcon]="icons[value()]" aria-hidden="true"></svg
    >{{ operation().label }}</span
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex min-w-0' },
})
export class ManagerAuditOperationBadge {
  readonly value = input.required<AuditOperation>();
  protected readonly operation = computed(() => AUDIT_OPERATIONS[this.value()]);
  protected readonly icons = OPERATION_ICONS;
  protected readonly tones = {
    neutral: 'bg-bg text-ink2',
    blue: 'bg-pri-bg text-pri-d',
    danger: 'bg-danger-bg text-danger',
    green: 'bg-grn-bg text-grn-t',
  };
}
