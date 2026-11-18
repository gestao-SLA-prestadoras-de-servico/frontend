import { Injectable, signal } from '@angular/core';
import { Cliente, Endereco } from '@app/core/api/modelos';

export type CompanySituation = 'active' | 'inactive';

export interface Company {
  id: string;
  legalName: string;
  contactEmail: string;
  /** Endereço em uma linha, para listas. */
  address: string;
  endereco: Endereco;
  situation: CompanySituation;
  version: number;
}

export interface CompanyNotice {
  tone: 'success' | 'error';
  title: string;
  detail: string;
}

export function formatAddress(e: Endereco): string {
  const cep = e.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  const numero = e.complemento ? `${e.numero}, ${e.complemento}` : e.numero;
  return `${e.logradouro}, ${numero} · ${e.bairro} · ${e.cidade}/${e.uf} · CEP ${cep}`;
}

export function toCompany(cliente: Cliente): Company {
  return {
    id: cliente.id,
    legalName: cliente.razaoSocial,
    contactEmail: cliente.emailContato,
    address: formatAddress(cliente.endereco),
    endereco: cliente.endereco,
    situation: cliente.ativo ? 'active' : 'inactive',
    version: cliente.version,
  };
}

/** Aviso que sobrevive à navegação entre o cadastro e a lista de empresas. */
@Injectable({ providedIn: 'root' })
export class CompanyStore {
  readonly notice = signal<CompanyNotice | null>(null);

  setNotice(notice: CompanyNotice | null): void {
    this.notice.set(notice);
  }
}
