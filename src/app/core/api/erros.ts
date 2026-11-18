import { HttpErrorResponse } from '@angular/common/http';
import { Problema } from './modelos';

/** Mensagem por `codigo` (backend/src/.../shared/api/CodigoErro.java). */
const MENSAGENS: Record<string, string> = {
  VALIDACAO: 'Alguns campos estão inválidos. Revise e tente novamente.',
  NAO_AUTENTICADO: 'Sua sessão expirou. Entre novamente.',
  ACESSO_NEGADO: 'Você não tem permissão para esta ação.',
  RECURSO_NAO_ENCONTRADO: 'Não encontramos este registro.',
  CONFLITO_VERSAO:
    'Este registro foi alterado por outra pessoa. Recarregamos os dados; confira e tente de novo.',
  REQUISICAO_INVALIDA: 'Não foi possível processar a solicitação.',
  ERRO_INTERNO: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
  SERVICO_INDISPONIVEL: 'Um serviço necessário está indisponível. Tente novamente em instantes.',
  USUARIO_JA_EXISTE: 'Já existe um usuário com este e-mail.',
  CODIGO_CONTRATO_JA_EXISTE: 'Já existe um contrato com este código.',
  NOME_POLITICA_JA_EXISTE: 'Já existe uma política com este nome.',
  EVIDENCIA_EXPURGADA: 'Esta evidência foi expurgada; restam apenas os metadados.',
  ARQUIVO_MUITO_GRANDE: 'O arquivo passa de 10 MB.',
  TRANSICAO_INVALIDA: 'Esta ação não é permitida no estado atual do chamado.',
  POSICIONAMENTO_JA_REGISTRADO: 'O primeiro posicionamento já foi registrado.',
  CONTRATO_FORA_VIGENCIA: 'O contrato selecionado não está vigente.',
  CONTRATO_SEM_POLITICA: 'O contrato selecionado ainda não tem política de SLA.',
  POLITICA_INEXISTENTE: 'A política de SLA informada não existe.',
  ORDEM_PRAZOS_INVALIDA: 'Os prazos devem seguir a ordem: resposta < campo < resolução.',
  EVIDENCIA_OBRIGATORIA: 'Envie ao menos uma evidência antes de concluir.',
  DESCRICAO_TECNICA_OBRIGATORIA: 'Preencha a descrição técnica antes de concluir.',
  CANCELAMENTO_NAO_PERMITIDO: 'Este chamado não pode mais ser cancelado.',
  REATRIBUICAO_NAO_PERMITIDA: 'Este chamado não pode ser reatribuído agora.',
  REABERTURA_NAO_PERMITIDA: 'O prazo para reabrir este chamado terminou.',
  CLIENTE_OBRIGATORIO: 'Selecione a empresa do usuário cliente.',
  CLIENTE_INEXISTENTE: 'A empresa informada não existe.',
  CLIENTE_INATIVO: 'A empresa informada está inativa.',
  CLIENTE_NAO_PERMITIDO: 'Técnicos e gestores não pertencem a uma empresa cliente.',
  SUBSTITUTO_OBRIGATORIO: 'Escolha um técnico substituto para os chamados em aberto.',
  SUBSTITUTO_INVALIDO: 'O substituto precisa ser outro técnico ativo.',
  AUTOINATIVACAO_NAO_PERMITIDA: 'Você não pode inativar a própria conta.',
  ULTIMO_GESTOR_ATIVO: 'É preciso manter ao menos um gestor ativo.',
  FORMATO_NAO_SUPORTADO: 'Formato não suportado. Envie JPEG, PNG ou WebP.',
  IMAGEM_MUITO_GRANDE: 'A imagem tem dimensões grandes demais.',
  IMAGEM_INVALIDA: 'A imagem está corrompida.',
  REPROCESSAMENTO_NAO_PERMITIDO: 'Só evidências com falha podem ser reprocessadas.',
};

export function problema(erro: unknown): Problema | null {
  return erro instanceof HttpErrorResponse && erro.error && typeof erro.error === 'object'
    ? (erro.error as Problema)
    : null;
}

export function mensagemErro(erro: unknown): string {
  if (erro instanceof HttpErrorResponse && erro.status === 0)
    return 'Não foi possível falar com o servidor. Verifique sua conexão.';
  const codigo = problema(erro)?.codigo;
  return (codigo && MENSAGENS[codigo]) ?? MENSAGENS['ERRO_INTERNO'];
}

export function naoEncontrado(erro: unknown): boolean {
  return erro instanceof HttpErrorResponse && erro.status === 404;
}
