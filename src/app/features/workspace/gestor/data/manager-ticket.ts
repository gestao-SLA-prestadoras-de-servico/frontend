import { forkJoin, map, Observable } from 'rxjs';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { ChamadosApi } from '@app/core/api/chamados.api';
import {
  ChamadoGestor,
  EstadoChamado,
  EstadoEvidencia,
  EventoView,
  EvidenciasDoAtendimento,
  TipoRelogio,
} from '@app/core/api/modelos';
import { UsuariosApi } from '@app/core/api/usuarios.api';
import {
  Deadline,
  deadlinesFrom,
  PRIORIDADE_LABEL,
  PriorityLabel,
  RELOGIO_LABEL,
} from '../../data/chamado';

export type ManagerTicketStatus = EstadoChamado;
export type ManagerTicketPriority = PriorityLabel;

export interface ManagerTicketEvent {
  at: string;
  title: string;
  detail: string;
  tone: 'neutral' | 'blue' | 'green' | 'red';
}

export interface ManagerTicketEvidence {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: EstadoEvidencia;
}

export interface ManagerTicket {
  id: string;
  number: number;
  title: string;
  client: string;
  location: string;
  status: ManagerTicketStatus;
  priority: ManagerTicketPriority;
  suggestedPriority: ManagerTicketPriority | null;
  /** Definida pelo gestor; nula enquanto vale a padrão da política. */
  definedPriority: ManagerTicketPriority | null;
  technician: string | null;
  technicianSub: string | null;
  openedAt: string;
  /** Nulo quando não há prazo correndo ou o chamado já chegou ao fim. */
  nextDeadline: string | null;
  overdue: boolean;
  description: string;
  firstPosition: string | null;
  policyVersionId: string;
  version: number;
  /** Só no detalhe. */
  deadlines: readonly Deadline[];
  timeline: readonly ManagerTicketEvent[];
  evidences: readonly ManagerTicketEvidence[];
  /** Preferência do gestor logado; indefinida na listagem. */
  notifyOnCompletion?: boolean;
}

/** sub → nome de todos os usuários e id → razão social das empresas. */
export interface ManagerNames {
  people: ReadonlyMap<string, string>;
  companies: ReadonlyMap<string, string>;
}

export const FINAL_STATUSES: readonly ManagerTicketStatus[] = ['ENCERRADO', 'CANCELADO'];
/** Estados em que o gestor ainda tria, atribui ou cancela. */
export const ACTIVE_STATUSES: readonly ManagerTicketStatus[] = [
  'ABERTO',
  'ATRIBUIDO',
  'EM_ATENDIMENTO',
];

const STATUS_LABEL: Record<ManagerTicketStatus, string> = {
  ABERTO: 'Aberto',
  ATRIBUIDO: 'Atribuído',
  EM_ATENDIMENTO: 'Em atendimento',
  RESOLVIDO: 'Resolvido',
  ENCERRADO: 'Encerrado',
  CANCELADO: 'Cancelado',
};

const label = (p: ChamadoGestor['prioridade'] | null) => (p ? PRIORIDADE_LABEL[p] : null);

export function toManagerTicket(
  chamado: ChamadoGestor,
  names: ManagerNames,
  historico: readonly EventoView[] = [],
  evidencias: readonly EvidenciasDoAtendimento[] = [],
): ManagerTicket {
  const final = !!chamado.estadoFinalEm;
  return {
    id: chamado.id,
    number: chamado.numero,
    title: chamado.titulo,
    client: names.companies.get(chamado.clienteId) ?? 'Empresa indisponível',
    location: chamado.local,
    status: chamado.estado,
    priority: PRIORIDADE_LABEL[chamado.prioridade],
    suggestedPriority: label(chamado.prioridadeSugerida),
    definedPriority: label(chamado.prioridadeDefinida),
    technician: chamado.tecnicoSub
      ? (names.people.get(chamado.tecnicoSub) ?? 'Técnico removido')
      : null,
    technicianSub: chamado.tecnicoSub,
    openedAt: chamado.abertoEm,
    nextDeadline: final ? null : chamado.proximoVencimento,
    overdue: chamado.comViolacao,
    description: chamado.descricao,
    firstPosition: chamado.posicionamento,
    policyVersionId: chamado.politicaVersaoId,
    version: chamado.version,
    deadlines: deadlinesFrom(chamado.relogios),
    timeline: historico.map((evento) => toManagerEvent(evento, names.people)),
    evidences: evidencias
      .flatMap((grupo) => grupo.evidencias)
      .map((e) => ({ id: e.id, fileName: e.nome, uploadedAt: e.enviadaEm, status: e.estado })),
    notifyOnCompletion: chamado.notificarConclusao,
  };
}

const AUTOR = { CLIENTE: 'Cliente', TECNICO: 'Técnico', GESTOR: 'Gestor' } as const;

/** O gestor vê todos os eventos; técnicos chegam como `sub` e viram nome. */
export function toManagerEvent(
  evento: EventoView,
  people: ReadonlyMap<string, string>,
): ManagerTicketEvent {
  const dados = evento.dados as Record<string, string>;
  const nome = (sub?: string) => (sub ? (people.get(sub) ?? 'técnico removido') : '—');
  const autor = evento.atorPapel ? AUTOR[evento.atorPapel] : 'Sistema';
  const [title, detail, tone] = ((): [string, string, ManagerTicketEvent['tone']] => {
    switch (evento.evento) {
      case 'ABERTURA':
        return ['Chamado aberto', `Chamado #${dados['numero']} · ${autor}`, 'neutral'];
      case 'MUDANCA_ESTADO':
        return [
          STATUS_LABEL[dados['para'] as ManagerTicketStatus] ?? dados['para'],
          `Antes: ${STATUS_LABEL[dados['de'] as ManagerTicketStatus] ?? dados['de']} · ${autor}`,
          dados['para'] === 'CANCELADO'
            ? 'red'
            : ['RESOLVIDO', 'ENCERRADO'].includes(dados['para'])
              ? 'green'
              : 'blue',
        ];
      case 'ALTERACAO_PRIORIDADE':
        return [
          'Prioridade definida',
          `${label(dados['anterior'] as never) ?? '—'} → ${label(dados['nova'] as never)}`,
          'blue',
        ];
      case 'POSICIONAMENTO':
        return ['Primeiro posicionamento enviado', autor, 'blue'];
      case 'ATRIBUICAO':
        return ['Técnico atribuído', nome(dados['tecnico']), 'blue'];
      case 'REATRIBUICAO':
        return [
          'Técnico reatribuído',
          `${nome(dados['anterior'])} → ${nome(dados['novo'])}`,
          'blue',
        ];
      case 'TRANSFERENCIA_POR_INATIVACAO':
        return [
          'Transferido por inativação',
          `${nome(dados['anterior'])} → ${nome(dados['novo'])}`,
          'blue',
        ];
      case 'REABERTURA':
        return ['Chamado reaberto', dados['justificativa'] ?? '', 'red'];
      case 'VIOLACAO_SLA':
        return [
          'Prazo violado',
          `${RELOGIO_LABEL[dados['relogio'] as TipoRelogio] ?? dados['relogio']} · ciclo ${dados['ciclo']}`,
          'red',
        ];
    }
  })();
  return { at: evento.ocorridoEm, title, detail, tone };
}

/** Nomes para exibir chamados: todos os usuários (inclusive inativos) e todas as empresas. */
export function loadManagerNames(
  usuarios: UsuariosApi,
  cadastro: CadastroApi,
): Observable<ManagerNames> {
  return forkJoin({ users: usuarios.listar(), clientes: cadastro.clientes() }).pipe(
    map(({ users, clientes }) => ({
      people: new Map(users.map((u) => [u.sub, u.nome])),
      companies: new Map(clientes.map((c) => [c.id, c.razaoSocial])),
    })),
  );
}

/** Fila completa do gestor, já com nomes; mais urgentes primeiro. */
export function loadManagerTickets(
  chamados: ChamadosApi,
  usuarios: UsuariosApi,
  cadastro: CadastroApi,
): Observable<ManagerTicket[]> {
  return forkJoin({
    lista: chamados.listarTodos<ChamadoGestor>({ sort: 'numero,desc' }),
    names: loadManagerNames(usuarios, cadastro),
  }).pipe(map(({ lista, names }) => lista.map((c) => toManagerTicket(c, names))));
}
