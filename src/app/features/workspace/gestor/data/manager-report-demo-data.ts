export type ReportClock = 'response' | 'field' | 'resolution';

export interface ReportTicket {
  readonly client: string;
  readonly technician: string;
  readonly response: boolean;
  readonly field: boolean;
  readonly resolution: boolean;
}

export interface ReportRate {
  readonly total: number;
  readonly fulfilled: number;
  readonly violated: number;
  readonly percentage: number;
}

export interface ReportRow {
  readonly name: string;
  readonly total: number;
  readonly response: ReportRate | null;
  readonly field: ReportRate;
  readonly resolution: ReportRate;
}

const CLOCKS: readonly { key: ReportClock; label: string }[] = [
  { key: 'response', label: 'Resposta' },
  { key: 'field', label: 'Atendimento em campo' },
  { key: 'resolution', label: 'Resolução' },
];

function rate(tickets: readonly ReportTicket[], clock: ReportClock): ReportRate {
  const total = tickets.length;
  const fulfilled = tickets.filter((ticket) => ticket[clock]).length;
  return {
    total,
    fulfilled,
    violated: total - fulfilled,
    percentage: total ? Math.round((fulfilled / total) * 100) : 0,
  };
}

export function buildManagerReport(tickets: readonly ReportTicket[]) {
  const group = (key: 'client' | 'technician'): ReportRow[] =>
    [...new Set(tickets.map((ticket) => ticket[key]))].map((name) => {
      const rows = tickets.filter((ticket) => ticket[key] === name);
      return {
        name,
        total: rows.length,
        response: key === 'client' ? rate(rows, 'response') : null,
        field: rate(rows, 'field'),
        resolution: rate(rows, 'resolution'),
      };
    });

  return {
    total: tickets.length,
    clocks: CLOCKS.map(({ key, label }) => ({ key, label, ...rate(tickets, key) })),
    clients: group('client'),
    technicians: group('technician'),
  };
}

// Amostra histórica fictícia e independente da fila atual. Os booleanos já representam
// o resultado demonstrativo do prazo; não há cálculo de relógios ou consulta operacional.
const SAMPLE_ASSIGNMENTS = [
  ['Edifício Aurora', 'Rafael Costa', 10],
  ['Edifício Aurora', 'Juliana Pires', 8],
  ['Clínica Horizonte', 'Bruno Prado', 9],
  ['Clínica Horizonte', 'Bianca Lopes', 6],
  ['Mercado Estação', 'Rafael Costa', 7],
  ['Mercado Estação', 'Juliana Pires', 5],
  ['Residencial Alameda', 'Juliana Pires', 3],
  ['Residencial Alameda', 'Bruno Prado', 5],
  ['Residencial Alameda', 'Bianca Lopes', 3],
] as const;

export const REPORT_TICKETS: readonly ReportTicket[] = SAMPLE_ASSIGNMENTS.flatMap(
  ([client, technician, count]) => Array.from({ length: count }, () => ({ client, technician })),
).map((ticket, index) => ({
  ...ticket,
  response: ![2, 35].includes(index + 1),
  field: ![1, 7, 22, 38, 51].includes(index + 1),
  resolution: ![3, 8, 20, 31, 39, 46, 54].includes(index + 1),
}));

export const MANAGER_REPORT_SAMPLE = {
  period: 'Setembro de 2026',
  ...buildManagerReport(REPORT_TICKETS),
};

export const REPORT_PERIODS = [
  { key: '2026-09', label: 'Setembro de 2026' },
  { key: '2026-10', label: 'Outubro de 2026' },
] as const;
export const REPORT_CLIENTS = [...new Set(REPORT_TICKETS.map((ticket) => ticket.client))];
export const REPORT_TECHNICIANS = [...new Set(REPORT_TICKETS.map((ticket) => ticket.technician))];
export interface ReportFilters {
  readonly period: string;
  readonly client: string;
  readonly technician: string;
}

// A amostra disponível pertence a setembro; outubro demonstra um período sem registros.
export function filterManagerReport(filters: ReportFilters) {
  return buildManagerReport(
    REPORT_TICKETS.filter(
      (ticket) =>
        filters.period === '2026-09' &&
        (filters.client === 'all' || ticket.client === filters.client) &&
        (filters.technician === 'all' || ticket.technician === filters.technician),
    ),
  );
}
