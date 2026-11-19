import { ChamadoTecnico } from '@app/core/api/modelos';
import { deadlineState, evidenceFileError, toTechnicianTicket } from './technician-data';

const NOW = Date.parse('2026-11-17T12:00:00Z');

describe('technician-data mapping', () => {
  it('classifies deadlines as overdue, urgent (< 2h) or on time', () => {
    expect(deadlineState('2026-11-17T11:59:00Z', NOW)).toBe('overdue');
    expect(deadlineState('2026-11-17T13:30:00Z', NOW)).toBe('urgent');
    expect(deadlineState('2026-11-17T15:00:00Z', NOW)).toBe('on-time');
  });

  it('uses the earliest running clock, the current visit evidence and the last assignment', () => {
    const ticket = toTechnicianTicket(
      {
        id: 't1',
        numero: 9,
        titulo: 'Bomba',
        local: 'Térreo',
        descricao: 'Vibra',
        estado: 'EM_ATENDIMENTO',
        prioridade: 'NORMAL',
        comViolacao: true,
        estadoFinalEm: null,
        proximoVencimento: '2026-11-20T12:00:00Z',
        relogios: [
          {
            tipo: 'RESOLUCAO',
            ciclo: 1,
            ativo: true,
            estado: 'CORRENDO',
            venceEm: '2026-11-19T12:00:00Z',
          },
          {
            tipo: 'CAMPO',
            ciclo: 1,
            ativo: true,
            estado: 'CORRENDO',
            venceEm: '2026-11-17T13:00:00Z',
          },
          {
            tipo: 'RESPOSTA',
            ciclo: 1,
            ativo: false,
            estado: 'CUMPRIDO',
            venceEm: '2026-11-17T10:00:00Z',
          },
        ],
        atendimentos: [
          { id: 'a1', descricaoTecnica: 'antigo', iniciadoEm: '2026-11-15T10:00:00Z' },
          { id: 'a2', descricaoTecnica: 'atual', iniciadoEm: '2026-11-17T11:00:00Z' },
        ],
      } as unknown as ChamadoTecnico,
      [
        { atendimentoId: 'a1', evidencias: [{ id: 'e-old', nome: 'old.jpg' }] },
        {
          atendimentoId: 'a2',
          evidencias: [
            { id: 'e1', nome: 'f.jpg', tamanho: 10, estado: 'PROCESSANDO', enviadaEm: 'x' },
          ],
        },
      ] as never,
      [
        {
          evento: 'ATRIBUICAO',
          ocorridoEm: '2026-11-15T09:00:00Z',
          atorPapel: 'GESTOR',
          dados: {},
        },
        {
          evento: 'REATRIBUICAO',
          ocorridoEm: '2026-11-16T09:00:00Z',
          atorPapel: 'GESTOR',
          dados: {},
        },
      ],
      NOW,
    );
    expect(ticket.deadline).toEqual({
      label: 'Atendimento em campo',
      dueAt: '2026-11-17T13:00:00Z',
      state: 'urgent',
    });
    expect(ticket.technicalDescription).toBe('atual');
    expect(ticket.evidences.map((e) => e.id)).toEqual(['e1']);
    expect(ticket.assignedAt).toBe('2026-11-16T09:00:00Z');
    expect(ticket.alertLabel).toBeDefined();
  });

  it('has no deadline once the ticket reached a final state', () => {
    const ticket = toTechnicianTicket({
      estado: 'ENCERRADO',
      prioridade: 'ALTA',
      estadoFinalEm: '2026-11-17T10:00:00Z',
      proximoVencimento: '2026-11-17T17:00:00Z',
    } as unknown as ChamadoTecnico);
    expect(ticket.deadline).toBeNull();
    expect(ticket.priority).toBe('Alta');
  });

  it('rejects unsupported or oversized files before upload', () => {
    expect(evidenceFileError(new File(['x'], 'a.png', { type: 'image/png' }))).toBeNull();
    expect(evidenceFileError(new File(['x'], 'a.pdf', { type: 'application/pdf' }))).toContain(
      'JPEG',
    );
    const big = new File(['x'], 'a.jpg', { type: 'image/jpeg' });
    Object.defineProperty(big, 'size', { value: 11 * 1024 * 1024 });
    expect(evidenceFileError(big)).toContain('10 MB');
  });
});
