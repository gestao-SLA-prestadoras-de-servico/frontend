# Gestor — trilha de auditoria

Atualização de 09/11/2026, FE-032–033. A rota `/app/gestor/auditoria` oferece uma consulta demonstrativa de ações e responsáveis, com carregamento simulado e acesso aos metadados de evidência expurgada. A extensão segue o sistema `framed-sheet` e os componentes do Gestor, usando a imagem fornecida pelo usuário como referência para a tabela de quatro campos e sua relação com o registro selecionado.

## Escopo e dados

As colunas são **Data e hora**, **Usuário**, **Operação** e **Entidade**. O painel de detalhes apresenta ator e papel, entidade, data, resumo e identificador demonstrativo; chamado, transição, justificativa e efeitos aparecem quando existem no registro.

O snapshot independente dos stores reúne **12 eventos fictícios**, **5 atores** e **3 tipos de entidade**: chamados, evidências e usuários. A data final é fixa em **05/11/2026**, sem usar o relógio atual.

| Período | Intervalo inclusivo | Eventos sem outros filtros |
| --- | --- | --- |
| Últimos 30 dias, padrão | 07/10 a 05/11/2026 | 11 |
| Últimos 7 dias | 30/10 a 05/11/2026 | 9 |
| Todo o histórico | Até 05/11/2026 | 12 |

O registro de atribuição do chamado **#1041**, feito por **Camila em 04/11/2026 às 10h15 para Rafael**, foi preservado. Reabertura é uma operação; a transição **Resolvido → Atribuído** reutiliza os estados existentes, sem criar um novo estado de chamado.

## Consulta e navegação

- Os filtros nativos de usuário, entidade e período se combinam. A função retorna uma lista em ordem decrescente de data, sem modificar a fonte.
- Cada página mostra até **6 registros**. Alterar filtros retorna à primeira página; filtros e paginação redefinem a seleção para o primeiro resultado disponível. O estado inicial destaca o exemplo de reabertura.
- Selecionar a entidade atualiza os detalhes. Sem resultados, `ManagerEmptyState` oferece uma única ação **Limpar filtros**, que restaura os valores padrão e o foco no filtro de usuário.
- **Anterior** e **Próxima** são botões nativos com limites desabilitados; a mudança de página mantém foco em um controle habilitado.
- O disclosure **Estados da demonstração** contém **Visualizar cenário da auditoria**. **Carregamento simulado** mostra `WorkspaceLoadingState` e remove linhas, contagem, paginação e detalhes anteriores. **Registros de exemplo** restaura a lista com os filtros selecionados, sem consulta, espera ou timer reais.

A tabela e o painel de 320 px ficam lado a lado a partir de 1280 px. Abaixo disso, os detalhes seguem a lista no fluxo; selecionar um registro leva o foco ao título dos detalhes e **Voltar à trilha** devolve ao acionador visível. Abaixo de 768 px, fichas substituem a tabela. A seleção usa `aria-current`, `aria-controls` e anúncio `polite`; as operações mantêm rótulo textual e ícone decorativo.

## Evidência expurgada

Selecione **Usuário: Sistema** e **Entidade: Evidências** para acessar o evento de expurgo; **Consultar metadados** abre `/app/gestor/auditoria/evidencias/EV-4310`. O item Auditoria continua ativo na navegação. A rota válida é prerenderizada com HTTP 200; IDs desconhecidos resultam em 404.

`ManagerPurgedEvidenceCard` apresenta **EXPURGADA**, o identificador **EV-4310**, atendimento **AT-2089**, chamado histórico **#1032 — Luminárias do corredor**, envio em **15/04/2026 às 10h20**, expurgo em **30/10/2026 às 02h00** e motivo **EXPIRACAO_RETENCAO**. Os horários são de Brasília. Esse snapshot é independente do chamado #1032 atual. As datas não comprovam aplicação de uma política de retenção; esta demonstração não executa o expurgo. O cartão contém somente rastreabilidade, sem imagem, preview, URL de storage ou opção de download. **Voltar à auditoria** retorna à consulta.

## Reuso e fontes

O cabeçalho, painéis, títulos, rótulos, ações textuais, tabela, estado vazio, `Select`, `ButtonSecondary` e badges de estado vêm dos componentes existentes. `ManagerAuditOperationBadge` é compartilhado por tabela, fichas e detalhes; sua API está em [FRONTEND_GESTOR_UI.md](FRONTEND_GESTOR_UI.md#estados-e-ausência-de-resultados). A extensão reutiliza `WorkspaceLoadingState` e acrescenta `ManagerPurgedEvidenceCard`, cujos contratos estão no [adendo FE-029–033](FRONTEND_GESTOR_UI.md#extensão-fe-029033). A única adaptação da navegação mantém Auditoria ativa na rota filha; tokens e sistema visual global permanecem intactos.

- [manager-audit.ts](../src/app/features/workspace/gestor/pages/manager-audit.ts): filtros, paginação, seleção e foco locais.
- [manager-audit.html](../src/app/features/workspace/gestor/pages/manager-audit.html): tabela, fichas e detalhes sem CSS por página.
- [manager-audit-demo-data.ts](../src/app/features/workspace/gestor/data/manager-audit-demo-data.ts): tipos, snapshot e filtro puro.
- [manager-audit-operation-badge.ts](../src/app/features/workspace/gestor/components/manager-audit-operation-badge.ts): apresentação compartilhada da operação.
- [manager-evidence-metadata.ts](../src/app/features/workspace/gestor/pages/manager-evidence-metadata.ts), [manager-purged-evidence-card.ts](../src/app/features/workspace/gestor/components/manager-purged-evidence-card.ts) e [purged-evidence-demo-data.ts](../src/app/features/workspace/gestor/data/purged-evidence-demo-data.ts): rota, cartão e DTO histórico sem referência de arquivo. O evento reutiliza a mesma fonte de ID e data de expurgo.

## Limites da demonstração

A consulta não altera chamados, usuários, relógios, contas ou arquivos. Não há API, persistência, autenticação, autorização real, OIDC ou tokens de identidade; nomes e identificadores são fictícios. Eventos de evidência, validação automática e expurgo são somente texto histórico ilustrativo: nenhum arquivo é enviado, consultado ou removido e nenhuma rotina é executada.

A retenção de **5 anos** é uma política **prevista na [proposta](<Prosposta-Integrador(2).md>) (linha 124)**, identificada como tal na interface. Esta extensão não implementa retenção, imutabilidade, expurgo ou garantias de auditoria de produção.

## Evidências históricas de 07/11/2026

A sequência abaixo corresponde à entrega anterior. A validação e a revisão da extensão FE-029–033 estão registradas em [FRONTEND_29_33_GESTOR.md](FRONTEND_29_33_GESTOR.md#evidências-da-extensão).

O pacote [review-packet.md](../tmp/audit-refinement/review-packet.md) registra a referência e o contrato. Os **3 novos testes unitários de dados** passaram antes do último lote de UI e foco; a função de dados não mudou depois. As suítes de auditoria e workspace somaram **28 execuções E2E aprovadas em Chromium e Firefox antes da correção de cor**, incluindo filtros, paginação, teclado, SSR sem JavaScript e ausência de requisições externas ou persistência. Após a correção, as **6 execuções específicas de auditoria passaram novamente**; são repetições e o total único permanece 28, sem uma nova execução completa das duas suítes.

O **build final passou com 374,19 kB iniciais e 21 rotas prerenderizadas**; lint e typecheck passaram após a correção. Permanece apenas o aviso preexistente NG8113 de `HeroBackground`.

As oito capturas em `tmp/audit-refinement/confirm/` cobrem desktop, tablet, celular, tela baixa, vazio e atribuição: `audit-1440-900.png`, `audit-1024-768.png`, `audit-768-900.png`, `audit-390-844.png`, `audit-320-640.png`, `audit-1440-720.png`, `audit-empty-1440.png` e `audit-assignment-1440.png`. Todas foram atualizadas com a produção final e reabertas pelo implementador; as métricas registram zero overflow, um `h1`, zero imagens quebradas e nenhum `pageerror`. Não houve mudança de UI depois desses testes e capturas.

A [revisão independente](../tmp/audit-refinement/finish-review.md) marcou `disposition: fix` por contraste de três metadados selecionados. O ajuste usa o token existente `ink2`; [fix-evidence.md](../tmp/audit-refinement/fix-evidence.md) registra a validação posterior e `inspect-final/report.json` confirma **0 FAIL / 0 WARN** em 1440, 768 e 390 px, sem ignore persistido. O [parecer posterior](../tmp/audit-refinement/finish-verdict.md) marcou o achado como `resolved`, `remaining: clear` e `disposition: ship`, limitado à correção pontuada; não representa uma nova busca de defeitos.
