import { Politica, VersaoPolitica } from '@app/core/api/modelos';
import { companyFormValue, createCompanyForm, toDadosCliente } from './company-form';
import { formatAddress } from './company-store';
import { contractTerm, todayIso } from './contract-store';
import { matrixFromPrazos, prazosFromMatrix, toSlaPolicy, windowExample } from './sla-policy-data';

const prazos = {
  alta: { resposta: 120, campo: 540, resolucao: 1080 },
  normal: { resposta: 360, campo: 1080, resolucao: 2160 },
};
const versao = (numero: number): VersaoPolitica => ({
  id: `v${numero}`,
  numero,
  prioridadePadrao: 'NORMAL',
  prazos,
  criadaEm: '2026-11-17T12:00:00Z',
  criadaPor: null,
});

describe('gestor registrations', () => {
  it('converts business-window minutes (540 = 1 business day)', () => {
    expect(windowExample(30)).toBe('30 min de janela');
    expect(windowExample(90)).toBe('1 h 30 min de janela');
    expect(windowExample(540)).toBe('1 dia útil');
    expect(windowExample(720)).toBe('1 dia útil e 3 h');
    expect(windowExample(2880)).toBe('5 dias úteis e 3 h');
  });

  it('round-trips SLA deadlines and lists versions newest first', () => {
    expect(prazosFromMatrix(matrixFromPrazos(prazos))).toEqual(prazos);
    const policy = toSlaPolicy({ id: 'p', nome: 'Padrão', versaoAtual: versao(2) } as Politica, [
      versao(1),
      versao(3),
      versao(2),
    ]);
    expect(policy.versions.map((v) => v.version)).toEqual([3, 2, 1]);
    // Sem histórico, usa a versão atual que veio na listagem.
    expect(
      toSlaPolicy({ id: 'p', nome: 'X', versaoAtual: versao(4) } as Politica, []).versions,
    ).toHaveLength(1);
  });

  it('normalizes the address to the backend format', () => {
    const form = createCompanyForm();
    form.setValue(
      companyFormValue(
        {
          logradouro: ' Av. Brasil ',
          numero: '10',
          complemento: '  ',
          bairro: 'Centro',
          cidade: 'Recife',
          uf: 'pe',
          cep: '50000-123',
        },
        ' ACME Ltda ',
        'a@b.com',
      ),
    );
    expect(form.valid).toBe(true);
    const dados = toDadosCliente(form);
    expect(dados.razaoSocial).toBe('ACME Ltda');
    expect(dados.endereco).toMatchObject({
      logradouro: 'Av. Brasil',
      complemento: null,
      uf: 'PE',
      cep: '50000123',
    });
    expect(formatAddress(dados.endereco)).toBe(
      'Av. Brasil, 10 · Centro · Recife/PE · CEP 50000-123',
    );
  });

  it('classifies contract validity against today in Brasília', () => {
    const today = '2026-11-17';
    expect(contractTerm({ startDate: '2026-01-01', endDate: '2026-12-31' }, today)).toBe('current');
    expect(contractTerm({ startDate: '2026-11-18', endDate: '2027-01-01' }, today)).toBe('future');
    expect(contractTerm({ startDate: '2026-01-01', endDate: '2026-11-16' }, today)).toBe('expired');
    // 02:00 UTC de 18/11 ainda é 17/11 em Brasília.
    expect(todayIso(new Date('2026-11-18T02:00:00Z'))).toBe('2026-11-17');
  });
});
