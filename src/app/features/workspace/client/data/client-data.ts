import {
  ChamadoCliente,
  EstadoChamado,
  EventoView,
  Papel,
  TipoRelogio,
} from '@app/core/api/modelos';
import {
  Deadline,
  deadlinesFrom,
  PRIORIDADE_LABEL,
  PriorityLabel,
  RELOGIO_LABEL,
} from '../../data/chamado';

export { deadlinesFrom };

export type ClientStatus = EstadoChamado;
export type ClientPriority = PriorityLabel;
export type ClientDeadline = Deadline;
export interface ClientEvent {
  title: string;
  at: string;
  author: string;
  description: string;
}
export interface ClientTicket {
  id: string;
  number: number;
  title: string;
  location: string;
  status: ClientStatus;
  priority: ClientPriority;
  contractId: string;
  openedAt: string;
  resolvedAt: string | null;
  nextDueAt: string | null;
  description: string;
  firstResponse: string | null;
  deadlines: readonly ClientDeadline[];
  resolution: string | null;
  version: number;
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  ABERTO: 'Aberto',
  ATRIBUIDO: 'Atribuído',
  EM_ATENDIMENTO: 'Em atendimento',
  RESOLVIDO: 'Aguardando validação',
  ENCERRADO: 'Encerrado',
  CANCELADO: 'Cancelado',
};
export const CLIENT_PRIORITIES: readonly ClientPriority[] = ['Normal', 'Alta'];
export function toClientTicket(chamado: ChamadoCliente): ClientTicket {
  const ultimoRelato = [...(chamado.atendimentos ?? [])]
    .reverse()
    .find((a) => a.descricaoTecnica)?.descricaoTecnica;
  return {
    id: chamado.id,
    number: chamado.numero,
    title: chamado.titulo,
    location: chamado.local,
    status: chamado.estado,
    priority: PRIORIDADE_LABEL[chamado.prioridade],
    contractId: chamado.contratoId,
    openedAt: chamado.abertoEm,
    resolvedAt: chamado.resolvidoEm,
    // O backend mantém o último vencimento mesmo depois de encerrar.
    nextDueAt: chamado.estadoFinalEm ? null : chamado.proximoVencimento,
    description: chamado.descricao,
    firstResponse: chamado.posicionamento,
    deadlines: deadlinesFrom(chamado.relogios),
    resolution: ultimoRelato ?? null,
    version: chamado.version,
  };
}

const AUTOR: Record<Papel, string> = { CLIENTE: 'Cliente', TECNICO: 'Técnico', GESTOR: 'Gestor' };

export function toClientEvent(evento: EventoView): ClientEvent {
  const dados = evento.dados as Record<string, string>;
  const [title, description] = ((): [string, string] => {
    switch (evento.evento) {
      case 'ABERTURA':
        return ['Chamado aberto', `Chamado #${dados['numero']} registrado.`];
      case 'MUDANCA_ESTADO':
        return [
          `${CLIENT_STATUS_LABELS[dados['para'] as ClientStatus] ?? dados['para']}`,
          `Estado anterior: ${CLIENT_STATUS_LABELS[dados['de'] as ClientStatus] ?? dados['de']}.`,
        ];
      case 'POSICIONAMENTO':
        return ['Primeiro posicionamento registrado', 'A prestadora respondeu à solicitação.'];
      case 'REABERTURA':
        return ['Chamado reaberto', dados['justificativa'] ?? ''];
      case 'VIOLACAO_SLA':
        return [
          'Prazo ultrapassado',
          `${RELOGIO_LABEL[dados['relogio'] as TipoRelogio] ?? dados['relogio']} fora do prazo.`,
        ];
      default:
        return ['Atualização do chamado', ''];
    }
  })();
  return {
    title,
    at: evento.ocorridoEm,
    author: evento.atorPapel ? AUTOR[evento.atorPapel] : 'Sistema',
    description,
  };
}
