import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TAMANHO_MAXIMO, todasAsPaginas } from './paginacao';
import {
  Cliente,
  Contrato,
  DadosCliente,
  DadosContrato,
  Pagina,
  Politica,
  Prioridade,
  PrazosPorPrioridade,
  VersaoPolitica,
} from './modelos';

type Filtros = Record<string, string | number | boolean>;

const params = (filtros: Filtros, page: number) =>
  new HttpParams({ fromObject: { ...filtros, page, size: TAMANHO_MAXIMO } });

/** Clientes (empresas), contratos e políticas de SLA. Tudo exige GESTOR. */
@Injectable({ providedIn: 'root' })
export class CadastroApi {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  /** Todas as empresas (todas as páginas); as telas filtram no navegador. */
  clientes(filtros: Filtros = {}) {
    return todasAsPaginas((page) =>
      this.http.get<Pagina<Cliente>>(`${this.url}/clientes`, { params: params(filtros, page) }),
    );
  }

  criarCliente(dados: DadosCliente) {
    return this.http.post<Cliente>(`${this.url}/clientes`, dados);
  }

  editarCliente(id: string, version: number, dados: DadosCliente) {
    return this.http.put<Cliente>(`${this.url}/clientes/${id}`, { version, ...dados });
  }

  inativarCliente(id: string) {
    return this.http.post<void>(`${this.url}/clientes/${id}/inativacao`, null);
  }

  contratos(filtros: Filtros = {}) {
    return todasAsPaginas((page) =>
      this.http.get<Pagina<Contrato>>(`${this.url}/contratos`, { params: params(filtros, page) }),
    );
  }

  criarContrato(dados: DadosContrato) {
    return this.http.post<Contrato>(`${this.url}/contratos`, dados);
  }

  vincularPolitica(contratoId: string, politicaId: string) {
    return this.http.put<Contrato>(`${this.url}/contratos/${contratoId}/politica`, { politicaId });
  }

  politicas() {
    return todasAsPaginas((page) =>
      this.http.get<Pagina<Politica>>(`${this.url}/politicas`, { params: params({}, page) }),
    );
  }

  criarPolitica(nome: string, prioridadePadrao: Prioridade, prazos: PrazosPorPrioridade) {
    return this.http.post<Politica>(`${this.url}/politicas`, { nome, prioridadePadrao, prazos });
  }

  versoes(politicaId: string) {
    return todasAsPaginas((page) =>
      this.http.get<Pagina<VersaoPolitica>>(`${this.url}/politicas/${politicaId}/versoes`, {
        params: params({}, page),
      }),
    );
  }

  novaVersao(politicaId: string, prioridadePadrao: Prioridade, prazos: PrazosPorPrioridade) {
    return this.http.post<VersaoPolitica>(`${this.url}/politicas/${politicaId}/versoes`, {
      prioridadePadrao,
      prazos,
    });
  }
}
