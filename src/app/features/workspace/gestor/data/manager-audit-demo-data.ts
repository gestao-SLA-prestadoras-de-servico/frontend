import type { ManagerTicketStatus } from './manager-ticket-demo-store';
import { PURGED_EVIDENCE_SAMPLE } from './purged-evidence-demo-data';

export const AUDIT_ACTORS = {
  camila: { name: 'Camila Moreira', role: 'Gestor', id: 'demo-camila' },
  rafael: { name: 'Rafael Costa', role: 'Técnico', id: 'demo-rafael' },
  juliana: { name: 'Juliana Pires', role: 'Técnico', id: 'demo-juliana' },
  marina: { name: 'Marina Alves', role: 'Cliente · Edifício Aurora', id: 'demo-marina' },
  system: { name: 'Sistema', role: 'Rotina demonstrativa', id: 'demo-sistema' },
} as const;

export const AUDIT_OPERATIONS = {
  evidence: { label: 'Envio de evidência', tone: 'neutral' },
  status: { label: 'Mudança de estado', tone: 'neutral' },
  violation: { label: 'Violação de SLA', tone: 'danger' },
  priority: { label: 'Alteração de prioridade', tone: 'neutral' },
  opened: { label: 'Abertura de chamado', tone: 'neutral' },
  reopened: { label: 'Reabertura', tone: 'blue' },
  assigned: { label: 'Atribuição de técnico', tone: 'blue' },
  validated: { label: 'Validação automática', tone: 'green' },
  purged: { label: 'Expurgo de evidência', tone: 'neutral' },
  deactivated: { label: 'Inativação de usuário', tone: 'neutral' },
  created: { label: 'Cadastro de usuário', tone: 'neutral' },
} as const;

export const AUDIT_ENTITIES = {
  ticket: 'Chamados',
  evidence: 'Evidências',
  user: 'Usuários',
} as const;
export type AuditActor = keyof typeof AUDIT_ACTORS;
export type AuditOperation = keyof typeof AUDIT_OPERATIONS;
export type AuditEntity = keyof typeof AUDIT_ENTITIES;
export type AuditPeriod = 'last7' | 'last30' | 'all';

export interface AuditRecord {
  readonly id: string;
  readonly occurredAt: string;
  readonly date: string;
  readonly time: string;
  readonly actor: AuditActor;
  readonly operation: AuditOperation;
  readonly entity: { readonly kind: AuditEntity; readonly label: string };
  readonly summary: string;
  readonly ticket?: string;
  readonly reason?: string;
  readonly effects?: string;
  readonly evidenceId?: string;
  readonly transition?: { readonly from: ManagerTicketStatus; readonly to: ManagerTicketStatus };
}

// Histórico fictício independente dos stores de chamados/usuários. Consultar os registros
// não modifica entidades, relógios, arquivos ou contas. Datas e janela de filtro são fixas.
export const AUDIT_SCENE_DATE = '2026-11-05';
export const AUDIT_RECORDS: readonly AuditRecord[] = [
  {
    id: 'audit-012',
    occurredAt: '2026-11-05T15:31:00-03:00',
    date: '05 nov 2026',
    time: '15h31',
    actor: 'rafael',
    operation: 'evidence',
    entity: { kind: 'evidence', label: 'EV-5521 · #1042' },
    ticket: '#1042 · Falha no sistema de climatização',
    summary: 'Registro ilustrativo de uma fotografia anexada ao atendimento.',
    effects:
      'A referência da evidência passa a constar neste exemplo de histórico. Nenhum arquivo foi enviado.',
  },
  {
    id: 'audit-011',
    occurredAt: '2026-11-05T14:05:00-03:00',
    date: '05 nov 2026',
    time: '14h05',
    actor: 'rafael',
    operation: 'status',
    entity: { kind: 'ticket', label: '#1042' },
    ticket: '#1042 · Falha no sistema de climatização',
    summary: 'Exemplo da mudança de estado ao iniciar um atendimento.',
    transition: { from: 'ATRIBUIDO', to: 'EM_ATENDIMENTO' },
  },
  {
    id: 'audit-010',
    occurredAt: '2026-11-05T10:15:00-03:00',
    date: '05 nov 2026',
    time: '10h15',
    actor: 'system',
    operation: 'violation',
    entity: { kind: 'ticket', label: '#1043' },
    ticket: '#1043 · Instabilidade no ponto de rede',
    summary: 'Exemplo de identificação de violação do prazo de resposta.',
    effects:
      'O marcador de violação permanece no histórico ilustrativo, mesmo após uma resposta posterior.',
  },
  {
    id: 'audit-009',
    occurredAt: '2026-11-05T08:30:00-03:00',
    date: '05 nov 2026',
    time: '08h30',
    actor: 'camila',
    operation: 'priority',
    entity: { kind: 'ticket', label: '#1043' },
    ticket: '#1043 · Instabilidade no ponto de rede',
    summary: 'Exemplo de revisão da prioridade de Normal para Alta.',
    reason: 'Interrupção da rede usada na recepção.',
  },
  {
    id: 'audit-008',
    occurredAt: '2026-11-05T08:05:00-03:00',
    date: '05 nov 2026',
    time: '08h05',
    actor: 'marina',
    operation: 'opened',
    entity: { kind: 'ticket', label: '#1042' },
    ticket: '#1042 · Falha no sistema de climatização',
    summary: 'Registro fictício de abertura de um chamado pelo cliente.',
    effects: 'O exemplo registra a descrição do problema e a identificação do solicitante.',
  },
  {
    id: 'audit-007',
    occurredAt: '2026-11-04T11:02:00-03:00',
    date: '04 nov 2026',
    time: '11h02',
    actor: 'marina',
    operation: 'reopened',
    entity: { kind: 'ticket', label: '#1038' },
    ticket: '#1038 · Ajuste da bomba de circulação',
    summary: 'Exemplo de reabertura após a resolução informada pelo técnico.',
    transition: { from: 'RESOLVIDO', to: 'ATRIBUIDO' },
    reason: 'A bomba voltou a apresentar ruído no mesmo ponto no dia seguinte à visita.',
    effects:
      'Nova etapa de atendimento ilustrada, com o técnico mantido e novos prazos de campo e resolução. A consulta não altera o chamado.',
  },
  {
    id: 'audit-006',
    occurredAt: '2026-11-04T10:15:00-03:00',
    date: '04 nov 2026',
    time: '10h15',
    actor: 'camila',
    operation: 'assigned',
    entity: { kind: 'ticket', label: '#1041' },
    ticket: '#1041 · Oscilação no quadro elétrico',
    summary: 'Registro ilustrativo de atribuição do chamado a Rafael Costa.',
    effects: 'A responsabilidade técnica fica registrada neste exemplo de atribuição.',
  },
  {
    id: 'audit-005',
    occurredAt: '2026-11-03T16:30:00-03:00',
    date: '03 nov 2026',
    time: '16h30',
    actor: 'system',
    operation: 'validated',
    entity: { kind: 'ticket', label: '#1032' },
    ticket: '#1032 · Luminárias do corredor',
    summary: 'Exemplo de validação automática ao fim da janela prevista.',
    transition: { from: 'RESOLVIDO', to: 'ENCERRADO' },
  },
  {
    id: 'audit-004',
    occurredAt: PURGED_EVIDENCE_SAMPLE.purgedAt,
    date: '30 out 2026',
    time: '02h00',
    actor: 'system',
    operation: 'purged',
    entity: {
      kind: 'evidence',
      label: `${PURGED_EVIDENCE_SAMPLE.id} · #${PURGED_EVIDENCE_SAMPLE.ticketId}`,
    },
    evidenceId: PURGED_EVIDENCE_SAMPLE.id,
    ticket: '#1032 · Luminárias do corredor',
    summary: 'Exemplo de registro de expurgo de uma evidência após a retenção prevista.',
    effects:
      'Metadados ilustrativos preservados na trilha. Esta demonstração não contém nem remove o arquivo.',
  },
  {
    id: 'audit-003',
    occurredAt: '2026-10-29T09:48:00-03:00',
    date: '29 out 2026',
    time: '09h48',
    actor: 'camila',
    operation: 'deactivated',
    entity: { kind: 'user', label: 'Bianca Lopes' },
    summary: 'Exemplo de inativação de um usuário, sem excluir sua identificação do histórico.',
    reason: 'Encerramento da participação no atendimento deste cenário fictício.',
  },
  {
    id: 'audit-002',
    occurredAt: '2026-10-22T09:00:00-03:00',
    date: '22 out 2026',
    time: '09h00',
    actor: 'juliana',
    operation: 'evidence',
    entity: { kind: 'evidence', label: 'EV-4298 · #1038' },
    ticket: '#1038 · Ajuste da bomba de circulação',
    summary: 'Registro ilustrativo de evidência do atendimento em campo.',
  },
  {
    id: 'audit-001',
    occurredAt: '2026-09-22T09:00:00-03:00',
    date: '22 set 2026',
    time: '09h00',
    actor: 'camila',
    operation: 'created',
    entity: { kind: 'user', label: 'Bianca Lopes' },
    summary: 'Registro fictício de cadastro do perfil técnico de Bianca Lopes.',
    effects:
      'O identificador demonstrativo permite relacionar ações do mesmo usuário ao longo do histórico.',
  },
];

export interface AuditFilters {
  readonly actor: AuditActor | 'all';
  readonly entity: AuditEntity | 'all';
  readonly period: AuditPeriod;
}

export function filterAuditRecords(
  records: readonly AuditRecord[],
  filters: AuditFilters,
): AuditRecord[] {
  const starts: Record<AuditPeriod, string> = {
    last7: '2026-10-30',
    last30: '2026-10-07',
    all: '',
  };
  return records
    .filter((record) => {
      const day = record.occurredAt.slice(0, 10);
      return (
        (filters.actor === 'all' || record.actor === filters.actor) &&
        (filters.entity === 'all' || record.entity.kind === filters.entity) &&
        day >= starts[filters.period] &&
        day <= AUDIT_SCENE_DATE
      );
    })
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
}
