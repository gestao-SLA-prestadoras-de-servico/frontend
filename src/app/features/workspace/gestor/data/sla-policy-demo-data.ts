import { CONTRACT_POLICIES, ContractPolicyOption } from './contract-demo-store';

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
  summary: string;
  matrix: SlaTimeMatrix;
}

export interface DemoSlaPolicy extends ContractPolicyOption {
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

const SLA_VERSIONS_BY_POLICY: Readonly<Record<string, readonly SlaPolicyVersion[]>> = {
  'policy-building': [
    {
      id: 'policy-building-v3',
      version: 3,
      createdAt: '2026-08-12',
      summary: 'Prazos ajustados para atendimento predial.',
      matrix: {
        alta: { response: 120, field: 540, resolution: 2160 },
        normal: { response: 360, field: 1080, resolution: 4320 },
      },
    },
    {
      id: 'policy-building-v2',
      version: 2,
      createdAt: '2026-04-20',
      summary: 'Ampliação da janela de campo e resolução.',
      matrix: {
        alta: { response: 180, field: 720, resolution: 2880 },
        normal: { response: 540, field: 1440, resolution: 5760 },
      },
    },
    {
      id: 'policy-building-v1',
      version: 1,
      createdAt: '2025-10-01',
      summary: 'Primeira versão ilustrativa.',
      matrix: {
        alta: { response: 240, field: 1080, resolution: 4320 },
        normal: { response: 720, field: 2160, resolution: 8640 },
      },
    },
  ],
  'policy-lifts': [
    {
      id: 'policy-lifts-v2',
      version: 2,
      createdAt: '2026-07-01',
      summary: 'Prazos ajustados para manutenção de elevadores.',
      matrix: {
        alta: { response: 60, field: 360, resolution: 1800 },
        normal: { response: 180, field: 720, resolution: 3600 },
      },
    },
    {
      id: 'policy-lifts-v1',
      version: 1,
      createdAt: '2025-12-12',
      summary: 'Primeira versão ilustrativa.',
      matrix: {
        alta: { response: 120, field: 540, resolution: 2160 },
        normal: { response: 360, field: 1080, resolution: 4320 },
      },
    },
  ],
  'policy-clinic': [
    {
      id: 'policy-clinic-v1',
      version: 1,
      createdAt: '2026-06-15',
      summary: 'Primeira versão ilustrativa para equipamentos clínicos.',
      matrix: {
        alta: { response: 30, field: 270, resolution: 1080 },
        normal: { response: 120, field: 540, resolution: 2160 },
      },
    },
  ],
  'policy-retail': [
    {
      id: 'policy-retail-v2',
      version: 2,
      createdAt: '2026-09-01',
      summary: 'Ordem dos prazos revisada para lojas.',
      matrix: {
        alta: { response: 90, field: 540, resolution: 1620 },
        normal: { response: 270, field: 540, resolution: 2160 },
      },
    },
    {
      id: 'policy-retail-v1',
      version: 1,
      createdAt: '2026-02-10',
      summary: 'Exemplo histórico com prazos fora de ordem.',
      matrix: {
        alta: { response: 120, field: 540, resolution: 2160 },
        normal: { response: 270, field: 180, resolution: 1080 },
      },
    },
  ],
};

export const SLA_POLICY_DEMOS: readonly DemoSlaPolicy[] = CONTRACT_POLICIES.map((policy) => ({
  ...policy,
  versions: SLA_VERSIONS_BY_POLICY[policy.id],
}));

const WINDOW_EXAMPLES: Readonly<Record<number, string>> = {
  30: '30 min de janela',
  60: '1 h de janela',
  90: '1 h 30 min de janela',
  120: '2 h de janela',
  180: '3 h de janela',
  240: '4 h de janela',
  270: '4 h 30 min de janela',
  360: '6 h de janela',
  540: '1 dia útil',
  720: '1 dia útil e 3 h',
  1080: '2 dias úteis',
  1440: '2 dias úteis e 6 h',
  1620: '3 dias úteis',
  1800: '3 dias úteis e 3 h',
  2160: '4 dias úteis',
  2880: '5 dias úteis e 3 h',
  3600: '6 dias úteis e 3 h',
  4320: '8 dias úteis',
  5760: '10 dias úteis e 4 h',
  8640: '16 dias úteis',
};

export function windowExample(minutes: number): string {
  return WINDOW_EXAMPLES[minutes] ?? 'equivalência não calculada nesta demonstração';
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

export function policyById(id: string): DemoSlaPolicy | undefined {
  return SLA_POLICY_DEMOS.find((policy) => policy.id === id);
}

export function firstSlaPolicy(): DemoSlaPolicy {
  const policy = SLA_POLICY_DEMOS[0];
  if (!policy) throw new Error('A demonstração precisa de ao menos uma política SLA.');
  return policy;
}

export function currentPolicyVersion(policy: DemoSlaPolicy): SlaPolicyVersion {
  return policy.versions[0];
}

export function previousPolicyVersion(
  policy: DemoSlaPolicy,
  currentVersionId: string,
): SlaPolicyVersion | undefined {
  return policy.versions.find((version) => version.id !== currentVersionId);
}
