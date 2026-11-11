import { Injectable, signal } from '@angular/core';

export type ManagerUserRole = 'Cliente' | 'Técnico' | 'Gestor';
export type ManagerUserSituation = 'Ativo' | 'Inativo';

export interface ManagerUser {
  id: string;
  name: string;
  email: string;
  role: ManagerUserRole;
  situation: ManagerUserSituation;
  company?: string;
  assigned: number;
  inProgress: number;
  resolved: number;
  workloadLimit: number;
}

export interface ManagerUserNotice {
  tone: 'success' | 'error';
  title: string;
  detail: string;
}

const INITIAL_USERS: readonly ManagerUser[] = [
  {
    id: 'user-camila',
    name: 'Camila Moreira',
    email: 'camila@nivelo.example',
    role: 'Gestor',
    situation: 'Ativo',
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    workloadLimit: 4,
  },
  {
    id: 'user-rafael',
    name: 'Rafael Costa',
    email: 'rafael@nivelo.example',
    role: 'Técnico',
    situation: 'Ativo',
    assigned: 1,
    inProgress: 1,
    resolved: 0,
    workloadLimit: 4,
  },
  {
    id: 'user-juliana',
    name: 'Juliana Pires',
    email: 'juliana@nivelo.example',
    role: 'Técnico',
    situation: 'Ativo',
    assigned: 0,
    inProgress: 1,
    resolved: 1,
    workloadLimit: 4,
  },
  {
    id: 'user-bruno',
    name: 'Bruno Prado',
    email: 'bruno@nivelo.example',
    role: 'Técnico',
    situation: 'Ativo',
    assigned: 3,
    inProgress: 1,
    resolved: 0,
    workloadLimit: 4,
  },
  {
    id: 'user-marina',
    name: 'Marina Alves',
    email: 'marina@aurora.example',
    role: 'Cliente',
    situation: 'Ativo',
    company: 'Edifício Aurora',
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    workloadLimit: 4,
  },
  {
    id: 'user-felipe',
    name: 'Felipe Nascimento',
    email: 'felipe@horizonte.example',
    role: 'Cliente',
    situation: 'Ativo',
    company: 'Clínica Horizonte',
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    workloadLimit: 4,
  },
  {
    id: 'user-bianca',
    name: 'Bianca Lopes',
    email: 'bianca@nivelo.example',
    role: 'Técnico',
    situation: 'Inativo',
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    workloadLimit: 4,
  },
];

@Injectable({ providedIn: 'root' })
export class UserDemoStore {
  readonly users = signal<readonly ManagerUser[]>(INITIAL_USERS);
  readonly notice = signal<ManagerUserNotice | null>(null);
  private nextId = INITIAL_USERS.length + 1;

  add(fields: Pick<ManagerUser, 'name' | 'email' | 'role' | 'company'>): ManagerUser | null {
    if (
      this.users().some((user) => user.email.toLocaleLowerCase() === fields.email.toLowerCase())
    ) {
      return null;
    }
    const user: ManagerUser = {
      ...fields,
      id: `user-demo-${this.nextId++}`,
      situation: 'Ativo',
      assigned: 0,
      inProgress: 0,
      resolved: 0,
      workloadLimit: 4,
    };
    this.users.update((users) => [user, ...users]);
    return user;
  }

  deactivate(id: string, substituteId: string): boolean {
    const target = this.users().find((user) => user.id === id);
    const substitute = this.users().find((user) => user.id === substituteId);
    if (!target || target.role !== 'Técnico' || target.situation !== 'Ativo' || !substitute) {
      return false;
    }
    const substituteLoad = substitute.assigned + substitute.inProgress;
    const incomingLoad = target.assigned + target.inProgress;
    if (
      substitute.role !== 'Técnico' ||
      substitute.situation !== 'Ativo' ||
      substituteLoad + incomingLoad > substitute.workloadLimit
    ) {
      return false;
    }
    this.users.update((users) =>
      users.map((user) => {
        if (user.id === target.id) return { ...user, situation: 'Inativo' };
        if (user.id === substitute.id) {
          return {
            ...user,
            assigned: user.assigned + target.assigned,
            inProgress: user.inProgress + target.inProgress,
            resolved: user.resolved + target.resolved,
          };
        }
        return user;
      }),
    );
    return true;
  }

  transferOpenAssignment(
    previousTechnician: string | null,
    nextTechnician: string,
    kind: 'assigned' | 'inProgress',
  ): void {
    this.users.update((users) =>
      users.map((user) => {
        if (user.role !== 'Técnico') return user;
        if (user.name === previousTechnician) {
          return kind === 'assigned'
            ? { ...user, assigned: Math.max(0, user.assigned - 1) }
            : { ...user, inProgress: Math.max(0, user.inProgress - 1) };
        }
        if (user.name === nextTechnician) {
          return kind === 'assigned'
            ? { ...user, assigned: user.assigned + 1 }
            : { ...user, inProgress: user.inProgress + 1 };
        }
        return user;
      }),
    );
  }

  setNotice(notice: ManagerUserNotice | null): void {
    this.notice.set(notice);
  }
}
