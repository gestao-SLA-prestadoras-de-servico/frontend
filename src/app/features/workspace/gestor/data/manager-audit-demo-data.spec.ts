import { describe, expect, it } from 'vitest';
import { AUDIT_RECORDS, AuditFilters, filterAuditRecords } from './manager-audit-demo-data';

const defaults: AuditFilters = { actor: 'all', entity: 'all', period: 'last30' };

describe('audit demonstration filters', () => {
  it('uses the fixed scene date and includes both ends of the seven-day window', () => {
    expect(filterAuditRecords(AUDIT_RECORDS, defaults)).toHaveLength(11);
    const rows = filterAuditRecords(AUDIT_RECORDS, { ...defaults, period: 'last7' });
    expect(rows).toHaveLength(9);
    expect(rows[0].occurredAt.slice(0, 10)).toBe('2026-11-05');
    expect(rows.at(-1)?.occurredAt.slice(0, 10)).toBe('2026-10-30');
    expect(rows.some((row) => row.id === 'audit-003')).toBe(false);
    const future = { ...AUDIT_RECORDS[0], id: 'future', occurredAt: '2026-11-06T09:00:00-03:00' };
    expect(filterAuditRecords([future], { ...defaults, period: 'all' })).toEqual([]);
  });

  it('combines actor, entity and period without conflating operations with entity types', () => {
    const filters: AuditFilters = { actor: 'system', entity: 'evidence', period: 'last7' };
    expect(filterAuditRecords(AUDIT_RECORDS, filters).map((row) => row.operation)).toEqual([
      'purged',
    ]);
    expect(
      filterAuditRecords(AUDIT_RECORDS, { ...filters, actor: 'rafael', entity: 'user' }),
    ).toEqual([]);
    expect(
      filterAuditRecords(AUDIT_RECORDS, { actor: 'camila', entity: 'user', period: 'all' }),
    ).toHaveLength(2);
  });

  it('sorts the returned rows without changing the source records', () => {
    const input = [...AUDIT_RECORDS].reverse();
    const originalIds = input.map((row) => row.id);
    const result = filterAuditRecords(input, { ...defaults, period: 'all' });
    expect(result.map((row) => row.id)).toEqual(AUDIT_RECORDS.map((row) => row.id));
    expect(input.map((row) => row.id)).toEqual(originalIds);
    expect(filterAuditRecords([], defaults)).toEqual([]);
  });
});
