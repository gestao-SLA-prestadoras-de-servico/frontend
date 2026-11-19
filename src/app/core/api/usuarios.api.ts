import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NovoUsuario, Pagina, Tecnico, UsuarioCadastrado, UsuarioResumo } from './modelos';
import { TAMANHO_MAXIMO, todasAsPaginas } from './paginacao';

/** Usuários e técnicos. Tudo exige GESTOR (o `/me` fica no AuthService). */
@Injectable({ providedIn: 'root' })
export class UsuariosApi {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  /** Todos os usuários (todas as páginas); a tela filtra no navegador. */
  listar(filtros: Record<string, string | boolean> = {}) {
    return todasAsPaginas((page) =>
      this.http.get<Pagina<UsuarioResumo>>(`${this.url}/usuarios`, {
        params: new HttpParams({ fromObject: { ...filtros, page, size: TAMANHO_MAXIMO } }),
      }),
    );
  }

  criar(dados: NovoUsuario) {
    return this.http.post<UsuarioCadastrado>(`${this.url}/usuarios`, dados);
  }

  /** `substitutoId` é o `id` do usuário técnico substituto (não o `sub`). */
  inativar(id: string, substitutoId?: string) {
    return this.http.post<void>(
      `${this.url}/usuarios/${id}/inativacao`,
      substitutoId ? { substitutoId } : {},
    );
  }

  chamadosATransferir(id: string) {
    return this.http.get<Record<'ATRIBUIDO' | 'EM_ATENDIMENTO' | 'RESOLVIDO', number>>(
      `${this.url}/usuarios/${id}/chamados-a-transferir`,
    );
  }

  tecnicos(ativos = true) {
    return todasAsPaginas((page) =>
      this.http.get<Pagina<Tecnico>>(`${this.url}/tecnicos`, {
        params: { ativos, page, size: TAMANHO_MAXIMO },
      }),
    );
  }
}
