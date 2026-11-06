import { Injectable, signal } from '@angular/core';

export type ManagerTicketStatus =
  'ABERTO' | 'ATRIBUIDO' | 'EM_ATENDIMENTO' | 'RESOLVIDO' | 'CANCELADO' | 'ENCERRADO';
export type ManagerTicketPriority = 'Alta' | 'Normal';

export interface ManagerTicketEvent {
  at: string;
  title: string;
  detail: string;
  tone: 'neutral' | 'blue' | 'green' | 'red';
}

export interface ManagerTicketEvidence {
  id: string;
  fileName: string;
  caption: string;
  uploadedAt: string;
  status: 'DISPONÍVEL' | 'PROCESSANDO' | 'FALHA';
  failureMessage?: string;
}

export interface ManagerTicket {
  id: number;
  title: string;
  client: string;
  location: string;
  status: ManagerTicketStatus;
  priority: ManagerTicketPriority;
  suggestedPriority: ManagerTicketPriority;
  technician: string | null;
  openedAt: string;
  nextDeadline: string;
  responseClock: string;
  fieldClock: string;
  resolutionClock: string;
  overdue: boolean;
  description: string;
  firstPosition: string | null;
  timeline: readonly ManagerTicketEvent[];
  evidences: readonly ManagerTicketEvidence[];
  notifyOnCompletion: boolean | null;
}

const INITIAL_TICKETS: readonly ManagerTicket[] = [
  {
    id: 1043,
    title: 'Instabilidade no ponto de rede',
    client: 'Clínica Horizonte',
    location: 'Recepção · Térreo',
    status: 'ABERTO',
    priority: 'Normal',
    suggestedPriority: 'Alta',
    technician: null,
    openedAt: '05 nov · 08h40',
    nextDeadline: 'Resposta violada · exemplo',
    responseClock: 'Violada · 10h40',
    fieldClock: 'Até 06 nov · 10h40',
    resolutionClock: 'Até 09 nov · 10h40',
    overdue: true,
    description:
      'O ponto de rede da recepção perde conexão várias vezes ao longo do dia. A equipe precisa reconectar os computadores para retomar o atendimento.',
    firstPosition: null,
    timeline: [
      {
        at: '05 nov · 08h40',
        title: 'Chamado aberto',
        detail: 'Marina Alves · Clínica Horizonte',
        tone: 'neutral',
      },
      {
        at: '05 nov · 08h40',
        title: 'Aguardando triagem',
        detail: 'Prioridade sugerida: Alta',
        tone: 'blue',
      },
    ],
    evidences: [],
    notifyOnCompletion: true,
  },
  {
    id: 1042,
    title: 'Falha no sistema de climatização',
    client: 'Edifício Aurora',
    location: 'Sala técnica · 4º andar',
    status: 'EM_ATENDIMENTO',
    priority: 'Alta',
    suggestedPriority: 'Alta',
    technician: 'Rafael Costa',
    openedAt: '05 nov · 08h10',
    nextDeadline: 'Resolução · hoje às 16h',
    responseClock: 'Cumprida · 08h25',
    fieldClock: 'Cumprido · 09h40',
    resolutionClock: 'Hoje · 16h',
    overdue: false,
    description:
      'A unidade de climatização parou de resfriar a sala técnica. A temperatura dos equipamentos está acima da faixa normal.',
    firstPosition:
      'Recebemos o relato e estamos verificando a unidade de climatização. Enviaremos uma nova posição após a inspeção inicial.',
    timeline: [
      {
        at: '05 nov · 08h10',
        title: 'Chamado aberto',
        detail: 'Marina Alves · Edifício Aurora',
        tone: 'neutral',
      },
      {
        at: '05 nov · 08h25',
        title: 'Primeiro posicionamento',
        detail: 'Camila Moreira · E-mail demonstrativo',
        tone: 'blue',
      },
      {
        at: '05 nov · 09h40',
        title: 'Atendimento iniciado',
        detail: 'Rafael Costa · Sala técnica',
        tone: 'green',
      },
    ],
    evidences: [
      {
        id: 'evidence-1042-01',
        fileName: 'painel-climatizacao.jpg',
        caption: 'Painel da unidade antes do reparo',
        uploadedAt: '05 nov · 10h15',
        status: 'FALHA',
        failureMessage:
          'Não foi possível gerar a miniatura da imagem. O arquivo original continua preservado.',
      },
    ],
    notifyOnCompletion: true,
  },
  {
    id: 1041,
    title: 'Oscilação no quadro elétrico',
    client: 'Edifício Aurora',
    location: 'Quadro geral · Térreo',
    status: 'ATRIBUIDO',
    priority: 'Normal',
    suggestedPriority: 'Normal',
    technician: 'Rafael Costa',
    openedAt: '05 nov · 09h10',
    nextDeadline: 'Campo · hoje às 11h',
    responseClock: 'Cumprida · 09h25',
    fieldClock: 'Hoje · 11h',
    resolutionClock: '06 nov · 12h',
    overdue: false,
    description:
      'O quadro elétrico do térreo apresenta oscilação e desarma o circuito de iluminação em períodos de maior consumo.',
    firstPosition:
      'Recebemos a solicitação. Vamos inspecionar o quadro e retornaremos com uma atualização após a visita.',
    timeline: [
      {
        at: '05 nov · 09h10',
        title: 'Chamado aberto',
        detail: 'Marina Alves · Edifício Aurora',
        tone: 'neutral',
      },
      {
        at: '05 nov · 09h25',
        title: 'Primeiro posicionamento',
        detail: 'Camila Moreira · E-mail demonstrativo',
        tone: 'blue',
      },
      { at: '05 nov · 09h32', title: 'Técnico indicado', detail: 'Rafael Costa', tone: 'blue' },
    ],
    evidences: [],
    notifyOnCompletion: false,
  },
  {
    id: 1038,
    title: 'Ajuste da bomba de circulação',
    client: 'Edifício Aurora',
    location: 'Casa de máquinas',
    status: 'RESOLVIDO',
    priority: 'Normal',
    suggestedPriority: 'Normal',
    technician: 'Juliana Pires',
    openedAt: '04 nov · 08h20',
    nextDeadline: 'Aguardando validação do cliente',
    responseClock: 'Cumprida · 08h40',
    fieldClock: 'Cumprido · 10h05',
    resolutionClock: 'Cumprida · 11h30',
    overdue: false,
    description:
      'A bomba de circulação apresenta ruído e baixa pressão no retorno de água. O atendimento foi concluído e aguarda validação do cliente.',
    firstPosition: 'Vamos verificar a bomba de circulação e enviar a posição após a inspeção.',
    timeline: [
      {
        at: '04 nov · 08h20',
        title: 'Chamado aberto',
        detail: 'Marina Alves · Edifício Aurora',
        tone: 'neutral',
      },
      {
        at: '04 nov · 10h05',
        title: 'Atendimento iniciado',
        detail: 'Juliana Pires · Casa de máquinas',
        tone: 'green',
      },
      {
        at: '04 nov · 11h30',
        title: 'Atendimento resolvido',
        detail: 'Aguardando validação do cliente',
        tone: 'green',
      },
    ],
    evidences: [
      {
        id: 'evidence-1038-01',
        fileName: 'bomba-reparada.jpg',
        caption: 'Conjunto após o ajuste',
        uploadedAt: '04 nov · 11h10',
        status: 'DISPONÍVEL',
      },
    ],
    notifyOnCompletion: true,
  },
  {
    id: 1036,
    title: 'Vazamento no registro de entrada',
    client: 'Mercado Estação',
    location: 'Área de recebimento',
    status: 'CANCELADO',
    priority: 'Normal',
    suggestedPriority: 'Normal',
    technician: null,
    openedAt: '03 nov · 14h20',
    nextDeadline: 'Cancelado em 03 nov',
    responseClock: 'Cancelada',
    fieldClock: 'Cancelado',
    resolutionClock: 'Cancelada',
    overdue: false,
    description:
      'O registro de entrada foi substituído pela equipe de manutenção do cliente antes da visita.',
    firstPosition: 'Recebemos a solicitação e vamos verificar a disponibilidade de atendimento.',
    timeline: [
      { at: '03 nov · 14h20', title: 'Chamado aberto', detail: 'Mercado Estação', tone: 'neutral' },
      {
        at: '03 nov · 15h00',
        title: 'Chamado cancelado',
        detail: 'Exemplo demonstrativo',
        tone: 'red',
      },
    ],
    evidences: [],
    notifyOnCompletion: false,
  },
  {
    id: 1032,
    title: 'Luminárias do corredor',
    client: 'Residencial Alameda',
    location: 'Bloco B · 2º andar',
    status: 'ENCERRADO',
    priority: 'Normal',
    suggestedPriority: 'Normal',
    technician: 'Juliana Pires',
    openedAt: '02 nov · 09h15',
    nextDeadline: 'Encerrado em 04 nov',
    responseClock: 'Cumprida · 09h30',
    fieldClock: 'Cumprido · 11h00',
    resolutionClock: 'Cumprida · 04 nov',
    overdue: false,
    description: 'Duas luminárias do corredor do segundo andar deixaram de acender.',
    firstPosition: 'Recebemos o chamado e vamos organizar a visita técnica.',
    timeline: [
      {
        at: '02 nov · 09h15',
        title: 'Chamado aberto',
        detail: 'Residencial Alameda',
        tone: 'neutral',
      },
      {
        at: '04 nov · 11h40',
        title: 'Chamado encerrado',
        detail: 'Solução validada pelo cliente',
        tone: 'green',
      },
    ],
    evidences: [],
    notifyOnCompletion: true,
  },
];

@Injectable({ providedIn: 'root' })
export class ManagerTicketDemoStore {
  readonly tickets = signal<readonly ManagerTicket[]>(INITIAL_TICKETS);

  byId(id: number): ManagerTicket | null {
    return this.tickets().find((ticket) => ticket.id === id) ?? null;
  }
}

export function managerTicketById(value: string | number | null): ManagerTicket | null {
  if (value === null || !/^\d+$/.test(String(value))) return null;
  const id = Number(value);
  return INITIAL_TICKETS.find((ticket) => ticket.id === id) ?? null;
}

export const MANAGER_TICKET_STATUSES: readonly ManagerTicketStatus[] = [
  'ABERTO',
  'ATRIBUIDO',
  'EM_ATENDIMENTO',
  'RESOLVIDO',
  'CANCELADO',
  'ENCERRADO',
];
