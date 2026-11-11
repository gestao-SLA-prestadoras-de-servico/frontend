import { Injectable, signal } from '@angular/core';

export interface ContractPolicyOption {
  id: string;
  code: string;
  name: string;
}

export interface ContractDraft {
  companyId: number;
  startDate: string;
  endDate: string;
  policyId: string;
}

export interface DemoContract extends ContractDraft {
  id: string;
}

export type ContractTerm = 'current' | 'future' | 'expired';

export interface ContractNotice {
  title: string;
  detail: string;
}

export const CONTRACT_REFERENCE_DATE = '2026-11-05';

export const CONTRACT_POLICIES: readonly ContractPolicyOption[] = [
  { id: 'policy-building', code: 'POL-001', name: 'Manutenção predial' },
  { id: 'policy-lifts', code: 'POL-002', name: 'Manutenção de elevadores' },
  { id: 'policy-clinic', code: 'POL-003', name: 'Equipamentos clínicos' },
  { id: 'policy-retail', code: 'POL-004', name: 'Infraestrutura de loja' },
];

const INITIAL_CONTRACTS: readonly DemoContract[] = [
  {
    id: 'CT-2026-014',
    companyId: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    policyId: 'policy-building',
  },
  {
    id: 'CT-2026-009',
    companyId: 1,
    startDate: '2026-01-01',
    endDate: '2026-10-31',
    policyId: 'policy-lifts',
  },
  {
    id: 'CT-2026-020',
    companyId: 2,
    startDate: '2026-11-10',
    endDate: '2027-11-09',
    policyId: 'policy-clinic',
  },
  {
    id: 'CT-2026-018',
    companyId: 3,
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    policyId: 'policy-retail',
  },
];

export function contractTerm(contract: Pick<DemoContract, 'startDate' | 'endDate'>): ContractTerm {
  if (contract.startDate > CONTRACT_REFERENCE_DATE) return 'future';
  if (contract.endDate < CONTRACT_REFERENCE_DATE) return 'expired';
  return 'current';
}

export function policyById(id: string): ContractPolicyOption | undefined {
  return CONTRACT_POLICIES.find((policy) => policy.id === id);
}

@Injectable({ providedIn: 'root' })
export class ContractDemoStore {
  readonly contracts = signal<readonly DemoContract[]>(INITIAL_CONTRACTS);
  readonly notice = signal<ContractNotice | null>(null);
  private nextNumber = 21;

  add(draft: ContractDraft): DemoContract {
    const contract: DemoContract = {
      ...draft,
      id: 'CT-2026-' + String(this.nextNumber++).padStart(3, '0'),
    };
    this.contracts.update((contracts) => [contract, ...contracts]);
    return contract;
  }

  setNotice(notice: ContractNotice | null): void {
    this.notice.set(notice);
  }
}
