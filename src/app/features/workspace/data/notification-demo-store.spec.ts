import { describe, expect, it } from 'vitest';
import { groupNotifications, NotificationDemoStore } from './notification-demo-store';

describe('local notification examples', () => {
  it('marks only the requested recipient notification and is idempotent', () => {
    const store = new NotificationDemoStore();
    expect(store.forProfile('gestor').filter((item) => !item.read)).toHaveLength(2);
    store.markRead('gestor', 'manager-response');
    expect(store.forProfile('gestor').filter((item) => !item.read)).toHaveLength(1);
    expect(store.forProfile('tecnico').filter((item) => !item.read)).toHaveLength(2);
    const snapshot = store.forProfile('gestor');
    store.markRead('gestor', 'manager-response');
    store.markRead('gestor', 'technician-assigned');
    expect(store.forProfile('gestor')).toBe(snapshot);
  });

  it('keeps bulk reading scoped to one profile and new sessions reset the fixtures', () => {
    const store = new NotificationDemoStore();
    store.markAllRead('gestor');
    expect(store.forProfile('gestor').every((item) => item.read)).toBe(true);
    expect(store.forProfile('tecnico').some((item) => !item.read)).toBe(true);
    expect(store.forProfile('cliente')).toEqual([]);
    store.markAllRead('cliente');
    expect(
      new NotificationDemoStore().forProfile('gestor').filter((item) => !item.read),
    ).toHaveLength(2);
  });

  it('groups and orders by fixed dates without mutating or reordering the source by read state', () => {
    const store = new NotificationDemoStore();
    const source = [...store.forProfile('tecnico')].reverse();
    const ids = source.map((item) => item.id);
    const groups = groupNotifications(source);
    expect(groups.map((group) => group.day)).toEqual(['2026-11-05', '2026-11-04', '2026-11-03']);
    expect(groups[0].notifications.map((item) => item.ticketId)).toEqual([1041, 1042]);
    expect(groups[0].label).toBe('05 de novembro de 2026');
    expect(source.map((item) => item.id)).toEqual(ids);
    expect(groupNotifications([])).toEqual([]);
  });
});
