export type ProfileKey = 'gestor' | 'tecnico' | 'cliente';
export type PageKind = 'overview' | 'tickets' | 'preview';
export type WorkspaceIconKey =
  'home' | 'tickets' | 'reports' | 'contracts' | 'building' | 'users' | 'audit' | 'service' | 'add';

export interface WorkspacePageData {
  key: string;
  path: string;
  title: string;
  description: string;
  icon: WorkspaceIconKey;
  group: string;
  kind: PageKind;
  preview?: {
    title: string;
    description: string;
    facts: readonly { label: string; value: string }[];
  };
}

export interface WorkspaceProfile {
  key: ProfileKey;
  label: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  home: string;
  pages: readonly WorkspacePageData[];
}

/** A fixed, fictional scene. Dates and SLA labels are never calculated from the current time. */
export const DEMO_TICKETS = [
  {
    id: 1042,
    title: 'Falha no sistema de climatização',
    company: 'Edifício Aurora',
    location: 'Sala técnica · 4º andar',
    status: 'EM_ATENDIMENTO',
    statusLabel: 'Em atendimento',
    priority: 'Alta',
    technician: 'Rafael Costa',
    next: 'Resolução · 05/11 às 16h',
    tone: 'progress',
  },
  {
    id: 1043,
    title: 'Instabilidade no ponto de rede',
    company: 'Clínica Horizonte',
    location: 'Recepção · Térreo',
    status: 'ABERTO',
    statusLabel: 'Aberto',
    priority: 'Normal',
    technician: null,
    next: 'Resposta violada · Exemplo',
    tone: 'danger',
  },
  {
    id: 1041,
    title: 'Oscilação no quadro elétrico',
    company: 'Edifício Aurora',
    location: 'Quadro geral · Térreo',
    status: 'ATRIBUIDO',
    statusLabel: 'Atribuído',
    priority: 'Normal',
    technician: 'Rafael Costa',
    next: 'Campo · 05/11 às 11h',
    tone: 'assigned',
  },
  {
    id: 1038,
    title: 'Ajuste da bomba de circulação',
    company: 'Edifício Aurora',
    location: 'Casa de máquinas',
    status: 'RESOLVIDO',
    statusLabel: 'Resolvido',
    priority: 'Normal',
    technician: 'Juliana Pires',
    next: 'Aguardando validação do cliente',
    tone: 'resolved',
  },
] as const;
export type DemoTicket = (typeof DEMO_TICKETS)[number];

export const WORKSPACE_PROFILES: readonly WorkspaceProfile[] = [
  {
    key: 'gestor',
    label: 'Gestor',
    name: 'Camila Moreira',
    initials: 'CM',
    email: 'camila@nivelo.example',
    role: 'Gestora de operações',
    home: '/app/gestor',
    pages: [
      {
        key: 'painel',
        path: '/app/gestor',
        title: 'Painel de operações',
        description: 'Acompanhe a fila e organize os próximos atendimentos.',
        icon: 'home',
        group: 'Operação',
        kind: 'overview',
      },
      {
        key: 'chamados',
        path: '/app/gestor/chamados',
        title: 'Fila de chamados',
        description: 'Um exemplo da organização dos chamados da prestadora.',
        icon: 'tickets',
        group: 'Operação',
        kind: 'tickets',
      },
      {
        key: 'relatorios',
        path: '/app/gestor/relatorios',
        title: 'Relatórios',
        description: 'Os três compromissos de prazo organizados para consulta.',
        icon: 'reports',
        group: 'Operação',
        kind: 'preview',
        preview: {
          title: 'Leitura por compromisso',
          description:
            'Esta prévia apresenta os compromissos e os recortes de consulta. Apuração e exportação não estão disponíveis na demonstração.',
          facts: [
            { label: 'Relógios previstos', value: 'Resposta, atendimento em campo e resolução' },
            { label: 'Recortes previstos', value: 'Período, cliente e técnico' },
            {
              label: 'Conteúdo de referência',
              value: 'Cumprimento de prazos dos chamados encerrados',
            },
          ],
        },
      },
      {
        key: 'contratos',
        path: '/app/gestor/contratos',
        title: 'Contratos e SLA',
        description: 'O contexto contratual que orienta os três compromissos de prazo.',
        icon: 'contracts',
        group: 'Gestão',
        kind: 'preview',
        preview: {
          title: 'Contrato de manutenção predial',
          description:
            'Exemplo de apresentação de um contrato. Cadastro e edição de políticas não estão disponíveis na demonstração.',
          facts: [
            { label: 'Cliente fictício', value: 'Edifício Aurora' },
            { label: 'Identificação de exemplo', value: 'CT-2026-014' },
            { label: 'Política prevista', value: 'Uma política vigente, com histórico de versões' },
          ],
        },
      },
      {
        key: 'empresas',
        path: '/app/gestor/empresas',
        title: 'Empresas',
        description: 'Cadastro de clientes empresariais e dados de contato.',
        icon: 'building',
        group: 'Gestão',
        kind: 'preview',
      },
      {
        key: 'usuarios',
        path: '/app/gestor/usuarios',
        title: 'Usuários',
        description: 'As pessoas e os perfis que participam do atendimento.',
        icon: 'users',
        group: 'Gestão',
        kind: 'preview',
        preview: {
          title: 'Equipe e contato de exemplo',
          description:
            'Perfis apresentados apenas para demonstrar a organização desta área. Nenhuma conta é criada ou alterada.',
          facts: [
            { label: 'Gestora', value: 'Camila Moreira' },
            { label: 'Técnicos', value: 'Rafael Costa e Juliana Pires' },
            { label: 'Contato do Edifício Aurora', value: 'Marina Alves' },
          ],
        },
      },
      {
        key: 'auditoria',
        path: '/app/gestor/auditoria',
        title: 'Auditoria',
        description: 'Espaço de rastreabilidade das ações e dos responsáveis.',
        icon: 'audit',
        group: 'Rastreabilidade',
        kind: 'preview',
        preview: {
          title: 'Registro ilustrativo de atribuição',
          description:
            'Exemplo de consulta de uma atribuição, com responsável e data. Este registro é apenas demonstrativo e não pode ser alterado.',
          facts: [
            { label: 'Chamado', value: '#1041 · Oscilação no quadro elétrico' },
            { label: 'Responsável pela atribuição', value: 'Camila Moreira' },
            { label: 'Registro de exemplo', value: '04/11/2026 às 10h15 · Técnico Rafael Costa' },
          ],
        },
      },
    ],
  },
  {
    key: 'tecnico',
    label: 'Técnico',
    name: 'Rafael Costa',
    initials: 'RC',
    email: 'rafael@nivelo.example',
    role: 'Técnico de campo',
    home: '/app/tecnico',
    pages: [
      {
        key: 'chamados',
        path: '/app/tecnico',
        title: 'Meus chamados',
        description: 'Os atendimentos atribuídos a você neste cenário de demonstração.',
        icon: 'tickets',
        group: 'Atendimento',
        kind: 'tickets',
      },
      {
        key: 'atendimento',
        path: '/app/tecnico/atendimento',
        title: 'Atendimento atual',
        description: 'O local, o serviço e os registros do trabalho em campo.',
        icon: 'service',
        group: 'Atendimento',
        kind: 'preview',
        preview: {
          title: '#1042 · Falha no sistema de climatização',
          description:
            'Esta prévia apresenta o contexto do serviço. Registro de descrição técnica e envio de evidências não estão disponíveis na demonstração.',
          facts: [
            { label: 'Empresa e local', value: 'Edifício Aurora · Sala técnica, 4º andar' },
            { label: 'Situação ilustrativa', value: 'Em atendimento · Prioridade alta' },
            { label: 'Registro previsto', value: 'Descrição técnica e evidências fotográficas' },
          ],
        },
      },
    ],
  },
  {
    key: 'cliente',
    label: 'Cliente',
    name: 'Marina Alves',
    initials: 'MA',
    email: 'marina@aurora.example',
    role: 'Contato do Edifício Aurora',
    home: '/app/cliente',
    pages: [
      {
        key: 'chamados',
        path: '/app/cliente',
        title: 'Meus chamados',
        description: 'Acompanhe os atendimentos do Edifício Aurora neste exemplo.',
        icon: 'tickets',
        group: 'Seus atendimentos',
        kind: 'tickets',
      },
      {
        key: 'novo-chamado',
        path: '/app/cliente/novo-chamado',
        title: 'Abrir chamado',
        description: 'Descreva o problema e consulte os prazos do contrato de exemplo.',
        icon: 'add',
        group: 'Seus atendimentos',
        kind: 'preview',
      },
    ],
  },
];

export function profileByKey(key: unknown): WorkspaceProfile {
  return WORKSPACE_PROFILES.find((profile) => profile.key === key) ?? WORKSPACE_PROFILES[0];
}

export function ticketsFor(profile: ProfileKey): readonly DemoTicket[] {
  if (profile === 'tecnico')
    return DEMO_TICKETS.filter((ticket) => ticket.technician === 'Rafael Costa');
  if (profile === 'cliente')
    return DEMO_TICKETS.filter((ticket) => ticket.company === 'Edifício Aurora');
  return DEMO_TICKETS;
}
