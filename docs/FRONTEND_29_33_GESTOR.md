# FRONTEND 29–33 — relatórios e governança do Gestor

Entrega de 09/11/2026 na branch `feature/FE29-FE33-Relatorio-Gestor`. Extensão Angular somente de interface, em modo **Operate**, sobre o sistema `framed-sheet` existente. O trabalho aproveita painel, indicadores, relatórios e auditoria já implementados e completa as lacunas das tarefas FE-029–033.

## Escopo entregue

| Task | Comportamento atual |
| --- | --- |
| FE-029 | Indicadores existentes preservados; `ManagerSlaSummary` compartilha entre painel e relatório três barras de cumpridos/violados, contagens textuais e legenda. Sem chamados, a contagem é 0 e as taxas ficam “—”. |
| FE-030 | Período, cliente e técnico se combinam localmente; faixa de filtros aplicados, limpeza/restauração com foco no período, resultados e vazio responsivos. Outubro representa explicitamente ausência de registros. |
| FE-031 | PDF/CSV disponíveis com dados e desabilitados no vazio. Diálogo nativo com preparação e conclusão manuais da demonstração, cancelamento, Escape, backdrop, foco contido e devolvido ao acionador. |
| FE-032 | Tabela/fichas, filtros, paginação, seleção, detalhes e vazio existentes preservados. Seletor explícito de carregamento simulado remove conteúdo anterior e permite restaurar a lista sem perder filtros. |
| FE-033 | Rota de metadados históricos com cartão EXPURGADA, identificação, atendimento/chamado relacionado, datas e explicação; sem imagem, URL de arquivo ou download. |

Rotas: `/app/gestor`, `/app/gestor/relatorios`, `/app/gestor/auditoria` e `/app/gestor/auditoria/evidencias/EV-4310`. A última mantém Auditoria ativa na navegação, é prerenderizada com HTTP 200 e retorna 404 para IDs desconhecidos.

## Dados e limites

A amostra de setembro de 2026 mantém **56 chamados encerrados**: resposta **54 cumpridos / 2 violados / 96%**; atendimento em campo **51 / 5 / 91%**; resolução **49 / 7 / 88%**. Painel e relatório usam o mesmo resumo, independente da fila atual. Os recortes continuam reconciliados por cliente/técnico; a resposta pertence ao gestor e aparece “—” no recorte por técnico. Não há cálculo de relógios operacionais.

Os filtros não alteram a amostra. Outubro e combinações sem registros mostram vazio, 0 chamados e taxas sem apuração; gráfico e recortes são omitidos e a exportação fica indisponível. **Limpar filtros** e **Restaurar amostra** recuperam setembro com todos os clientes/técnicos.

O evento de expurgo e o cartão compartilham a fonte histórica de **EV-4310**, atendimento **AT-2089**, chamado **#1032 — Luminárias do corredor**, envio em **15/04/2026 às 10h20** e expurgo em **30/10/2026 às 02h00**, horários de Brasília, motivo `EXPIRACAO_RETENCAO`. Esse snapshot fictício é independente do chamado #1032 atual. As datas não comprovam aplicação de uma política de retenção; esta demonstração não executa o expurgo.

Não há geração de arquivos, downloads, consulta HTTP, polling, timers de processamento, armazenamento persistente, autenticação ou autorização reais. Exportação apenas alterna os estados do diálogo por ação explícita. Nenhum arquivo é enviado, consultado ou removido; retenção e expurgo automático não são executados.

## Roteiro local

1. Em **Relatórios**, confira os 56 chamados de setembro e o resumo também usado no painel.
2. Combine cliente/técnico e confira a faixa de filtros; selecione outubro ou uma combinação sem registros para ver vazio e PDF/CSV desabilitados. Restaure a amostra.
3. Selecione **Exportar PDF** ou **Exportar CSV**; confira “Preparando…” e acione **Concluir simulação**. A conclusão informa que nenhum arquivo foi gerado ou baixado. Cancelar, fechar, Escape e backdrop encerram a simulação.
4. Em **Auditoria**, abra **Estados da demonstração** e escolha **Carregamento simulado**. Volte a **Registros de exemplo** para continuar com os filtros escolhidos.
5. Filtre **Usuário: Sistema** e **Entidade: Evidências**; no evento de expurgo, selecione **Consultar metadados**. Confira EXPURGADA e os metadados sem mídia; **Voltar à auditoria** retorna à consulta.

## Fontes e contratos

- [Relatórios](FRONTEND_GESTOR_RELATORIOS.md): apuração, recortes, filtros e exportação; fontes em `gestor/pages/manager-reports.{ts,html}` e `gestor/data/manager-report-demo-data.ts` sob `src/app/features/workspace/`.
- [Auditoria](FRONTEND_GESTOR_AUDITORIA.md): lista, foco, carregamento e metadados; fontes em `gestor/pages/manager-audit.{ts,html}`, `manager-evidence-metadata.ts` e `gestor/data/{manager-audit-demo-data,purged-evidence-demo-data}.ts`.
- [APIs compartilhadas](FRONTEND_GESTOR_UI.md#extensão-fe-029033): `ManagerMetricCard`, `ManagerSlaSummary`, `ManagerReportExport`, `ManagerPurgedEvidenceCard`, DTO e `WorkspaceLoadingState`. Rotas em `workspace.routes.ts` e `src/app/app.routes.server.ts`.

## Evidências da extensão

O [pacote de revisão](../tmp/fe29-33/review-packet.md) registra o contrato e a sequência abaixo. Esta documentação usa os resultados existentes, sem nova rodada de navegador, testes ou detector.

- **Build final:** 374,85 kB iniciais, abaixo de 500 kB, e **22 rotas prerenderizadas**; lint e typecheck aprovados após o lote final de UI. O aviso NG8113 de `HeroBackground` é preexistente.
- **Unitários:** 7 aprovados (4 de relatório e 3 de auditoria, incluindo um novo teste de filtros), antes do último lote exclusivamente de UI; os dados não mudaram depois.
- **E2E:** 52 execuções únicas aprovadas inicialmente e novamente com a produção final em **57,4 s**, em Chromium e Firefox, sem retries. Cinco novos cenários em dois navegadores representam 10 dessas 52 execuções, não um total adicional. A cobertura inclui filtros/vazio/foco, formatos e estados do diálogo, carregamento, IDs válidos/inválidos, SSR sem JavaScript e regressões do shell/notificações.
- **Capturas:** uma rodada inicial de 20 e uma confirmação de 20 em `.impeccable/review/fe29-33/`, todas abertas pelo implementador. Relatórios e metadados em 1440/768/390/320 px; relatório filtrado e vazio, exportação em andamento/concluída, auditoria normal/carregando/vazia e painel. Os overlays usam captura do viewport, incluindo 320 × 568; E2E também exercita 1440 × 400. Uma recaptura técnica posterior substituiu o full-page de relatório em 1440 px e seu alias, com mais dois recortes comparativos, sem alterar produto ou build.
- [Métricas da confirmação](../tmp/fe29-33/confirm/metrics.json): zero overflow, imagens quebradas ou `pageerrors` nas 20 capturas. Lint visual de seis fontes: **0 FAIL / 0 WARN**, antes do último lote de UI.
- Inspetores de relatório e auditoria: **0 FAIL / 0 WARN** em 1440/768/390 px. `--allow icon-chips` foi pontual para os ícones de indicadores existentes aprovados; sem ignore persistente. O hook permaneceu ativo; o limite automático de dicas em arquivos existentes não desativou regras.
- Metadados: o aviso inicial de rótulo pequeno foi corrigido para 13 px. O [inspetor final](../tmp/fe29-33/inspect-metadata-final/report.json) registra **0 FAIL / 1 WARN**, `panel-void` de 124 px na folha externa com altura mínima do shell; o cartão acompanha as próprias linhas. O aviso contextual foi preservado, sem alegar inspeção totalmente limpa.

A [primeira revisão](../tmp/fe29-33/finish-review.md) retornou `disposition: recapture` por uma divergência visual na barra de resolução do full-page desktop. A evidência foi substituída após estabilização da pintura; full-page e os recortes `reports-1440-fold.png` / `reports-1440-chart.png` concordam com 88%/12%. As [medições da recaptura](../tmp/fe29-33/confirm/recapture-metrics.json) registram 310,9375 px verdes e 42,390625 px vermelhos, sem overflow. A leitura dos pixels do PNG atual confirmou 309 pixels verdes e 39 vermelhos no trecho inspecionado, resolvendo a divergência de visualização da evidência. Não foi estabelecido nem corrigido um defeito de implementação; o parecer inicial não aprova o produto.

A [revisão independente final](../tmp/fe29-33/finish-review-final.md) registrou **`disposition: ship`** após uma revisão completa da matriz FE-029–033, fontes, 20 capturas finais, dois comparativos e quatro capturas anteriores. Não solicitou correções materiais, novo build ou recaptura. O parecer esclarece que a interpretação visual anterior não estabelece captura atual inválida ou defeito de UI. Os cinco status e vinte entregáveis de FE-029–033 foram marcados como concluídos no arquivo local `docs/tasks/tasks_frontend.md`, já ignorado pelo Git, sem alterar regras de ignore, RACI ou outras tarefas.

## Continuidade visual

Preservados Manrope, tokens, controles, painéis planos e shell. A extensão reutiliza `ManagerPanel`, `ManagerSectionHeading`, `ManagerDialog`, `Select` e botões existentes; não acrescenta dependências, CSS global ou imagens raster. `DESIGN.md` e `.impeccable/design.json` permanecem intactos. A comparação documental considerou suas regras de identidade e workspace, os primitivos de superfície e as fontes dos componentes novos.

Há redação histórica preexistente em `DESIGN.md` e no sidecar que descreve o protótipo de telas internas como ainda não implementado, embora o workspace atual já exista. Esse texto não foi reescrito nesta extensão; os contratos atuais do Gestor ficam nos documentos de superfície acima.
