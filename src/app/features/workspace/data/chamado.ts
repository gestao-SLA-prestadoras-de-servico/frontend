import { Prioridade, RelogioView, TipoRelogio } from '@app/core/api/modelos';

/** Rótulos e conversões de chamado usados por mais de um perfil. */

export type PriorityLabel = 'Normal' | 'Alta';
export const PRIORIDADE_LABEL: Record<Prioridade, PriorityLabel> = {
  NORMAL: 'Normal',
  ALTA: 'Alta',
};

export const RELOGIO_LABEL: Record<TipoRelogio, string> = {
  RESPOSTA: 'Resposta',
  CAMPO: 'Atendimento em campo',
  RESOLUCAO: 'Resolução',
};

export interface Deadline {
  key: TipoRelogio;
  label: string;
  target: string;
  completedAt?: string;
  state: 'fulfilled' | 'running' | 'overdue';
}

const ESTADO_PRAZO = {
  CORRENDO: 'running',
  CUMPRIDO: 'fulfilled',
  VIOLADO: 'overdue',
} as const;

/** Um prazo por tipo: o relógio ativo ou, se nenhum estiver, o do ciclo mais recente. */
export function deadlinesFrom(relogios: readonly RelogioView[] = []): Deadline[] {
  return (Object.keys(RELOGIO_LABEL) as TipoRelogio[]).flatMap((tipo) => {
    const doTipo = relogios.filter((r) => r.tipo === tipo).sort((a, b) => b.ciclo - a.ciclo);
    const relogio = doTipo.find((r) => r.ativo) ?? doTipo[0];
    return relogio
      ? [
          {
            key: tipo,
            label: RELOGIO_LABEL[tipo],
            target: relogio.venceEm,
            completedAt: relogio.cumpridoEm ?? undefined,
            state: ESTADO_PRAZO[relogio.estado],
          },
        ]
      : [];
  });
}
