import { Injectable, signal } from '@angular/core';
import { Papel, UsuarioResumo } from '@app/core/api/modelos';

export type ManagerUserRole = 'Cliente' | 'Técnico' | 'Gestor';
export type ManagerUserSituation = 'Ativo' | 'Inativo';

export interface ManagerUser {
  id: string;
  sub: string;
  name: string;
  email: string;
  role: ManagerUserRole;
  situation: ManagerUserSituation;
  company?: string;
  /** Só para técnicos ativos: chamados ainda não finalizados. */
  openTickets?: number;
}

export interface ManagerUserNotice {
  tone: 'success' | 'error';
  title: string;
  detail: string;
}

export const ROLE_LABEL: Record<Papel, ManagerUserRole> = {
  CLIENTE: 'Cliente',
  TECNICO: 'Técnico',
  GESTOR: 'Gestor',
};

export const ROLE_PAPEL: Record<ManagerUserRole, Papel> = {
  Cliente: 'CLIENTE',
  Técnico: 'TECNICO',
  Gestor: 'GESTOR',
};

export function toManagerUser(
  usuario: UsuarioResumo,
  companies: ReadonlyMap<string, string>,
  openTickets: ReadonlyMap<string, number>,
): ManagerUser {
  return {
    id: usuario.id,
    sub: usuario.sub,
    name: usuario.nome,
    email: usuario.email,
    role: ROLE_LABEL[usuario.perfil],
    situation: usuario.ativo ? 'Ativo' : 'Inativo',
    company: usuario.clienteId
      ? (companies.get(usuario.clienteId) ?? 'Empresa removida')
      : undefined,
    openTickets: openTickets.get(usuario.id),
  };
}

/** Aviso que sobrevive à navegação entre o cadastro e a lista de usuários. */
@Injectable({ providedIn: 'root' })
export class UserStore {
  readonly notice = signal<ManagerUserNotice | null>(null);

  setNotice(notice: ManagerUserNotice | null): void {
    this.notice.set(notice);
  }
}
