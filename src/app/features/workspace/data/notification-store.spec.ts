import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Notificacao, NotificacoesApi } from '@app/core/api/notificacoes.api';
import { groupNotifications, NotificationStore, toAppNotification } from './notification-store';

const notificacao = (over: Partial<Notificacao>): Notificacao => ({
  id: 'n1',
  tipo: 'ATRIBUICAO',
  chamadoId: 'c1',
  numeroChamado: '#4',
  titulo: 'Bomba',
  mensagem: '',
  criadoEm: '2026-11-17T15:00:00Z',
  lidaEm: null,
  ...over,
});

describe('notification store', () => {
  it('maps the ms response and falls back to a title per type', () => {
    expect(toAppNotification(notificacao({ tipo: 'VIOLACAO' }))).toMatchObject({
      kind: 'sla',
      title: 'Prazo de SLA violado',
      ticketNumber: '#4',
      read: false,
    });
    expect(
      toAppNotification(notificacao({ mensagem: 'Texto do ms', lidaEm: '2026-11-17T16:00:00Z' })),
    ).toMatchObject({ title: 'Texto do ms', read: true });
  });

  it('groups by day in Brasília, not UTC', () => {
    // 01:30 UTC de 18/11 ainda é 17/11 em Brasília.
    const groups = groupNotifications([
      toAppNotification(notificacao({ id: 'a', criadoEm: '2026-11-18T01:30:00Z' })),
      toAppNotification(notificacao({ id: 'b', criadoEm: '2026-11-18T12:00:00Z' })),
    ]);
    expect(groups.map((g) => [g.day, g.notifications.map((n) => n.id)])).toEqual([
      ['2026-11-18', ['b']],
      ['2026-11-17', ['a']],
    ]);
  });

  it('marks as read optimistically and reloads from the server when it fails', () => {
    const api = {
      listar: vi.fn(() =>
        of({
          itens: [notificacao({ id: 'a' }), notificacao({ id: 'b' })],
          pagina: 0,
          tamanho: 30,
          totalElementos: 2,
          totalPaginas: 1,
          totalNaoLidas: 2,
        }),
      ),
      marcarLida: vi.fn(() => throwError(() => new Error('down'))),
    };
    TestBed.configureTestingModule({ providers: [{ provide: NotificacoesApi, useValue: api }] });
    const store = TestBed.inject(NotificationStore);
    store.refresh();
    expect(store.unread()).toBe(2);

    store.markRead('a');
    expect(api.marcarLida).toHaveBeenCalledWith('a');
    // A falha recarrega a lista do servidor, que ainda diz 2 não lidas.
    expect(api.listar).toHaveBeenCalledTimes(2);
    expect(store.unread()).toBe(2);
    expect(store.items().every((n) => !n.read)).toBe(true);
  });
});
