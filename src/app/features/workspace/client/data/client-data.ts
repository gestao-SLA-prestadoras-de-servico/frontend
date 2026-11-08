import { DEMO_TICKETS, DemoTicket } from '../../data/workspace-data';

export type ClientStatus = DemoTicket['status'] | 'ENCERRADO';
export type ClientPriority = 'Baixa' | 'Normal' | 'Alta' | 'Crítica';
export interface ClientDeadline {
  key: 'response' | 'field' | 'resolution';
  label: string;
  target: string;
  completedAt?: string;
  state: 'fulfilled' | 'running' | 'overdue';
}
export interface ClientEvent {
  title: string;
  at: string;
  author: string;
  description: string;
}
export interface ClientEvidence {
  title: string;
  description: string;
  image: string;
  alt: string;
  at: string;
}
export interface ClientTicket {
  id: number;
  title: string;
  company: string;
  location: string;
  status: ClientStatus;
  priority: ClientPriority;
  technician: string | null;
  contractId: string;
  openedAt: string;
  description: string;
  deadlines: readonly ClientDeadline[];
  events: readonly ClientEvent[];
  evidences: readonly ClientEvidence[];
  resolution?: string;
  validationDueAt?: string;
}
export interface ClientContract {
  id: string;
  title: string;
  available: boolean;
  validity: string;
  response: string;
  field: string;
  resolution: string;
}

/** All dates refer to a fictional snapshot on 05/11/2026 at 10:00 (Brasília). */
export const CLIENT_SNAPSHOT = '05/11/2026 às 10h · Horário de Brasília';
export const CLIENT_CONTRACTS: readonly ClientContract[] = [
  {
    id: 'CT-2026-014',
    title: 'Manutenção predial · Edifício Aurora',
    available: true,
    validity: 'Vigente até 31/12/2026',
    response: 'Até 1 hora',
    field: 'Até 4 horas',
    resolution: 'Até 8 horas',
  },
  {
    id: 'CT-2026-009',
    title: 'Manutenção de elevadores · Edifício Aurora',
    available: false,
    validity: 'Vencido em 31/10/2026',
    response: 'Até 2 horas',
    field: 'Até 6 horas',
    resolution: 'Até 24 horas',
  },
];
export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  ABERTO: 'Aberto',
  ATRIBUIDO: 'Atribuído',
  EM_ATENDIMENTO: 'Em atendimento',
  RESOLVIDO: 'Aguardando validação',
  ENCERRADO: 'Encerrado',
};
export const CLIENT_PRIORITIES: readonly ClientPriority[] = ['Baixa', 'Normal', 'Alta', 'Crítica'];

const existing = (id: number) => DEMO_TICKETS.find((ticket) => ticket.id === id)!;
export const CLIENT_TICKETS: readonly ClientTicket[] = [
  {
    ...existing(1042),
    contractId: 'CT-2026-014',
    openedAt: '2026-11-05T08:00:00-03:00',
    description:
      'O sistema de climatização do 4º andar não está resfriando as salas. O equipamento liga, mas a temperatura permanece elevada durante o uso.',
    deadlines: [
      {
        key: 'response',
        label: 'Resposta',
        target: '2026-11-05T09:00:00-03:00',
        completedAt: '2026-11-05T08:20:00-03:00',
        state: 'fulfilled',
      },
      {
        key: 'field',
        label: 'Atendimento em campo',
        target: '2026-11-05T12:00:00-03:00',
        completedAt: '2026-11-05T09:10:00-03:00',
        state: 'fulfilled',
      },
      {
        key: 'resolution',
        label: 'Resolução',
        target: '2026-11-05T16:00:00-03:00',
        state: 'running',
      },
    ],
    events: [
      {
        title: 'Chamado aberto',
        at: '2026-11-05T08:00:00-03:00',
        author: 'Marina Alves · Cliente',
        description: 'Solicitação de manutenção da climatização do 4º andar.',
      },
      {
        title: 'Atendimento atribuído',
        at: '2026-11-05T08:20:00-03:00',
        author: 'Camila Moreira · Gestora',
        description: 'Rafael Costa foi designado para o atendimento.',
      },
      {
        title: 'Atendimento em campo iniciado',
        at: '2026-11-05T09:10:00-03:00',
        author: 'Rafael Costa · Técnico',
        description: 'Inspeção dos filtros e do circuito de climatização em andamento.',
      },
    ],
    evidences: [],
  },
  {
    ...existing(1041),
    contractId: 'CT-2026-014',
    openedAt: '2026-11-05T07:00:00-03:00',
    description:
      'Oscilações de energia no quadro geral do térreo. Solicitamos avaliação das conexões e dos dispositivos de proteção.',
    deadlines: [
      {
        key: 'response',
        label: 'Resposta',
        target: '2026-11-05T08:00:00-03:00',
        completedAt: '2026-11-05T07:25:00-03:00',
        state: 'fulfilled',
      },
      {
        key: 'field',
        label: 'Atendimento em campo',
        target: '2026-11-05T11:00:00-03:00',
        state: 'running',
      },
      {
        key: 'resolution',
        label: 'Resolução',
        target: '2026-11-05T15:00:00-03:00',
        state: 'running',
      },
    ],
    events: [
      {
        title: 'Chamado aberto',
        at: '2026-11-05T07:00:00-03:00',
        author: 'Marina Alves · Cliente',
        description: 'Oscilações relatadas no quadro geral.',
      },
      {
        title: 'Atendimento atribuído',
        at: '2026-11-05T07:25:00-03:00',
        author: 'Camila Moreira · Gestora',
        description: 'Visita técnica atribuída a Rafael Costa.',
      },
    ],
    evidences: [],
  },
  {
    ...existing(1038),
    contractId: 'CT-2026-014',
    openedAt: '2026-11-04T08:00:00-03:00',
    description:
      'A bomba de circulação apresenta vibração acima do habitual e ruído durante a operação. Verificar fixação e alinhamento do conjunto.',
    resolution:
      'Realizados o alinhamento do conjunto e o reaperto das fixações. A bomba foi testada em operação e o funcionamento foi normalizado, sem a vibração relatada.',
    validationDueAt: '2026-11-06T15:20:00-03:00',
    deadlines: [
      {
        key: 'response',
        label: 'Resposta',
        target: '2026-11-04T09:00:00-03:00',
        completedAt: '2026-11-04T08:15:00-03:00',
        state: 'fulfilled',
      },
      {
        key: 'field',
        label: 'Atendimento em campo',
        target: '2026-11-04T12:00:00-03:00',
        completedAt: '2026-11-04T10:00:00-03:00',
        state: 'fulfilled',
      },
      {
        key: 'resolution',
        label: 'Resolução',
        target: '2026-11-04T16:00:00-03:00',
        completedAt: '2026-11-04T15:20:00-03:00',
        state: 'fulfilled',
      },
    ],
    events: [
      {
        title: 'Chamado aberto',
        at: '2026-11-04T08:00:00-03:00',
        author: 'Marina Alves · Cliente',
        description: 'Vibração e ruído relatados na bomba de circulação.',
      },
      {
        title: 'Atendimento atribuído',
        at: '2026-11-04T08:15:00-03:00',
        author: 'Camila Moreira · Gestora',
        description: 'Juliana Pires foi designada para o atendimento.',
      },
      {
        title: 'Atendimento em campo iniciado',
        at: '2026-11-04T10:00:00-03:00',
        author: 'Juliana Pires · Técnica',
        description: 'Inspeção do conjunto e ajuste de fixações.',
      },
      {
        title: 'Serviço concluído',
        at: '2026-11-04T15:20:00-03:00',
        author: 'Juliana Pires · Técnica',
        description: 'Testes concluídos. Atendimento disponível para revisão do cliente.',
      },
    ],
    evidences: [
      {
        title: 'Registro ilustrativo de manutenção',
        description: 'Imagem de apoio para demonstrar a consulta de evidências do atendimento.',
        image: '/images/manutencao-ilustrativa.png',
        alt: 'Cena ilustrativa de manutenção técnica, gerada por IA; não representa este atendimento.',
        at: '2026-11-04T15:10:00-03:00',
      },
    ],
  },
  {
    id: 1032,
    title: 'Substituição da iluminação do corredor',
    company: 'Edifício Aurora',
    location: 'Corredor · 2º andar',
    status: 'ENCERRADO',
    priority: 'Baixa',
    technician: 'Juliana Pires',
    contractId: 'CT-2026-014',
    openedAt: '2026-10-28T08:00:00-03:00',
    description: 'Duas luminárias do corredor do 2º andar deixaram de funcionar.',
    resolution: 'Luminárias substituídas e circuito testado. Resolução confirmada pelo cliente.',
    deadlines: [
      {
        key: 'response',
        label: 'Resposta',
        target: '2026-10-28T09:00:00-03:00',
        completedAt: '2026-10-28T08:20:00-03:00',
        state: 'fulfilled',
      },
      {
        key: 'field',
        label: 'Atendimento em campo',
        target: '2026-10-28T12:00:00-03:00',
        completedAt: '2026-10-28T10:00:00-03:00',
        state: 'fulfilled',
      },
      {
        key: 'resolution',
        label: 'Resolução',
        target: '2026-10-28T16:00:00-03:00',
        completedAt: '2026-10-28T11:30:00-03:00',
        state: 'fulfilled',
      },
    ],
    events: [
      {
        title: 'Chamado aberto',
        at: '2026-10-28T08:00:00-03:00',
        author: 'Marina Alves · Cliente',
        description: 'Solicitada a substituição das luminárias.',
      },
      {
        title: 'Serviço concluído',
        at: '2026-10-28T11:30:00-03:00',
        author: 'Juliana Pires · Técnica',
        description: 'Substituição e testes de iluminação concluídos.',
      },
      {
        title: 'Resolução confirmada',
        at: '2026-10-28T14:00:00-03:00',
        author: 'Marina Alves · Cliente',
        description: 'Atendimento revisado e encerrado neste cenário fictício.',
      },
    ],
    evidences: [],
  },
];

export function clientTicketById(id: string | null): ClientTicket | undefined {
  return CLIENT_TICKETS.find((ticket) => String(ticket.id) === id);
}
