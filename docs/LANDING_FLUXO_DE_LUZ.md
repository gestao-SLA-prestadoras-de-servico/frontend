# Landing Nivelo — A · Fluxo de luz

A composição A — Fluxo de luz foi aprovada em 30/10/2026 para ampliar a landing pública em `/`. A implementação mantém Angular, prerenderização e hidratação com repetição de eventos. A identidade, a navbar, o vídeo de fundo e o poster existentes foram preservados. [PRODUCT.md](../PRODUCT.md) descreve o produto e seus limites; [DESIGN.md](../DESIGN.md) registra o sistema visual, e o [briefing da superfície](../.impeccable/surfaces/src-app-app-html.md) registra a direção.

## Composição implementada

| Ordem | Âncora | Papel na narrativa |
|---|---|---|
| 1 | `#inicio` | Hero com promessa editorial, descrição, duas ações e aviso de desenvolvimento. |
| 2 | `#beneficios` | Conexão entre informação, acompanhamento e organização. |
| 3 | `#prazos` | Explicação de resposta, atendimento em campo e resolução, sem prometer durações. |
| 4 | `#contratos` | Compromissos associados ao contrato e ligação com o chamado ilustrativo. |
| 5 | `#como-funciona` | Configure, Distribua, Registre e Valide. |
| 6 | `#plataforma` | Visão contextual do chamado #1042, com prazos, responsável e registros. |
| 7 | `#evidencias` | Foto ilustrativa e explicação do registro do serviço pelo celular. |
| 8 | `#historico` | Sequência de ações, horários e responsáveis do mesmo exemplo. |
| 9 | `#perfis` | Abas Gestor, Técnico e Cliente com atribuições previstas e simulações locais. |
| 10 | `#celular` | Uso previsto pelo navegador do celular, com internet. |
| 11 | `#faq` | Seis perguntas sobre público, SLA, prazos, evidências, uso móvel e disponibilidade. |
| 12 | `#disponibilidade` | Encerramento e acesso ao diálogo de indisponibilidade. |

O rodapé mantém a identificação “Projeto Integrador 2026.2”. A navbar conserva os links Benefícios, Como funciona, Plataforma e FAQ, a ação Disponibilidade, o menu móvel e seus comportamentos de foco. Não foi ampliada para enumerar todos os capítulos.

## Demonstração e limites factuais

O chamado #1042 é uma manutenção de climatização com dados fictícios. Está **em atendimento**: resposta e atendimento em campo cumpridos; resolução em andamento. A sequência ampliada mostra abertura às 08:10 por Marina, resposta às 08:25 por Rafael, início às 09:40 por João e evidências às 10:15 por João. Os horários explicam a narrativa e não são metas contratuais ou resultados de operação real.

As abas permitem simular distribuição ao técnico, acréscimo de uma evidência de exemplo e validação da solução. A ação pode ser reiniciada, e trocar de perfil reinicia sua simulação. Tudo fica no estado local da página: nenhum dado de produto é persistido, nenhum arquivo é enviado e nenhuma informação é transmitida. A validação do cliente usa um cenário independente, identificado no painel, e mantém o chamado principal em atendimento.

A página apresenta funcionalidades previstas. Não implementa API de produto, autenticação, coleta de contatos ou telas internas operacionais. O diálogo comunica que o sistema ainda está indisponível. Não há aplicativo nativo, uso offline, depoimentos, clientes, certificações, preços ou resultados quantitativos publicados como fatos.

## Referências e ativos

- O [comp aprovado](references/nivelo-opcao-a-fluxo-de-luz.png) foi arquivado sem alterações. Seu [sidecar](references/nivelo-opcao-a-fluxo-de-luz.png.json) preserva a origem e a autorização. A imagem não é exibida no site; os textos e números nela não substituem os fatos confirmados do produto.
- O [símbolo SVG](../public/images/nivelo-symbol.svg), a Manrope local, o [vídeo MP4](../public/videos/nivelo-hero-loop.mp4) e o [poster WebP](../public/images/nivelo-hero-poster.webp) mantêm a identidade anterior. O poster também dá atmosfera estática ao fluxo e ao encerramento.
- A [foto complementar de manutenção](../public/images/manutencao-ilustrativa.png) foi gerada pela ferramenta integrada `image_gen` em 30/10/2026 e preservada em PNG, sem conversão. O [prompt exato](references/manutencao-ilustrativa.prompt.txt), o [sidecar](../public/images/manutencao-ilustrativa.png.json) e os metadados embutidos no PNG registram sua origem. A legenda visível informa “Imagem gerada por IA · ilustrativa”. A imagem não representa equipe, cliente ou atendimento real.
- As imagens menores de evidências já existentes continuam ilustrativas. A relação entre a prancha, a marca e os ativos está em [NIVELO_BRAND.md](NIVELO_BRAND.md).

## Movimento, responsividade e acessibilidade

Os capítulos usam largura máxima de 1328 px e recuos laterais de 20, 32 e 56 px conforme o viewport. O fluxo passa de quatro para duas e depois uma coluna. Foto e texto empilham abaixo de 1024 px; os painéis de perfil empilham abaixo de 640 px. O chamado quebra suas linhas de prazo abaixo de 400 px. Títulos e espaçamentos do hero se ajustam também à altura disponível. O token `caption` define metadados de 13 px na área principal; navbar e marca textual conservam sua tipografia anterior.

A cena dos três prazos ocupa `180svh` e mantém sua área interna em `100svh` com sticky apenas em telas com largura ≥1024 px e altura ≥700 px, quando o movimento é permitido. Uma animação pausada da Web Animations API recebe o progresso da rolagem, com atualização via `requestAnimationFrame` enquanto a cena está visível. Os três compromissos seguem no HTML. Em telas estreitas, baixas ou com movimento reduzido, a apresentação é estática e não reserva essa altura adicional.

As entradas de seção usam opacidade e deslocamento de 20 px por 700 ms, com defasagem de 70 ms e o `--ease-out` existente. Executam uma vez, depois de `afterNextRender`; o HTML de prerenderização permanece visível. Foco no conteúdo cancela a entrada. Controles novos usam resposta de pressão de 140 ms; movimento reduzido remove esse deslocamento. Observadores, listeners, frames e animações recebem cleanup ao desmontar.

O vídeo decorativo conserva sua reprodução nativa, poster e tratamento de movimento reduzido. O atributo `poster` também está presente no player. O menu e o diálogo mantêm Escape, contenção e retorno de foco. As abas usam relações ARIA, seleção com setas, Home e End e mensagens acessíveis de resultado. O FAQ continua com seis elementos nativos `details`/`summary`. Estados de prazo usam texto além de cor.

## Registro de verificação

A versão após as correções passou em `npm run build`, com a rota `/` prerenderizada e bundle inicial de 402,44 kB (transferência estimada de 96,57 kB), e em `npm run lint`. `npm test -- --watch=false` passou em 20 testes de sete arquivos antes do último ajuste, restrito a CSS e asserções E2E. Após esse ajuste, `npx playwright test --workers=1 --reporter=list` passou em 38 testes (19 em Chromium e 19 em Firefox), em 38,2 s. A suíte inclui asserções da resposta de pressão de `0.14s`, das propriedades `transform, background-color, color` e da duração `0s` com movimento reduzido.

Uma execução anterior com dois workers teve um timeout ao criar uma página no Firefox durante verificadores concorrentes. A repetição isolada com um worker passou integralmente; não foi registrado erro funcional nessa repetição.

A confirmação automatizada após a correção está em `tmp/fluxo-de-luz/round-2/verification.json`. Os viewports 1440 × 900, 768 × 1024, 390 × 844, 320 × 700, 844 × 390 e 1024 × 600 têm fonte carregada, nenhuma imagem quebrada, nenhum overflow horizontal e nenhum erro de navegador registrado. A amostra de textos da área principal não encontrou elementos com tamanho computado abaixo de 13 px. Há capturas completas em `1440-full.png`, `768-full.png` e `390-full.png`, além de capturas de cada capítulo em desktop e celular. A rodada anterior permanece em `round-1` para comparação.

As capturas completas usam movimento reduzido. A inspeção complementar com movimento permitido está em `round-2/motion.json` e em `scene-0.png`, `scene-0.5.png` e `scene-1.png`: a reprodução do vídeo chegou ao estado pronto, e foram registradas 32 chamadas à Web Animations API durante a navegação da página. O mesmo JSON confirma a resposta de pressão computada dos novos controles: propriedades `transform, background-color, color` e duração `0.14s`; com movimento reduzido, propriedade `none` e duração `0s`. A regra específica na camada de utilitários supera a transição de cor da diretiva compartilhada sem atingir a navbar. Esse registro complementa a cobertura funcional; não equivale a uma medição de fluidez ou orçamento de frames.

A revisão material levou a quatro ajustes: metadados principais com 13 px, contraste das descrições dos prazos, alinhamento dos extremos da linha conectada e persistência da documentação. Também foram adicionados o atributo nativo de poster e removida a transição de sombra. As capturas finais foram abertas e conferidas durante a implementação. A revisão independente encerrou com disposição **ship** e as quatro correções resolvidas, sem pendências materiais dentro desse escopo. Esse aceite é pontual e não constitui uma auditoria universal da interface.

O inspector da revisão em `round-2/report.json` registrou zero falhas e três avisos. A contagem de 13 tamanhos inclui marca, demonstrações e adaptações responsivas; o texto de apoio medido em 6,7:1 supera a referência de 4,5:1; a inferência de desalinhamento por conteúdo não corresponde aos recuos do contêiner, que são simétricos (56 px em 1440 e 32 px em 768). Os recursos visuais da referência A e da navbar original foram avaliados com exceções explícitas, sem convertê-los em regras gerais da marca. A amostragem do inspector também não capturou as entradas de 700 ms; a evidência própria de movimento registra as 32 chamadas reais e o vídeo pronto.

O sidecar de sistema `.impeccable/design.json` já apresentava defasagem antes desta ampliação e não foi atualizado incidentalmente. O frontmatter de `DESIGN.md` preserva os tokens existentes e registra a adição de `caption`; escolhas específicas de composição não foram promovidas a novas regras gerais da marca.
