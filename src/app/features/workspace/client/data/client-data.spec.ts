import { HttpErrorResponse } from '@angular/common/http';
import { mensagemErro } from '@app/core/api/erros';
import { ChamadoCliente, RelogioView } from '@app/core/api/modelos';
import { deadlinesFrom, toClientEvent, toClientTicket } from './client-data';

const relogio = (over: Partial<RelogioView>): RelogioView => ({
  tipo: 'RESPOSTA',
  ciclo: 1,
  ativo: false,
  marcoInicial: '2026-11-17T12:00:00Z',
  prazoMinutos: 60,
  venceEm: '2026-11-17T13:00:00Z',
  cumpridoEm: null,
  violadoEm: null,
  estado: 'CORRENDO',
  ...over,
});

describe('client-data mapping', () => {
  it('keeps one deadline per clock, preferring the active one, then the latest cycle', () => {
    const deadlines = deadlinesFrom([
      relogio({ tipo: 'CAMPO', ciclo: 1, estado: 'VIOLADO' }),
      relogio({ tipo: 'CAMPO', ciclo: 2, ativo: true, venceEm: '2026-11-18T13:00:00Z' }),
      relogio({ tipo: 'RESPOSTA', estado: 'CUMPRIDO', cumpridoEm: '2026-11-17T12:30:00Z' }),
      relogio({ tipo: 'RESOLUCAO', ciclo: 1, estado: 'CUMPRIDO' }),
      relogio({ tipo: 'RESOLUCAO', ciclo: 2, estado: 'VIOLADO' }),
    ]);
    expect(deadlines.map((d) => [d.key, d.state])).toEqual([
      ['RESPOSTA', 'fulfilled'],
      ['CAMPO', 'running'],
      ['RESOLUCAO', 'overdue'],
    ]);
    expect(deadlines[0].completedAt).toBe('2026-11-17T12:30:00Z');
    expect(deadlines[1].target).toBe('2026-11-18T13:00:00Z');
    expect(deadlinesFrom(undefined)).toEqual([]);
  });

  it('maps the ticket and uses the latest technical description as the resolution', () => {
    const ticket = toClientTicket({
      id: 'u1',
      numero: 7,
      titulo: 'Ar',
      local: '4º andar',
      descricao: 'Não resfria',
      estado: 'RESOLVIDO',
      prioridade: 'ALTA',
      contratoId: 'c1',
      abertoEm: '2026-11-17T12:00:00Z',
      resolvidoEm: '2026-11-17T15:00:00Z',
      proximoVencimento: null,
      posicionamento: 'Vamos enviar um técnico.',
      version: 3,
      atendimentos: [
        { descricaoTecnica: 'primeiro' },
        { descricaoTecnica: 'segundo' },
        { descricaoTecnica: null },
      ],
    } as unknown as ChamadoCliente);
    expect(ticket).toMatchObject({
      number: 7,
      priority: 'Alta',
      resolution: 'segundo',
      firstResponse: 'Vamos enviar um técnico.',
      version: 3,
      deadlines: [],
    });
  });

  it('describes history events in Portuguese, with SISTEMA when there is no actor', () => {
    expect(
      toClientEvent({
        evento: 'MUDANCA_ESTADO',
        atorPapel: null,
        ocorridoEm: 'x',
        dados: { de: 'EM_ATENDIMENTO', para: 'RESOLVIDO' },
      }),
    ).toEqual({
      title: 'Aguardando validação',
      at: 'x',
      author: 'Sistema',
      description: 'Estado anterior: Em atendimento.',
    });
    expect(
      toClientEvent({
        evento: 'REABERTURA',
        atorPapel: 'CLIENTE',
        ocorridoEm: 'y',
        dados: { justificativa: 'Voltou a falhar' },
      }),
    ).toMatchObject({
      title: 'Chamado reaberto',
      author: 'Cliente',
      description: 'Voltou a falhar',
    });
  });

  it('picks the error message by backend code', () => {
    const conflito = new HttpErrorResponse({ status: 409, error: { codigo: 'CONFLITO_VERSAO' } });
    expect(mensagemErro(conflito)).toContain('alterado por outra pessoa');
    expect(mensagemErro(new HttpErrorResponse({ status: 0 }))).toContain('servidor');
    expect(mensagemErro(new HttpErrorResponse({ status: 500, error: 'boom' }))).toContain(
      'erro inesperado',
    );
  });
});
