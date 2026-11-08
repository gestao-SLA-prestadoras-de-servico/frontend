# Gestor — relatórios demonstrativos

Atualização de 07/11/2026. A rota `/app/gestor/relatorios` apresenta quatro indicadores e dois recortes de cumprimento dos três prazos de SLA. A imagem `Captura de tela 2026-11-07 211355.png`, fornecida pelo usuário, orienta a hierarquia e as barras percentuais; a página conserva o sistema NIVELO documentado em [DESIGN.md](../DESIGN.md) e os componentes de [FRONTEND_GESTOR_UI.md](FRONTEND_GESTOR_UI.md).

## Escopo e apresentação

Os indicadores mostram chamados apurados, SLA de resposta, SLA de atendimento em campo e SLA de resolução. Os recortes “Por cliente” e “Por técnico” têm cinco campos: nome, chamados, resposta, atendimento em campo e resolução. O cabeçalho identifica o período e os dados fictícios e oferece retorno ao painel.

A página reutiliza `ManagerPageHeader`, `ButtonSecondary` e `ManagerMetricCard` com `variant="outlined"`. Os recortes reutilizam `ManagerPanel`, `ManagerSectionHeading`, `ManagerTable`, `ManagerTableHead` e `ManagerTableBody`. Permanecem Manrope, superfícies planas, contornos, raios e cores existentes; não foram criados tokens, CSS por página, imagens ou animações.

A partir de 768 px, cada recorte usa uma tabela nativa com `caption`, cabeçalhos de coluna e de linha. Abaixo de 768 px, os mesmos dados aparecem em fichas com títulos e listas de definição. As barras são decorativas; o percentual e a contagem de chamados cumpridos/total permanecem acessíveis. A legenda associa verde a 90% ou mais e perigo a valores abaixo de 90%, sempre com texto.

## Dados e apuração local

Fonte única: [manager-report-demo-data.ts](../src/app/features/workspace/gestor/data/manager-report-demo-data.ts). `MANAGER_REPORT_SAMPLE` representa **56 chamados encerrados fictícios de setembro de 2026**, independentes da fila atual. O painel e os relatórios leem o mesmo resumo mensal.

| Prazo | Cumpridos | Violados | Percentual exibido |
| --- | --- | --- | --- |
| Resposta | 54 | 2 | 96% |
| Atendimento em campo | 51 | 5 | 91% |
| Resolução | 49 | 7 | 88% |

`buildManagerReport(tickets)` deriva os totais e ambos os agrupamentos da mesma amostra. Os clientes somam 18 chamados de Edifício Aurora, 15 de Clínica Horizonte, 12 de Mercado Estação e 11 de Residencial Alameda. Os técnicos somam 17 de Rafael Costa, 16 de Juliana Pires, 14 de Bruno Prado e 9 de Bianca Lopes; ambos os recortes reconciliam os 56 chamados.

Cada taxa usa `Math.round(cumpridos / total * 100)`, ou zero quando não há chamados. O resumo considera cada chamado: não faz média simples dos percentuais arredondados dos grupos. Os booleanos da amostra já representam resultados fictícios; não há cálculo de relógios operacionais ou de prazos contratuais. Um prazo cumprido após a violação continua contado como violado.

No recorte por técnico, `response` é `null`: a resposta é responsabilidade do gestor e aparece como “—”, com explicação visível e acessível. Isso não indica zero por cento nem ausência de chamados.

## Componentes e contratos

| Componente | API |
| --- | --- |
| [ManagerSlaReportTable](../src/app/features/workspace/gestor/components/manager-sla-report-table.ts) / `app-manager-sla-report-table` | `kind: 'client' \| 'technician'` e `rows: readonly ReportRow[]`, ambos obrigatórios. `kind` define título, sujeito e identificador da seção; `rows` fornece os dados sem agrupamento ou cálculo no componente. |
| [ManagerSlaRate](../src/app/features/workspace/gestor/components/manager-sla-rate.ts) / `app-manager-sla-rate` | `rate: ReportRate \| null` obrigatório. Exibe barra e percentual, ou a ausência de apuração de resposta por técnico quando recebe `null`. |
| [ManagerMetricCard](../src/app/features/workspace/gestor/components/manager-metric-card.ts) / `app-manager-metric-card` | Acrescenta `suffix: string` opcional, padrão vazio, concatenado ao valor. A página usa `suffix="%"`; os demais consumidores preservam sua apresentação. |

Os tipos exportados pela fonte de dados têm campos `readonly`:

| Tipo | Campos |
| --- | --- |
| `ReportRate` | `total`, `fulfilled`, `violated` e `percentage`: `number`. |
| `ReportRow` | `name: string`, `total: number`, `response: ReportRate \| null`, `field: ReportRate` e `resolution: ReportRate`. |

```html
<app-manager-sla-report-table kind="client" [rows]="report.clients" />
<app-manager-sla-report-table kind="technician" [rows]="report.technicians" />
```

As fontes da página são [manager-reports.ts](../src/app/features/workspace/gestor/pages/manager-reports.ts) e [manager-reports.html](../src/app/features/workspace/gestor/pages/manager-reports.html). A rota usa `ManagerReports`; auditoria continua em `ManagerPreview`.

## Limites

Esta entrega não inclui filtros, seleção de período, exportação, integração, API, persistência, autenticação ou autorização reais. Pessoas, clientes, volumes e resultados são demonstrativos. Os dados não são prova de operação real nem alteram a fila, contratos, políticas ou histórico do produto.

## Validação registrada

O [pacote de revisão](../tmp/reports-refinement/review-packet.md) registra build aprovado com **373,22 kB iniciais e 21 rotas prerenderizadas**, abaixo do limite de 500 kB, além de lint e typecheck aprovados. O aviso NG8113 de `HeroBackground` é preexistente e permanece fora desta extensão.

Passaram três testes unitários novos: reconciliação dos totais, ponderação por quantidade de chamados e amostra vazia finita. Passaram **28 E2E em Chromium e Firefox** nas suítes `manager-reports.spec.ts`, `manager-tickets.spec.ts` e `workspace.spec.ts`, incluindo navegação, teclado/foco, responsividade e SSR sem JavaScript, sem persistência ou requisições externas.

O implementador abriu as oito capturas em `tmp/reports-refinement/initial/`: relatórios em 320, 390, 768, 1024 e 1440 px, incluindo 1440 × 720, e painel em 390 e 1440 px. As métricas registram zero overflow, um `h1`, zero imagens quebradas e zero `pageerrors`. O lint visual da fonte e o inspetor renderizado em 1440, 768 e 390 px registraram **0 FAIL / 0 WARN**. A permissão pontual `--allow icon-chips` corresponde aos indicadores existentes solicitados; não foi gravado ignore persistente e o hook permaneceu ativo.

A [revisão independente](../tmp/reports-refinement/finish-review.md) abriu as oito capturas e examinou a referência e a fonte, sem nova execução de navegador ou detector. Registrou `disposition: ship`, sem correções materiais. Não houve alteração de UI após as capturas e verificações. Este documento registra essas evidências, sem iniciar nova rodada de testes.
