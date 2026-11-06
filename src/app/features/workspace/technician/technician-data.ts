import { DemoTicket, ticketsFor } from '../data/workspace-data';

export type TechnicianStatus = 'ATRIBUIDO' | 'EM_ATENDIMENTO' | 'RESOLVIDO';
export type TechnicianPriority = 'Crítica' | 'Alta' | 'Normal' | 'Baixa';
export type EvidenceState =
  'RECEBIDA' | 'PROCESSANDO' | 'DISPONÍVEL' | 'FALHA' | 'INDISPONÍVEL' | 'EXPURGADA';

export interface TechnicianEvidence {
  id: string;
  name: string;
  sizeBytes: number;
  state: EvidenceState;
  source: 'fixture' | 'local';
  alt: string;
  previewUrl?: string;
  recordedAt?: string;
}

export interface TechnicianEvent {
  label: string;
  at: string;
  state: 'done' | 'current' | 'upcoming';
}

export interface TechnicianDeadline {
  label: string;
  value: string;
  state: 'on-time' | 'urgent' | 'overdue';
  dueAt?: string;
}

export type TechnicianTicket = Omit<DemoTicket, 'status' | 'statusLabel' | 'priority'> & {
  status: TechnicianStatus;
  priority: TechnicianPriority;
  technicalDescription: string;
  deadline: TechnicianDeadline;
  alertLabel?: string;
  events: readonly TechnicianEvent[];
  evidences: readonly TechnicianEvidence[];
};

const exampleEvidence: readonly TechnicianEvidence[] = [
  {
    id: '1042-evidence-0412',
    name: 'IMG_0412.jpg',
    sizeBytes: 3_200_000,
    state: 'DISPONÍVEL',
    source: 'fixture',
    alt: 'Equipamento de climatização em imagem ilustrativa',
    previewUrl: '/images/evidencias-ilustrativas.webp',
    recordedAt: '05/11/2026, 09:12',
  },
  {
    id: '1042-evidence-0413',
    name: 'IMG_0413.jpg',
    sizeBytes: 2_800_000,
    state: 'PROCESSANDO',
    source: 'fixture',
    alt: 'Prévia indisponível enquanto a evidência de exemplo é processada',
    recordedAt: '05/11/2026, 09:18',
  },
  {
    id: '1042-evidence-0414',
    name: 'IMG_0414.png',
    sizeBytes: 1_100_000,
    state: 'RECEBIDA',
    source: 'fixture',
    alt: 'Prévia da evidência recebida de exemplo ainda indisponível',
    recordedAt: '05/11/2026, 09:21',
  },
  {
    id: '1042-evidence-0415',
    name: 'IMG_0415.webp',
    sizeBytes: 900_000,
    state: 'FALHA',
    source: 'fixture',
    alt: 'Evidência de exemplo com falha e sem prévia disponível',
    recordedAt: '05/11/2026, 09:26',
  },
];

const currentTechnicianTickets = ticketsFor('tecnico').filter(
  (ticket): ticket is DemoTicket & { technician: string; status: TechnicianStatus } =>
    ticket.technician === 'Rafael Costa' &&
    (ticket.status === 'ATRIBUIDO' || ticket.status === 'EM_ATENDIMENTO'),
);

export const TECHNICIAN_TICKETS: readonly TechnicianTicket[] = currentTechnicianTickets.map(
  (ticket) => ({
    ...ticket,
    priority: ticket.priority,
    technicalDescription:
      ticket.id === 1042
        ? 'Compressor sem partida por falha no contator. Contator substituído; tensão e corrente conferidas nas três fases. Compressor em operação.'
        : '',
    deadline:
      ticket.id === 1042
        ? {
            label: 'Resolução',
            value: 'Vence hoje, 16h',
            state: 'urgent',
            dueAt: '2026-11-05T16:00:00-03:00',
          }
        : {
            label: 'Atendimento em campo',
            value: 'Até 05/11, 11h',
            state: 'on-time',
            dueAt: '2026-11-05T11:00:00-03:00',
          },
    alertLabel:
      ticket.id === 1041 ? 'Prazo de resposta vencido · exemplo demonstrativo' : undefined,
    events:
      ticket.id === 1042
        ? [
            { label: 'Chamado atribuído a Rafael Costa', at: '05/11/2026, 08:42', state: 'done' },
            { label: 'Atendimento iniciado', at: '05/11/2026, 09:05', state: 'done' },
            { label: 'Registro técnico e evidências', at: 'Em andamento', state: 'current' },
            { label: 'Revisão e conclusão', at: 'Próxima etapa', state: 'upcoming' },
          ]
        : [
            { label: 'Chamado atribuído a Rafael Costa', at: '05/11/2026, 09:31', state: 'done' },
            { label: 'Início do atendimento', at: 'Aguardando ação', state: 'current' },
            { label: 'Registro técnico e evidências', at: 'Próxima etapa', state: 'upcoming' },
            { label: 'Revisão e conclusão', at: 'Próxima etapa', state: 'upcoming' },
          ],
    evidences: ticket.id === 1042 ? exampleEvidence : [],
  }),
);

const validEvidenceStates: readonly EvidenceState[] = ['RECEBIDA', 'PROCESSANDO', 'DISPONÍVEL'];

export function evidenceCountsForCompletion(evidence: TechnicianEvidence): boolean {
  return validEvidenceStates.includes(evidence.state);
}

export function technicianTicketById(id: number): TechnicianTicket | undefined {
  return TECHNICIAN_TICKETS.find((ticket) => ticket.id === id);
}

export const ALLOWED_EVIDENCE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_EVIDENCE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;
export const MAX_EVIDENCE_SIZE_BYTES = 10 * 1024 * 1024;
