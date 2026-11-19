/**
 * DTOs do backend (app-principal), escritos à mão a partir dos records Java.
 * Instant chega como ISO-8601 UTC; LocalDate como YYYY-MM-DD.
 */

export type Papel = 'CLIENTE' | 'TECNICO' | 'GESTOR';
export type Prioridade = 'ALTA' | 'NORMAL';
export type EstadoChamado =
  'ABERTO' | 'ATRIBUIDO' | 'EM_ATENDIMENTO' | 'RESOLVIDO' | 'ENCERRADO' | 'CANCELADO';
export type EstadoAtendimento = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'INTERROMPIDO';
export type TipoRelogio = 'RESPOSTA' | 'CAMPO' | 'RESOLUCAO';
export type EstadoRelogio = 'CORRENDO' | 'CUMPRIDO' | 'VIOLADO';
export type EstadoEvidencia = 'RECEBIDA' | 'PROCESSANDO' | 'DISPONIVEL' | 'FALHA' | 'EXPURGADA';

/** Spring Data `PagedModel`. */
export interface Pagina<T> {
  content: T[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
}

/** RFC 9457 + `codigo` (ver backend/docs/erros-api.md). */
export interface Problema {
  title?: string;
  status: number;
  detail?: string;
  codigo?: string;
  erros?: { campo: string; mensagem: string }[];
}

export interface RelogioView {
  tipo: TipoRelogio;
  ciclo: number;
  ativo: boolean;
  marcoInicial: string;
  prazoMinutos: number;
  venceEm: string;
  cumpridoEm: string | null;
  violadoEm: string | null;
  estado: EstadoRelogio;
}

export interface AtendimentoView {
  id: string;
  tecnicoSub: string;
  estado: EstadoAtendimento;
  iniciadoEm: string | null;
  encerradoEm: string | null;
  descricaoTecnica: string | null;
  evidencias: number;
}

interface ChamadoBase {
  id: string;
  numero: number;
  clienteId: string;
  titulo: string;
  descricao: string;
  local: string;
  estado: EstadoChamado;
  prioridadeSugerida: Prioridade | null;
  /** Prioridade efetiva. */
  prioridade: Prioridade;
  abertoEm: string;
  resolvidoEm: string | null;
  estadoFinalEm: string | null;
  comViolacao: boolean;
  proximoVencimento: string | null;
  /** Só no detalhe. */
  relogios?: RelogioView[];
  atendimentos?: AtendimentoView[];
}

export interface ChamadoCliente extends ChamadoBase {
  contratoId: string;
  politicaVersaoId: string;
  prioridadeDefinida: Prioridade | null;
  prioridadePadrao: Prioridade;
  posicionamento: string | null;
  posicionadoEm: string | null;
  version: number;
}

export interface ChamadoGestor extends ChamadoCliente {
  tecnicoSub: string | null;
  notificarConclusao?: boolean;
}

export interface ChamadoTecnico extends ChamadoBase {
  tecnicoSub: string | null;
}

export type ContagemChamados = Record<EstadoChamado, number>;

export interface EventoView {
  evento:
    | 'ABERTURA'
    | 'MUDANCA_ESTADO'
    | 'ALTERACAO_PRIORIDADE'
    | 'POSICIONAMENTO'
    | 'ATRIBUICAO'
    | 'REATRIBUICAO'
    | 'TRANSFERENCIA_POR_INATIVACAO'
    | 'REABERTURA'
    | 'VIOLACAO_SLA';
  /** null = SISTEMA. */
  atorPapel: Papel | null;
  ocorridoEm: string;
  dados: Record<string, unknown>;
}

export interface NovoChamado {
  contratoId: string;
  titulo: string;
  descricao: string;
  local: string;
  prioridadeSugerida?: Prioridade;
}

export interface Contrato {
  id: string;
  clienteId: string;
  codigo: string;
  inicioVigencia: string;
  fimVigencia: string;
  politicaId: string | null;
}

export interface ItemEvidencia {
  id: string;
  nome: string;
  tipoConteudo: string;
  tamanho: number;
  hashSha256: string;
  estado: EstadoEvidencia;
  enviadaEm: string;
  expurgadaEm: string | null;
}

export interface EvidenciasDoAtendimento {
  atendimentoId: string;
  evidencias: ItemEvidencia[];
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  /** Duas letras maiúsculas. */
  uf: string;
  /** Oito dígitos, sem traço. */
  cep: string;
}

export interface Cliente {
  id: string;
  razaoSocial: string;
  emailContato: string;
  endereco: Endereco;
  ativo: boolean;
  version: number;
}

export interface DadosCliente {
  razaoSocial: string;
  emailContato: string;
  endereco: Endereco;
}

/** Minutos de janela útil; resposta < campo < resolução. */
export interface Prazos {
  resposta: number;
  campo: number;
  resolucao: number;
}

export interface PrazosPorPrioridade {
  alta: Prazos;
  normal: Prazos;
}

export interface VersaoPolitica {
  id: string;
  numero: number;
  prioridadePadrao: Prioridade;
  prazos: PrazosPorPrioridade;
  criadaEm: string;
  criadaPor: string | null;
}

export interface Politica {
  id: string;
  nome: string;
  versaoAtual: VersaoPolitica;
}

export interface DadosContrato {
  clienteId: string;
  codigo: string;
  inicioVigencia: string;
  fimVigencia: string;
}

export interface UsuarioResumo {
  id: string;
  sub: string;
  nome: string;
  email: string;
  perfil: Papel;
  clienteId: string | null;
  ativo: boolean;
}

export interface NovoUsuario {
  nome: string;
  email: string;
  perfil: Papel;
  clienteId?: string;
}

export interface UsuarioCadastrado extends Omit<UsuarioResumo, 'ativo'> {
  emailDefinicaoSenhaEnviado: boolean;
}

export interface Tecnico {
  id: string;
  sub: string;
  nome: string;
  chamadosNaoFinalizados: number;
}

/** `GET /api/chamados/{id}/sla`: apuração congelada no encerramento (RF-37). */
export interface ApuracaoSla {
  apurado: boolean;
  prioridade: Prioridade | null;
  congeladaEm: string | null;
  relogios:
    | {
        tipo: TipoRelogio;
        prazoMinutos: number;
        venceEm: string;
        cumpridoEm: string | null;
        violadoEm: string | null;
        resultado: 'CUMPRIDO' | 'VIOLADO';
        violouEmCicloAnterior: boolean;
      }[]
    | null;
}
