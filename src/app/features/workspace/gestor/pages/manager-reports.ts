import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonSecondary } from '@app/shared/ui/button';
import { ManagerMetricCard, ManagerMetricIcon } from '../components/manager-metric-card';
import { ManagerPageHeader } from '../components/manager-page-header';
import { ManagerSlaReportTable } from '../components/manager-sla-report-table';
import { ManagerEmptyState } from '../components/manager-empty-state';
import {
  ManagerLabel,
  ManagerPanel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { Select } from '@app/shared/ui/input/select.directive';
import { ManagerSlaSummary } from '../components/manager-sla-summary';
import { ManagerReportExport } from '../components/manager-report-export';
import {
  filterManagerReport,
  REPORT_PERIODS,
  REPORT_CLIENTS,
  REPORT_TECHNICIANS,
  ReportFilters,
} from '../data/manager-report-demo-data';

@Component({
  selector: 'app-manager-reports',
  imports: [
    RouterLink,
    ButtonSecondary,
    ManagerPageHeader,
    ManagerMetricCard,
    ManagerSlaReportTable,
    ManagerEmptyState,
    ManagerLabel,
    ManagerPanel,
    ManagerTextAction,
    Select,
    ManagerSlaSummary,
    ManagerReportExport,
  ],
  templateUrl: './manager-reports.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerReports {
  private readonly document = inject(DOCUMENT);
  protected readonly periods = REPORT_PERIODS;
  protected readonly clients = REPORT_CLIENTS;
  protected readonly technicians = REPORT_TECHNICIANS;
  protected readonly filters = signal<ReportFilters>({
    period: '2026-09',
    client: 'all',
    technician: 'all',
  });
  protected readonly report = computed(() => filterManagerReport(this.filters()));
  protected readonly periodLabel = computed(
    () => REPORT_PERIODS.find((period) => period.key === this.filters().period)!.label,
  );
  protected readonly hasFilters = computed(
    () =>
      this.filters().period !== '2026-09' ||
      this.filters().client !== 'all' ||
      this.filters().technician !== 'all',
  );
  protected readonly filterSummary = computed(
    () =>
      `${this.periodLabel()} · ${this.filters().client === 'all' ? 'Todos os clientes' : this.filters().client} · ${this.filters().technician === 'all' ? 'Todos os técnicos' : this.filters().technician}`,
  );
  protected readonly exportContext = computed(
    () => `${this.report().total} chamados · ${this.filterSummary()}`,
  );
  protected readonly clockIcons: Record<string, ManagerMetricIcon> = {
    response: 'triage',
    field: 'service',
    resolution: 'resolved',
  };
  protected changeFilter(key: keyof ReportFilters, event: Event): void {
    this.filters.update((current) => ({
      ...current,
      [key]: (event.target as HTMLSelectElement).value,
    }));
  }
  protected clearFilters(): void {
    this.filters.set({ period: '2026-09', client: 'all', technician: 'all' });
    this.document.getElementById('report-period')?.focus();
  }
}
