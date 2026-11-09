import { describe, expect, it } from 'vitest';
import {
  buildManagerReport,
  MANAGER_REPORT_SAMPLE,
  ReportTicket,
  filterManagerReport,
} from './manager-report-demo-data';

describe('manager report demonstration', () => {
  it('combines period, client and technician without changing the shared monthly sample', () => {
    const filtered = filterManagerReport({
      period: '2026-09',
      client: 'Edifício Aurora',
      technician: 'Rafael Costa',
    });
    expect(filtered.total).toBe(10);
    expect(filtered.clients.map((row) => row.name)).toEqual(['Edifício Aurora']);
    expect(filtered.technicians.map((row) => row.name)).toEqual(['Rafael Costa']);
    expect(filtered.clocks.map((clock) => [clock.fulfilled, clock.violated])).toEqual([
      [9, 1],
      [8, 2],
      [8, 2],
    ]);
    expect(MANAGER_REPORT_SAMPLE.total).toBe(56);
    for (const filters of [
      { period: '2026-10', client: 'all', technician: 'all' },
      { period: '2026-09', client: 'Clínica Horizonte', technician: 'Rafael Costa' },
    ]) {
      const empty = filterManagerReport(filters);
      expect(empty.total).toBe(0);
      expect(empty.clients).toEqual([]);
      expect(empty.technicians).toEqual([]);
    }
  });
  it('reconciles both groupings with the shared monthly summary', () => {
    const sample = MANAGER_REPORT_SAMPLE;
    expect(sample.total).toBe(56);
    expect(
      sample.clocks.map(({ fulfilled, violated, percentage }) => [fulfilled, violated, percentage]),
    ).toEqual([
      [54, 2, 96],
      [51, 5, 91],
      [49, 7, 88],
    ]);
    for (const rows of [sample.clients, sample.technicians]) {
      expect(rows.reduce((total, row) => total + row.total, 0)).toBe(sample.total);
      for (const clock of ['field', 'resolution'] as const) {
        expect(rows.reduce((total, row) => total + row[clock].fulfilled, 0)).toBe(
          sample.clocks.find(({ key }) => key === clock)!.fulfilled,
        );
      }
    }
    expect(sample.clients.reduce((total, row) => total + row.response!.fulfilled, 0)).toBe(54);
    expect(sample.technicians.every(({ response }) => response === null)).toBe(true);
  });

  it('weights the percentage by tickets rather than averaging customer percentages', () => {
    const fulfilled: ReportTicket = {
      client: 'Cliente A',
      technician: 'Técnico',
      response: true,
      field: true,
      resolution: true,
    };
    const violated: ReportTicket = {
      ...fulfilled,
      client: 'Cliente B',
      response: false,
      field: false,
      resolution: false,
    };
    const report = buildManagerReport([fulfilled, ...Array.from({ length: 9 }, () => violated)]);
    expect(report.clients.map(({ resolution }) => resolution.percentage)).toEqual([100, 0]);
    expect(report.clocks.every(({ percentage }) => percentage === 10)).toBe(true);
  });

  it('keeps an empty sample finite and without fabricated groups', () => {
    const report = buildManagerReport([]);
    expect(report.total).toBe(0);
    expect(report.clients).toEqual([]);
    expect(report.technicians).toEqual([]);
    expect(
      report.clocks.every(
        ({ percentage, fulfilled, violated }) =>
          percentage === 0 && fulfilled === 0 && violated === 0,
      ),
    ).toBe(true);
  });
});
