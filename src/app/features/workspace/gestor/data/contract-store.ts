import { Injectable, signal } from '@angular/core';
import { Contrato } from '@app/core/api/modelos';

export interface Contract {
  id: string;
  code: string;
  companyId: string;
  /** YYYY-MM-DD. */
  startDate: string;
  endDate: string;
  policyId: string | null;
}

export type ContractTerm = 'current' | 'future' | 'expired';

export interface ContractNotice {
  title: string;
  detail: string;
  tone?: 'success' | 'error';
}

/** Hoje no fuso de Brasília, como YYYY-MM-DD (o mesmo formato de LocalDate do backend). */
export function todayIso(now = new Date()): string {
  return now.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
}

export function contractTerm(
  contract: Pick<Contract, 'startDate' | 'endDate'>,
  today = todayIso(),
): ContractTerm {
  if (contract.startDate > today) return 'future';
  if (contract.endDate < today) return 'expired';
  return 'current';
}

export function toContract(contrato: Contrato): Contract {
  return {
    id: contrato.id,
    code: contrato.codigo,
    companyId: contrato.clienteId,
    startDate: contrato.inicioVigencia,
    endDate: contrato.fimVigencia,
    policyId: contrato.politicaId,
  };
}

/** Aviso que sobrevive à navegação entre o cadastro e a lista de contratos. */
@Injectable({ providedIn: 'root' })
export class ContractStore {
  readonly notice = signal<ContractNotice | null>(null);

  setNotice(notice: ContractNotice | null): void {
    this.notice.set(notice);
  }
}
