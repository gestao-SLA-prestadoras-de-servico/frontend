import {
  ChamadoTecnico,
  EstadoChamado,
  EstadoEvidencia,
  EventoView,
  EvidenciasDoAtendimento,
} from '@app/core/api/modelos';
import { deadlinesFrom, PRIORIDADE_LABEL, PriorityLabel } from '../data/chamado';

export type TechnicianStatus = EstadoChamado;
export type TechnicianPriority = PriorityLabel;
export type EvidenceState = EstadoEvidencia;

export interface TechnicianEvidence {
  id: string;
  name: string;
  sizeBytes: number;
  state: EvidenceState;
  recordedAt: string;
}

export interface TechnicianDeadline {
  label: string;
  dueAt: string;
  state: 'on-time' | 'urgent' | 'overdue';
}

export interface TechnicianTicket {
  id: string;
  number: number;
  title: string;
  location: string;
  description: string;
  status: TechnicianStatus;
  priority: TechnicianPriority;
  technicalDescription: string;
  deadline: TechnicianDeadline | null;
  alertLabel?: string;
  assignedAt?: string;
  startedAt?: string;
  evidences: readonly TechnicianEvidence[];
}

export const EVIDENCE_STATE_LABELS: Record<EvidenceState, string> = {
  RECEBIDA: 'Recebida',
  PROCESSANDO: 'Processando',
  DISPONIVEL: 'Disponível',
  FALHA: 'Falha',
  EXPURGADA: 'Expurgada',
};

const URGENTE_MS = 2 * 60 * 60 * 1000;

export function deadlineState(dueAt: string, now = Date.now()): TechnicianDeadline['state'] {
  const restante = new Date(dueAt).getTime() - now;
  return restante < 0 ? 'overdue' : restante < URGENTE_MS ? 'urgent' : 'on-time';
}

/**
 * `chamado` da listagem não traz relógios nem atendimentos: o prazo vem de `proximoVencimento`.
 * No detalhe, o prazo mostrado é o relógio correndo que vence primeiro.
 */
export function toTechnicianTicket(
  chamado: ChamadoTecnico,
  evidencias: readonly EvidenciasDoAtendimento[] = [],
  historico: readonly EventoView[] = [],
  now = Date.now(),
): TechnicianTicket {
  const atendimento = chamado.atendimentos?.at(-1);
  const correndo = deadlinesFrom(chamado.relogios)
    .filter((d) => d.state === 'running')
    .sort((a, b) => a.target.localeCompare(b.target))[0];
  const dueAt = chamado.estadoFinalEm
    ? null
    : (correndo?.target ?? chamado.proximoVencimento ?? null);
  const grupo = evidencias.find((g) => g.atendimentoId === atendimento?.id) ?? evidencias.at(-1);
  const atribuicao = historico
    .filter((e) =>
      ['ATRIBUICAO', 'REATRIBUICAO', 'TRANSFERENCIA_POR_INATIVACAO'].includes(e.evento),
    )
    .at(-1);
  return {
    id: chamado.id,
    number: chamado.numero,
    title: chamado.titulo,
    location: chamado.local,
    description: chamado.descricao,
    status: chamado.estado,
    priority: PRIORIDADE_LABEL[chamado.prioridade],
    technicalDescription: atendimento?.descricaoTecnica ?? '',
    deadline: dueAt
      ? {
          label: correndo?.label ?? 'Próximo prazo',
          dueAt,
          state: deadlineState(dueAt, now),
        }
      : null,
    alertLabel: chamado.comViolacao ? 'Este chamado já teve um prazo de SLA violado' : undefined,
    assignedAt: atribuicao?.ocorridoEm,
    startedAt: atendimento?.iniciadoEm ?? undefined,
    evidences: (grupo?.evidencias ?? []).map((e) => ({
      id: e.id,
      name: e.nome,
      sizeBytes: e.tamanho,
      state: e.estado,
      recordedAt: e.enviadaEm,
    })),
  };
}

const validEvidenceStates: readonly EvidenceState[] = ['RECEBIDA', 'PROCESSANDO', 'DISPONIVEL'];

export function evidenceCountsForCompletion(evidence: TechnicianEvidence): boolean {
  return validEvidenceStates.includes(evidence.state);
}

export function evidencePending(evidence: TechnicianEvidence): boolean {
  return evidence.state === 'RECEBIDA' || evidence.state === 'PROCESSANDO';
}

export const ALLOWED_EVIDENCE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_EVIDENCE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;
export const MAX_EVIDENCE_SIZE_BYTES = 10 * 1024 * 1024;

/** Mesma checagem do backend (RN-75), para avisar antes de enviar. */
export function evidenceFileError(file: File): string | null {
  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  const supported = file.type
    ? (ALLOWED_EVIDENCE_TYPES as readonly string[]).includes(file.type)
    : (ALLOWED_EVIDENCE_EXTENSIONS as readonly string[]).includes(extension);
  if (!supported) return `${file.name}: escolha uma imagem JPEG, PNG ou WebP.`;
  if (file.size > MAX_EVIDENCE_SIZE_BYTES) return `${file.name}: o limite é 10 MB por imagem.`;
  return null;
}
