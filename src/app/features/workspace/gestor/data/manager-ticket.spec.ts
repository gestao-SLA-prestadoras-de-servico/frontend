import { ChamadoGestor } from '@app/core/api/modelos';
import { toManagerEvent, toManagerTicket } from './manager-ticket';

const names = {
  people: new Map([
    ['s-ana', 'Ana Técnica'],
    ['s-rui', 'Rui Técnico'],
  ]),
  companies: new Map([['c1', 'ACME Ltda']]),
};

describe('manager-ticket mapping', () => {
  it('resolves client and technician names and hides the deadline of finished tickets', () => {
    const base = {
      id: 'u1',
      numero: 9,
      clienteId: 'c1',
      titulo: 'Bomba',
      local: 'Térreo',
      descricao: 'Vibra',
      estado: 'EM_ATENDIMENTO',
      prioridade: 'ALTA',
      prioridadeSugerida: 'NORMAL',
      prioridadeDefinida: null,
      tecnicoSub: 's-ana',
      abertoEm: '2026-11-17T12:00:00Z',
      estadoFinalEm: null,
      proximoVencimento: '2026-11-18T12:00:00Z',
      comViolacao: false,
      posicionamento: null,
      politicaVersaoId: 'v1',
      version: 4,
    } as unknown as ChamadoGestor;

    const open = toManagerTicket(base, names);
    expect(open).toMatchObject({
      client: 'ACME Ltda',
      technician: 'Ana Técnica',
      priority: 'Alta',
      suggestedPriority: 'Normal',
      definedPriority: null,
      nextDeadline: '2026-11-18T12:00:00Z',
      version: 4,
    });

    const closed = toManagerTicket(
      { ...base, estado: 'ENCERRADO', estadoFinalEm: '2026-11-18T10:00:00Z', tecnicoSub: 's-x' },
      names,
    );
    expect(closed.nextDeadline).toBeNull();
    expect(closed.technician).toBe('Técnico removido');
  });

  it('describes reassignment and SLA violation with names instead of subs', () => {
    expect(
      toManagerEvent(
        {
          evento: 'REATRIBUICAO',
          atorPapel: 'GESTOR',
          ocorridoEm: 't',
          dados: { anterior: 's-ana', novo: 's-rui' },
        },
        names.people,
      ),
    ).toEqual({
      at: 't',
      title: 'Técnico reatribuído',
      detail: 'Ana Técnica → Rui Técnico',
      tone: 'blue',
    });
    expect(
      toManagerEvent(
        {
          evento: 'VIOLACAO_SLA',
          atorPapel: null,
          ocorridoEm: 't',
          dados: { relogio: 'CAMPO', ciclo: '1' },
        },
        names.people,
      ),
    ).toMatchObject({
      title: 'Prazo violado',
      detail: 'Atendimento em campo · ciclo 1',
      tone: 'red',
    });
    expect(
      toManagerEvent(
        {
          evento: 'MUDANCA_ESTADO',
          atorPapel: 'GESTOR',
          ocorridoEm: 't',
          dados: { de: 'ABERTO', para: 'CANCELADO' },
        },
        names.people,
      ).tone,
    ).toBe('red');
  });
});
