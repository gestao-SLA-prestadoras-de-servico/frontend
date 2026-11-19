import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TAMANHO_MAXIMO, todasAsPaginas } from './paginacao';
import {
  ApuracaoSla,
  ChamadoCliente,
  ChamadoGestor,
  ChamadoTecnico,
  ContagemChamados,
  Contrato,
  EstadoEvidencia,
  EventoView,
  EvidenciasDoAtendimento,
  NovoChamado,
  Pagina,
  Prioridade,
} from './modelos';

/** O formato do chamado depende do papel de quem chama; o tipo é escolhido por quem usa. */
type Chamado = ChamadoCliente | ChamadoGestor | ChamadoTecnico;

@Injectable({ providedIn: 'root' })
export class ChamadosApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/chamados`;

  /** Uma página; use `listarTodos` quando a tela precisa da lista inteira. */
  listar<T extends Chamado>(filtros: Record<string, string | number | boolean> = {}) {
    return this.http.get<Pagina<T>>(this.url, { params: new HttpParams({ fromObject: filtros }) });
  }

  listarTodos<T extends Chamado>(filtros: Record<string, string | number | boolean> = {}) {
    return todasAsPaginas((page) => this.listar<T>({ ...filtros, page, size: TAMANHO_MAXIMO }));
  }

  contagem() {
    return this.http.get<ContagemChamados>(`${this.url}/contagem`);
  }

  detalhe<T extends Chamado>(id: string) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  /** Apuração final de SLA; `apurado` é false até o chamado ser encerrado. */
  sla(id: string) {
    return this.http.get<ApuracaoSla>(`${this.url}/${id}/sla`);
  }

  historico(id: string) {
    return this.http.get<EventoView[]>(`${this.url}/${id}/historico`);
  }

  evidencias(id: string) {
    return this.http.get<EvidenciasDoAtendimento[]>(`${this.url}/${id}/evidencias`);
  }

  abrir(dados: NovoChamado) {
    return this.http.post<ChamadoCliente>(this.url, dados);
  }

  validar(id: string, version: number) {
    return this.http.post<ChamadoCliente>(`${this.url}/${id}/validacao`, { version });
  }

  reabrir(id: string, justificativa: string, version: number) {
    return this.http.post<ChamadoCliente>(`${this.url}/${id}/reabertura`, {
      justificativa,
      version,
    });
  }

  iniciarAtendimento(id: string) {
    return this.http.post<ChamadoTecnico>(`${this.url}/${id}/atendimento/inicio`, null);
  }

  salvarDescricao(id: string, descricao: string) {
    return this.http.put<ChamadoTecnico>(`${this.url}/${id}/atendimento/descricao`, { descricao });
  }

  concluirAtendimento(id: string) {
    return this.http.post<ChamadoTecnico>(`${this.url}/${id}/atendimento/conclusao`, null);
  }

  /** Multipart com o campo `arquivo`; o navegador define o Content-Type com o boundary. 202. */
  enviarEvidencia(id: string, arquivo: File) {
    const corpo = new FormData();
    corpo.append('arquivo', arquivo);
    return this.http.post<{ id: string; estado: EstadoEvidencia }>(
      `${this.url}/${id}/evidencias`,
      corpo,
    );
  }

  // Ações do gestor.
  definirPrioridade(id: string, prioridade: Prioridade) {
    return this.http.put<ChamadoGestor>(`${this.url}/${id}/prioridade`, { prioridade });
  }

  posicionar(id: string, texto: string) {
    return this.http.post<ChamadoGestor>(`${this.url}/${id}/posicionamento`, { texto });
  }

  /** `tecnicoSub` é o `sub` do técnico (TecnicoResponse.sub), não o id. */
  atribuir(id: string, tecnicoSub: string, version: number) {
    return this.http.post<ChamadoGestor>(`${this.url}/${id}/atribuicao`, { tecnicoSub, version });
  }

  /** Aviso de conclusão só para o gestor logado: ligar (PUT) ou desligar (DELETE). */
  preferenciaNotificacao(id: string, ligar: boolean) {
    const url = `${this.url}/${id}/preferencia-notificacao`;
    return ligar ? this.http.put<void>(url, null) : this.http.delete<void>(url);
  }

  cancelar(id: string, motivo: string) {
    return this.http.post<ChamadoGestor>(`${this.url}/${id}/cancelamento`, { motivo });
  }

  /** Só evidência em FALHA; volta para RECEBIDA (202). */
  reprocessarEvidencia(evidenciaId: string) {
    return this.http.post<{ id: string; estado: EstadoEvidencia }>(
      `${environment.apiUrl}/evidencias/${evidenciaId}/reprocessamento`,
      null,
    );
  }

  /** Contratos vigentes da empresa do cliente logado. */
  meusContratos() {
    return todasAsPaginas((page) =>
      this.http.get<Pagina<Contrato>>(`${environment.apiUrl}/me/contratos`, {
        params: { page, size: TAMANHO_MAXIMO },
      }),
    );
  }

  /** Imagem da evidência; precisa do Bearer, por isso não dá para usar `<img src>` direto. */
  conteudoEvidencia(id: string, variante: 'visualizacao' | 'miniatura' | 'original') {
    return this.http.get(`${environment.apiUrl}/evidencias/${id}/conteudo`, {
      params: { variante },
      responseType: 'blob',
    });
  }
}
