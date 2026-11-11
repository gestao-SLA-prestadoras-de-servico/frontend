import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonSecondary } from '@app/shared/ui/button';
import { ManagerMetricCard, ManagerMetricIcon } from '../components/manager-metric-card';
import { ManagerPageHeader } from '../components/manager-page-header';
import { ManagerSlaReportTable } from '../components/manager-sla-report-table';
import { MANAGER_REPORT_SAMPLE } from '../data/manager-report-demo-data';

@Component({
  selector: 'app-manager-reports',
  imports: [
    RouterLink,
    ButtonSecondary,
    ManagerPageHeader,
    ManagerMetricCard,
    ManagerSlaReportTable,
  ],
  templateUrl: './manager-reports.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerReports {
  protected readonly report = MANAGER_REPORT_SAMPLE;
  protected readonly clockIcons: Record<string, ManagerMetricIcon> = {
    response: 'triage',
    field: 'service',
    resolution: 'resolved',
  };
}
