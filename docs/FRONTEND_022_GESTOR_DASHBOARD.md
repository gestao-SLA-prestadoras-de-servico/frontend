# FRONTEND 022 — Painel de operações do Gestor

## Escopo

Atualização demonstrativa de `/app/gestor`, preservando o shell compartilhado, a identidade Nivelo e os conteúdos de Cliente e Técnico. Os dados mudam somente em memória na sessão; não há API, armazenamento persistente ou operação sobre uma plataforma real.

As seções iniciais preservam o histórico da primeira implementação. A composição atual está registrada em **Painel — expansão de 07/11/2026**, após o refinamento da fila completa.

## Histórico — implementação inicial

### Indicadores e fila

Os quatro indicadores usam `ManagerTicketDemoStore`:

- **Violados:** chamados com `overdue`; o total pode se sobrepor a outros estados.
- **Aguardando triagem:** chamados `ABERTO`.
- **Em atendimento:** chamados `EM_ATENDIMENTO`; `ATRIBUIDO` permanece separado.
- **Aguardando validação:** chamados `RESOLVIDO`.

“Chamados que pedem atenção” lista todos os chamados não finalizados: `ABERTO`, `ATRIBUIDO`, `EM_ATENDIMENTO` e `RESOLVIDO`. Os estados `CANCELADO` e `ENCERRADO` ficam fora da lista e dos totais por estado. Violações recebem rótulo e cor de alerta. O título do chamado abre seu detalhe; o botão do cabeçalho abre a fila completa.

### Resumos

**Chamados por estados** mostra os quatro estados não finalizados, incluindo contagens iguais a zero.

**Cumprimentos SLA do mês** é uma amostra fixa e explicitamente demonstrativa: 56 chamados encerrados em setembro de 2026.

| Compromisso | Cumpridos | Violados | Cumprimento |
|---|---:|---:|---:|
| Resposta | 54 | 2 | 96% |
| Atendimento em campo | 51 | 5 | 91% |
| Resolução | 49 | 7 | 88% |

Os percentuais são arredondados a partir das contagens exibidas. A amostra não representa apuração real.

**Carga por técnico** lista usuários com perfil Técnico e situação Ativo, usando `UserDemoStore`. A carga exibida soma chamados atribuídos e em atendimento, comparada ao limite definido para aquele técnico; número e barra comunicam a proporção.

### Adaptação e verificação

Em telas largas, a fila e os resumos aparecem lado a lado; estados e carga ocupam a primeira linha dos resumos, com SLA em uma faixa larga abaixo. Em tablet e celular, a tabela se transforma em fichas, sem rolagem horizontal. O acesso à fila e aos detalhes permanece disponível por teclado.

Verificações desta atualização: `npm run typecheck`, `npm run lint`, `npm run build` e 12 testes Playwright Chromium nos arquivos `e2e/manager-tickets.spec.ts` e `e2e/workspace.spec.ts`. O inspetor da build de produção avaliou 1440×900, 768×1024 e 390×844 sem falhas ou avisos.

## Fila completa — refinamento de 07/11/2026

Em `/app/gestor/chamados`, a primeira coluna reúne código, problema e cliente em três linhas. As demais colunas são Prioridade, Estado, Técnico, Aberto em e Relógios. Cada prioridade e estado tem um ícone Lucide distinto, acompanhado do rótulo textual.

`ManagerTicketBadge` e `ManagerTicketClocks` são reutilizados na tabela e nas fichas móveis. As tags **Resp**, **Campo** e **Resol** usam os três prazos existentes no `ManagerTicketDemoStore`: check para cumprido, alerta e texto para violado, data e horário para pendente. Os nomes completos e os valores originais permanecem acessíveis. Chamados cancelados mostram **Sem apuração de SLA**, conforme a referência. Os horários pertencem ao cenário fictício; não há contagem regressiva nem apuração de tempo real.

Abaixo de 768 px, as fichas conservam cliente junto à identificação, abertura, técnico e os mesmos indicadores. No tablet, a rolagem horizontal fica dentro da tabela; os textos exclusivos de leitores de tela têm posicionamento contido nas tags para não ampliar a página.

Verificação deste refinamento: build de produção, lint, tipagem e quatro execuções E2E em Chromium/Firefox aprovados (`manager-tickets.spec.ts` e `manager-ticket-assignment.spec.ts`). Capturas em 1440, 768, 390 e 320 px sem overflow da página, imagens quebradas ou erros JavaScript. O inspetor final registrou zero falhas e um aviso de proporção de textos pequenos: mantidos os 11–12 px nos indicadores compactos, metadados e sublinhas, conforme o padrão existente e a referência. Nenhuma supressão adicionada.

## Painel — expansão de 07/11/2026

A expansão alinha `/app/gestor` à fila completa e acrescenta **Atendimento ao longo do tempo**, **Saúde do SLA** e **Carga da equipe**, seguindo a captura de referência fornecida para esta etapa. Preserva Manrope, paleta Nivelo, shell, navegação e superfícies do sistema `framed-sheet`. Não cria contrato visual, tokens ou estilos globais.

### Composição e componentes

O painel apresenta quatro indicadores, seguidos de gráfico e saúde do SLA; depois vêm os chamados que pedem atenção e a carga da equipe. A distribuição por estado e a amostra mensal de SLA permanecem na faixa final.

| Componente | Uso atual |
|---|---|
| `ManagerMetricCard` | Quatro indicadores do painel e três da fila completa, com ícone Lucide, rótulo, valor e tom semântico. |
| `ManagerActivityChart` | Barras diárias de recebidos e resolvidos, legenda, totais e tabela acessível em “Ver dados do gráfico”. |
| `ManagerSlaHealth` | Proporção dos chamados não finalizados sem violação, contagens e acesso à fila. |
| `ManagerTeamWorkload` | Técnicos ativos, iniciais, carga, limite, vagas disponíveis e acesso a `/app/gestor/usuarios`. |
| `ManagerTicketBadge` e `ManagerTicketClocks` | Os mesmos estados, prioridades e três prazos na fila completa e na tabela ou nas fichas do painel. |

Os ícones dos indicadores são alerta para **Violados**, caixa de entrada para **Aguardando triagem**, ferramenta para **Em atendimento** e prancheta com check para **Aguardando validação**. Na fila, **Em aberto**, **Resolvidos** e **Atrasados** usam pasta, círculo com check e despertador. Os ícones são decorativos para leitores de tela; os rótulos e números continuam disponíveis.

Os componentes ficam em `src/app/features/workspace/gestor/components/`; `pages/manager-dashboard.ts` deriva indicadores, chamados prioritários e distribuição do `ManagerTicketDemoStore`. A tabela do painel reúne identificação e cliente, estado e prioridade, técnico e relógios; violações vêm primeiro. Os atalhos de fila e os títulos dos chamados preservam a navegação existente.

### Dados e limites

Os blocos usam conjuntos distintos, identificados na interface:

- **Fila e saúde atual:** quatro dos seis chamados locais não estão finalizados. A saúde calcula `(não finalizados − violados) / não finalizados`, arredondada: três sem violação e um violado resultam em **75%**. Sem chamados, mostra **— / Sem chamados**, sem sugerir 100% de cumprimento. A fila vazia apresenta mensagem própria.
- **Histórico de atendimento:** `data/manager-dashboard-demo-data.ts` contém uma amostra independente de sete dias, de **30/10 a 05/11/2026**, com **44 recebidos e 35 resolvidos**. Totais, altura das barras e escala derivam dessas linhas. A tabela expansível permite ler cada valor por teclado; esse histórico não é reconstruído a partir dos seis chamados atuais.
- **Carga da equipe:** `UserDemoStore` fornece a carteira fictícia inteira dos técnicos ativos, somando `assigned + inProgress` e ordenando pela carga. A amostra inicial mostra **Bruno Prado 4/4**, **Rafael Costa 2/4** e **Juliana Pires 1/4**. A barra limita a largura a 100%; texto e contagem comunicam capacidade, e equipe vazia mostra “Nenhum técnico ativo”. Esses totais não são a soma da fila de seis exemplos.
- **SLA mensal:** permanece a amostra anterior de **56 chamados encerrados em setembro de 2026**, com os mesmos 54, 51 e 49 compromissos cumpridos e percentuais da tabela histórica acima.

O cenário atual continua fixo em 05/11/2026. As violações usam os sinalizadores demonstrativos existentes; nenhum bloco consulta relógio real, API ou armazenamento persistente. O histórico separado não representa apuração de uma operação real.

### Adaptação e verificação desta expansão

Os indicadores do painel usam quatro colunas a partir de 1024 px e duas nas larguras menores. Gráfico e saúde ficam lado a lado a partir de 1024 px, na proporção 2:1; chamados e equipe ficam lado a lado a partir de 1280 px. A tabela do painel aparece a partir de 1280 px e vira fichas abaixo desse ponto. Os demais blocos se empilham nas telas menores, conservando ações e leitura por teclado. A fila completa mantém o comportamento registrado no refinamento anterior.

Build final de produção, lint e tipagem aprovados: **21 rotas prerenderizadas**, pacote inicial de **372,69 kB**, abaixo do limite de **500 kB**. O aviso `NG8113` de `HeroBackground` já existia fora deste escopo. Quatro execuções E2E de `manager-tickets.spec.ts` e `manager-ticket-assignment.spec.ts` passaram em Chromium e Firefox, incluindo os sete ícones e a tabela acessível do gráfico. Elas ocorreram antes das três correções finais de estilo: altura do gráfico, camada do percentual sobre o SVG e escolha de uma única cor para a barra de carga. Build, lint, tipagem e capturas foram confirmados após essas correções; os E2E não foram repetidos nessa etapa final.

A revisão final aprovou a entrega. Foram conferidas oito capturas: painel em **1440, 1024, 768, 390 e 320 px**; fila em **1440, 390 e 320 px**. As métricas registram zero overflow da página e nenhum erro JavaScript; o painel também registra zero imagens quebradas. O inspetor final avaliou 1440, 768 e 390 px com **zero falhas e um aviso `tiny-text`**, mantendo os 11–12 px do padrão existente em metadados, badges e eixos. Nenhuma supressão foi adicionada.

Evidências locais: `tmp/dashboard-refinement/review.md`, capturas e `metrics.json` em `tmp/dashboard-refinement/confirm/`, e relatório em `tmp/dashboard-refinement/confirm-inspect/report.json`.

## Indicadores — correção visual de 07/11/2026

Após a expansão, a captura **190519** fornecida pelo usuário orienta os quatro indicadores de `/app/gestor`: cartões brancos, borda discreta de 1 px, cantos de 12 px, texto neutro e ícone no topo esquerdo sobre suporte tonal. `ManagerMetricCard` passa a oferecer `variant="outlined"`, usada apenas no painel; `tinted` continua sendo o padrão da fila. A composição vertical reserva 40 px para o rótulo abaixo de 1280 px e 20 px a partir dessa largura, alinhando números e notas por linha. A mudança é apenas de apresentação, com os mesmos indicadores e dados.

Build, lint e tipagem aprovados; pacote inicial de **372,76 kB** e **21 rotas prerenderizadas**. As capturas e métricas em `tmp/metric-card-refinement/final/` confirmam o alinhamento e zero overflow em 1440, 1024, 768, 390 e 320 px, ausência de erros JavaScript e as cores anteriores na fila. Não houve novos testes funcionais nesta correção visual. O relatório `tmp/metric-card-refinement/inspect/report.json` registra zero falhas e o aviso herdado `tiny-text`; a permissão pontual `icon-chips` corresponde à referência explícita, sem supressão persistente. A revisão específica dos indicadores aprovou as quatro correções, com todos os achados resolvidos.
