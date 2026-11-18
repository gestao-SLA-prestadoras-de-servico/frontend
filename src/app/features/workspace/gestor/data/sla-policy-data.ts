import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { Politica, Prioridade, PrazosPorPrioridade, VersaoPolitica } from '@app/core/api/modelos';

export type SlaPriority = 'alta' | 'normal';
export type SlaClock = 'response' | 'field' | 'resolution';

export interface SlaPriorityTimes {
  response: number;
  field: number;
  resolution: number;
}

export type SlaTimeMatrix = Record<SlaPriority, SlaPriorityTimes>;

export interface SlaPolicyVersion {
  id: string;
  version: number;
  createdAt: string;
  defaultPriority: Prioridade;
  summary: string;
  matrix: SlaTimeMatrix;
}

export interface SlaPolicy {
  id: string;
  name: string;
  /** Mais recente primeiro; a [0] é a vigente. */
  versions: readonly SlaPolicyVersion[];
}

export const SLA_PRIORITIES: readonly { key: SlaPriority; label: string }[] = [
  { key: 'alta', label: 'Alta' },
  { key: 'normal', label: 'Normal' },
];

export const SLA_CLOCKS: readonly { key: SlaClock; label: string; shortLabel: string }[] = [
  { key: 'response', label: 'Resposta do gestor', shortLabel: 'Resposta' },
  { key: 'field', label: 'Atendimento em campo', shortLabel: 'Campo' },
  { key: 'resolution', label: 'Resolução', shortLabel: 'Resolução' },
];

const PRIORIDADE_LABEL: Record<Prioridade, string> = { ALTA: 'Alta', NORMAL: 'Normal' };

export function matrixFromPrazos(prazos: PrazosPorPrioridade): SlaTimeMatrix {
  const times = (p: PrazosPorPrioridade['alta']) => ({
    response: p.resposta,
    field: p.campo,
    resolution: p.resolucao,
  });
  return { alta: times(prazos.alta), normal: times(prazos.normal) };
}

export function prazosFromMatrix(matrix: SlaTimeMatrix): PrazosPorPrioridade {
  const prazos = (t: SlaPriorityTimes) => ({
    resposta: t.response,
    campo: t.field,
    resolucao: t.resolution,
  });
  return { alta: prazos(matrix.alta), normal: prazos(matrix.normal) };
}

export function toSlaPolicyVersion(v: VersaoPolitica): SlaPolicyVersion {
  return {
    id: v.id,
    version: v.numero,
    createdAt: v.criadaEm,
    defaultPriority: v.prioridadePadrao,
    summary: `Prioridade padrão ${PRIORIDADE_LABEL[v.prioridadePadrao]}.`,
    matrix: matrixFromPrazos(v.prazos),
  };
}

export function toSlaPolicy(politica: Politica, versoes: readonly VersaoPolitica[]): SlaPolicy {
  const versions = (versoes.length ? versoes : [politica.versaoAtual])
    .map(toSlaPolicyVersion)
    .sort((a, b) => b.version - a.version);
  return { id: politica.id, name: politica.nome, versions };
}

/** Políticas com o histórico de versões (uma chamada por política). */
export function loadSlaPolicies(api: CadastroApi): Observable<SlaPolicy[]> {
  return api
    .politicas()
    .pipe(
      switchMap((politicas) =>
        politicas.length
          ? forkJoin(
              politicas.map((politica) =>
                api.versoes(politica.id).pipe(map((v) => toSlaPolicy(politica, v))),
              ),
            )
          : of([]),
      ),
    );
}

/** Janela de atendimento das 09h às 18h em dias úteis: 540 minutos por dia. */
const DIA_UTIL = 540;

export function windowExample(minutes: number): string {
  if (minutes < DIA_UTIL) return `${duration(minutes)} de janela`;
  const dias = Math.floor(minutes / DIA_UTIL);
  const resto = minutes % DIA_UTIL;
  const texto = `${dias} ${dias === 1 ? 'dia útil' : 'dias úteis'}`;
  return resto ? `${texto} e ${duration(resto)}` : texto;
}

function duration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function matrixPriorityIsOrdered(matrix: SlaTimeMatrix, priority: SlaPriority): boolean {
  const times = matrix[priority];
  return times.response < times.field && times.field < times.resolution;
}

export function inconsistentPriorities(matrix: SlaTimeMatrix): readonly SlaPriority[] {
  return SLA_PRIORITIES.map(({ key }) => key).filter(
    (priority) => !matrixPriorityIsOrdered(matrix, priority),
  );
}

export function currentPolicyVersion(policy: SlaPolicy): SlaPolicyVersion {
  return policy.versions[0];
}

export function previousPolicyVersion(
  policy: SlaPolicy,
  currentVersionId: string,
): SlaPolicyVersion | undefined {
  return policy.versions.find((version) => version.id !== currentVersionId);
}
