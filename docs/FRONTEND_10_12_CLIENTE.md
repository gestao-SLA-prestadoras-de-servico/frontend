# Portal Cliente — FE-010 a FE-012

O portal demonstra consulta, abertura e revisão de chamados com a identidade Nivelo. Componentes e dados próprios ficam em `src/app/features/workspace/client/`. A landing, os dados compartilhados e os componentes de Gestor e Técnico permanecem preservados.

## Rotas e cenários

| Rota                         | Conteúdo                                                          |
| ---------------------------- | ----------------------------------------------------------------- |
| `/app/cliente`               | Meus chamados, totais, prazo de validação, busca e filtros locais |
| `/app/cliente/novo-chamado`  | Formulário, prazos do contrato, próximas etapas e confirmação     |
| `/app/cliente/chamados/1042` | Climatização em atendimento; resposta e campo cumpridos           |
| `/app/cliente/chamados/1041` | Quadro elétrico atribuído; campo e resolução em andamento         |
| `/app/cliente/chamados/1038` | Bomba resolvida, aguardando validação; evidência e dois diálogos  |
| `/app/cliente/chamados/1032` | Iluminação encerrada; revisão indisponível                        |
| `/app/cliente/chamados/9999` | 404 do perfil, com retorno aos meus chamados                      |

Os IDs são comparados exatamente: zeros iniciais, IDs de outro cliente e valores não numéricos não identificam um chamado. Os quatro detalhes usam prerenderização parametrizada. O fallback de servidor preserva o HTTP 404 para IDs desconhecidos.

## Dados e limites

As fixtures tipadas ampliam os exemplos do Edifício Aurora com abertura, contrato, descrição, três prazos, conclusões, eventos e evidência. Há quatro chamados: dois em andamento, um aguardando validação e um encerrado. Os cards resumem todos os chamados; filtros afetam apenas a listagem.

O cenário é fixo em 05/11/2026 às 10h, horário de Brasília. Datas não são calculadas a partir do relógio atual. O prazo fictício de validação do #1038 é 06/11/2026 às 15h20. O contrato CT-2026-014 está vigente; CT-2026-009 está vencido e bloqueia a confirmação do formulário.

A imagem `/images/manutencao-ilustrativa.png` já existente foi gerada por IA e aparece com legenda e texto alternativo explícitos. Ela demonstra a consulta de evidências, sem representar o serviço da bomba. Sua origem continua no sidecar do ativo e nos registros anteriores.

Busca, filtros e formulários operam somente na memória da tela. Não há API, persistência, upload, criação de chamado ou alteração de estado. Os resultados de envio, validação e reabertura explicam isso. Atualizar ou sair da tela descarta o resultado. Em “Estados de demonstração”, a listagem permite mostrar carregamento e lista vazia imediatamente, sem atraso artificial.

## Campos e acessibilidade

- Contrato vigente obrigatório; título de 5 a 120 caracteres; descrição de 20 a 2.000; local de 3 a 160. A validação considera o texto sem espaços nas extremidades.
- Prioridade sugerida opcional, com Normal como padrão. A avaliação final pela prestadora é apresentada como fluxo previsto.
- Reabertura disponível somente no chamado resolvido, com justificativa de 20 a 1.000 caracteres. Confirmação de resolução explica o encerramento que ocorreria em operação real.
- Campos têm labels, indicação de obrigatoriedade, limites e erros associados por `aria-describedby`. O primeiro campo inválido recebe foco.
- Diálogos nativos contêm o foco, fecham por Escape e devolvem o foco ao acionador ao cancelar. Resultados recebem foco após a atualização da tela.
- Não há animação de entrada. Foco, botões, fonte, paleta e controles seguem a Nivelo. Tabela se converte em cards no celular; nenhum campo da linha é descartado.
- Conteúdo é renderizado no servidor. Ações de envio e revisão aguardam a hidratação e ficam desabilitadas sem JavaScript.

## Verificação

Resultado final: lint e typecheck aprovados; 39 testes unitários aprovados; 40 testes E2E aprovados em Chromium e Firefox contra o build de produção, com um worker. O build gerou 19 rotas estáticas, incluindo os quatro detalhes parametrizados. A checagem HTTP confirmou seis rotas válidas com conteúdo renderizado e três IDs desconhecidos com status 404. Permanece apenas o aviso preexistente de `HeroBackground` não utilizado na landing.

Comandos: `npm run lint`, `npm run typecheck`, `npm run test:ci`, `npm run build` e `PLAYWRIGHT_TEST_BASE_URL=http://127.0.0.1:4317 npx playwright test e2e/client.spec.ts e2e/workspace.spec.ts --project=chromium --project=firefox --workers=1 --reporter=line` (variável de ambiente definida conforme o shell).

A suíte `e2e/client.spec.ts` cobre listagem, filtros combinados, busca sem acentos, estados demonstrativos, formulário inválido, espaços em branco, contrato vencido, confirmação, IDs inválidos, indisponibilidade por estado, validação, reabertura, foco e responsividade. Verifica também carregamento da evidência, ausência de chamadas de escrita e armazenamento vazio.

A suíte existente `e2e/workspace.spec.ts` mantém os testes de navegação, menu, perfis, teclado, notificações, sessão e renderização sem JavaScript. Somente a contagem esperada do Cliente passa de três para quatro chamados, devido ao exemplo encerrado.

Capturas de revisão são geradas em `tmp/client-review/`: listagem, formulário, detalhe e diálogo em 390 e 1440 px. Os testes de largura incluem 320 e 768 px, além de 1024 px e telas baixas na regressão do shell.

A revisão visual independente recebeu as oito capturas e retornou `ship`, sem correções materiais. A revisão da documentação preservou o sistema existente. O inspector CDP da skill design-taste não concluiu (`Page.enable` expirou); as capturas, interações e verificações de largura foram executadas em navegadores reais pelo Playwright.

No Firefox, o evento `close` do diálogo pode ocorrer depois da renderização do resultado. O componente devolve foco ao acionador somente em cancelamentos; envios válidos preservam foco no resultado demonstrativo. A evidência usa carregamento adiado: o teste rola até a imagem e aguarda a resolução do ativo antes da captura.

O detector de design sinalizou `broken-image` no binding Angular `[src]="evidence.image"`. É um falso positivo: a fixture aponta para um ativo existente e o E2E exige `naturalWidth > 0`. A exceção foi persistida somente para essa regra no arquivo `client-ticket-detail.html`; nenhuma regra global foi desabilitada.

O briefing de superfície em `.impeccable/surfaces/src-app-features-workspace-client.md` registra o modo Operate. `DESIGN.md`, `src/styles.css` e `.impeccable/design.json` permanecem preservados. O sidecar de design já estava desatualizado; sua atualização fica separada desta entrega.
