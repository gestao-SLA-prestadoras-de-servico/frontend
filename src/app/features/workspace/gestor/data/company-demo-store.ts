import { Injectable, signal } from '@angular/core';

export type CompanySituation = 'active' | 'inactive';
export interface CompanyFields {
  legalName: string;
  contactEmail: string;
  address: string;
}

export interface DemoCompany extends CompanyFields {
  id: number;
  situation: CompanySituation;
}

export interface CompanyNotice {
  tone: 'success' | 'error';
  title: string;
  detail: string;
}

const INITIAL_COMPANIES: readonly DemoCompany[] = [
  {
    id: 1,
    legalName: 'Edifício Aurora Administração Predial Ltda.',
    contactEmail: 'marina@aurora.example',
    address: 'Av. do Parque, 420 · Vila Mariana · São Paulo/SP',
    situation: 'active',
  },
  {
    id: 2,
    legalName: 'Clínica Horizonte Saúde Integrada Ltda.',
    contactEmail: 'contato@horizonte.example',
    address: 'Rua das Acácias, 85 · Centro · Campinas/SP',
    situation: 'active',
  },
  {
    id: 3,
    legalName: 'Mercado Estação Comércio de Alimentos Ltda.',
    contactEmail: 'operacao@estacao.example',
    address: 'Av. Central, 1700 · Jardim América · São Paulo/SP',
    situation: 'active',
  },
  {
    id: 4,
    legalName: 'Residencial Alameda Serviços Condominiais Ltda.',
    contactEmail: 'administracao@alameda.example',
    address: 'Rua Ipê Roxo, 31 · Cambuí · Campinas/SP',
    situation: 'inactive',
  },
];

@Injectable({ providedIn: 'root' })
export class CompanyDemoStore {
  readonly companies = signal<readonly DemoCompany[]>(INITIAL_COMPANIES);
  readonly notice = signal<CompanyNotice | null>(null);
  private nextId = INITIAL_COMPANIES.length + 1;

  add(fields: CompanyFields): DemoCompany {
    const company: DemoCompany = {
      id: this.nextId++,
      ...this.clean(fields),
      situation: 'active',
    };
    this.companies.update((companies) => [company, ...companies]);
    return company;
  }

  update(id: number, fields: CompanyFields): DemoCompany | null {
    const current = this.companies().find((company) => company.id === id);
    if (!current) return null;
    const updated = { ...current, ...this.clean(fields) };
    this.companies.update((companies) =>
      companies.map((company) => (company.id === id ? updated : company)),
    );
    return updated;
  }

  deactivate(id: number): DemoCompany | null {
    const current = this.companies().find((company) => company.id === id);
    if (!current || current.situation === 'inactive') return null;
    const updated = { ...current, situation: 'inactive' as const };
    this.companies.update((companies) =>
      companies.map((company) => (company.id === id ? updated : company)),
    );
    return updated;
  }

  setNotice(notice: CompanyNotice | null): void {
    this.notice.set(notice);
  }

  private clean(fields: CompanyFields): CompanyFields {
    return {
      legalName: fields.legalName.trim(),
      contactEmail: fields.contactEmail.trim(),
      address: fields.address.trim(),
    };
  }
}
