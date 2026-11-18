import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type TipoNotificacao = 'ATRIBUICAO' | 'REMOCAO' | 'REABERTURA' | 'CONCLUSAO' | 'VIOLACAO';

/** `NotificacaoResponse` do ms-notificacoes; `lidaEm` nulo = não lida. */
export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  chamadoId: string;
  /** Já formatado, ex.: "#4". */
  numeroChamado: string;
  titulo: string;
  mensagem: string;
  criadoEm: string;
  lidaEm: string | null;
}

export interface PaginaNotificacoes {
  itens: Notificacao[];
  pagina: number;
  tamanho: number;
  totalElementos: number;
  totalPaginas: number;
  totalNaoLidas: number;
}

/** ms-notificacoes: só técnico e gestor; sempre as do próprio usuário (sub do token). */
@Injectable({ providedIn: 'root' })
export class NotificacoesApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.notificacoesUrl}/notificacoes`;

  listar(page = 0, size = 30) {
    return this.http.get<PaginaNotificacoes>(this.url, { params: { page, size } });
  }

  marcarLida(id: string) {
    return this.http.patch<void>(`${this.url}/${id}/lida`, null);
  }
}
