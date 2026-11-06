---
name: Nivelo
description: Clareza para conectar prazos, atendimento e comprovação.
colors:
  pri: '#2864dc'
  pri-d: '#2054bb'
  pri-bg: '#e9f0fe'
  navy: '#10243a'
  turquoise: '#03cbd3'
  cyan: '#90e4f9'
  operational: '#19a68c'
  bg: '#f4f7fb'
  sf: '#fff'
  ink: '#10243a'
  ink2: '#4c5e73'
  ink3: '#5e7087'
  line: '#dce4ee'
  line2: '#c5d1e0'
  on-navy: '#bbccdf'
  grn: '#087a69'
  grn-bg: '#e5f6f0'
  grn-t: '#066c5b'
  danger: '#b42318'
  danger-bg: '#fef3f2'
typography:
  display:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(3.2rem, 6vw, 6rem)'
    fontWeight: 550
    lineHeight: 1.01
    letterSpacing: '-0.04em'
  display-stacked:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(3rem, 7vw, 5.6rem)'
    fontWeight: 550
    lineHeight: 1.01
    letterSpacing: '-0.04em'
  display-mobile:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(2.3rem, 9.3vw, 3.6rem)'
    fontWeight: 550
    lineHeight: 1.01
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(2.2rem, 4.5vw, 4.4rem)'
    fontWeight: 550
    lineHeight: 1.02
    letterSpacing: '-0.035em'
  headline-mobile:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(2.1rem, 8.5vw, 3.1rem)'
    fontWeight: 550
    lineHeight: 1.02
    letterSpacing: '-0.035em'
  title:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '1.25rem'
    fontWeight: 550
    lineHeight: 1.35
    letterSpacing: '-0.025em'
  body:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '1.0625rem'
    fontWeight: 400
    lineHeight: 1.75
  action:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 600
    lineHeight: 1.5
  caption:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.65
  preview-body:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.45
  preview-meta:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.6
  role-action:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(1.6rem, 2.8vw, 2.25rem)'
    fontWeight: 550
    lineHeight: 1.35
    letterSpacing: '-0.025em'
  brand:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '1.375rem'
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: '-0.035em'
rounded:
  media: '4px'
  surface: '16px'
  control: '99px'
  deadline-list: '12px'
  status: '5px'
  menu-top: '24px'
spacing:
  section: 'clamp(72px, 8vw, 128px)'
  landing-section: 'clamp(80px, 8vw, 128px)'
  button-block: '13px'
  button-inline: '23px'
  sheet: '24px'
  sheet-mobile: '16px'
  dialog: '36px'
  dialog-compact: '28px'
components:
  button-primary:
    backgroundColor: '{colors.pri}'
    textColor: '{colors.sf}'
    typography: '{typography.action}'
    rounded: '{rounded.control}'
    padding: '13px 23px'
  button-primary-hover:
    backgroundColor: '{colors.pri-d}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.navy}'
    typography: '{typography.action}'
    rounded: '{rounded.control}'
    padding: '13px 23px'
  button-secondary-hover:
    backgroundColor: '{colors.pri-bg}'
  development-label:
    textColor: '{colors.ink2}'
    typography: '{typography.caption}'
  ticket-status:
    backgroundColor: '{colors.pri-bg}'
    textColor: '{colors.pri-d}'
    rounded: '{rounded.status}'
    padding: '3px 8px'
  ticket-sheet:
    backgroundColor: '{colors.sf}'
    textColor: '{colors.ink}'
    rounded: '{rounded.surface}'
    padding: '{spacing.sheet}'
  availability-dialog:
    backgroundColor: '{colors.sf}'
    textColor: '{colors.ink}'
    rounded: '{rounded.surface}'
    padding: '{spacing.dialog}'
---

# Design System: Nivelo

## Overview

**Creative North Star: "Clareza para agir"**

A Nivelo conecta prazos, atendimento e comprovação por uma linguagem clara e precisa. Manrope dá unidade aos títulos, à leitura e aos controles; o azul-noite estabelece estrutura, o azul corporativo sinaliza ações e o turquesa mantém a assinatura da marca. A identidade estabelecida na escolha C — Faixa de luz permanece. Em 31/10/2026, o usuário substituiu a composição A — Fluxo de luz pela referência Isoline, da 8B, com sua gravação como autoridade de movimento. A composição dessa landing pertence ao briefing da superfície; não determina o arranjo das futuras telas operacionais.

Superfícies claras acolhem a informação densa. Contornos em camadas, figuras recortadas e faixas coloridas dão profundidade à apresentação; divisórias, alinhamentos e texto explícito explicam etapas e estados. Títulos, ações e avisos continuam em HTML. O movimento acompanha a rolagem nativa e tem apresentação estática equivalente.

Este arquivo registra o sistema da landing implementada. A paleta e os primitivos globais estão em `src/styles.css`; `landing-chapters.css` mantém a base compartilhada e `isoline.css`, importado depois, define a composição e as substituições atuais de tipo, largura e forma. Os componentes reutilizáveis ficam em `src/app/shared/ui/` e os capítulos em `src/app/features/landing/components/`. O documento `docs/DESIGN_SYSTEM.md` descreve o protótipo histórico das telas internas ainda não implementadas. A referência atual, suas atribuições e evidências estão em `docs/ISOLINE_REFERENCE.md`; os registros de Fluxo de luz e do refinamento anterior de movimento permanecem como histórico.

**Key Characteristics:**

- Manrope local em todos os papéis, com algarismos tabulares para prazos e identificadores.
- Azul-noite estrutural, azul de ação, turquesa e verde operacional em camadas.
- Controles em cápsula, mídia com cantos discretos e grupos abertos separados por linhas.
- Informação operacional acompanhada de rótulos, contexto e identificação dos exemplos.
- Movimento reversível de rolagem, opcional e substituível pela composição estática.

## Colors

A paleta preserva os tons da identidade Nivelo. As chaves do frontmatter correspondem às variáveis Tailwind `--color-*`; por exemplo, `pri` é consumido por `bg-pri`, `text-pri` e `border-pri`.

### Primary

- **Azul corporativo (`pri`)**: ações principais, seleção de perfil e camadas dos contornos. `pri-d` atende ao hover, ao texto sobre azul suave e ao painel amplo de benefícios.
- **Azul informativo (`pri-bg`)**: estados do chamado, fundo da simulação local e apoio dos recortes de pessoas.

### Secondary

- **Turquesa do símbolo (`turquoise`) e ciano luminoso (`cyan`)**: assinatura da marca e camadas claras dos contornos.
- **Verde operacional (`operational`)**: camadas de arte. Prazos cumpridos usam o verde escuro (`grn`), seu fundo (`grn-bg`) e texto (`grn-t`) para leitura pequena; faixas amplas também usam o verde escuro.

### Neutral

- **Azul-noite (`navy` / `ink`)**: títulos, texto principal, camadas profundas e rodapé.
- **Branco (`sf`) e off-white (`bg`)**: superfícies e alternância de capítulos. O campo dos cartazes tem um tom local de apoio, sem ampliar a paleta normativa da marca.
- **Apoio (`ink2`) e metadados (`ink3`)**: descrições, horários, ressalvas e identificação das imagens.
- **Divisórias (`line`) e bordas (`line2`)**: grupos de informação, tabela contratual e controles.
- **Apoio sobre azul-noite (`on-navy`)**: informação secundária do rodapé.

**The Estado Legível Rule.** Todo estado tem rótulo textual. O turquesa luminoso e o verde da prancha não substituem as variantes escuras de texto em superfícies claras.

## Typography

**Display Font:** Manrope, com Arial e sans-serif de fallback.
**Body Font:** Manrope, na mesma pilha.

A fonte variável local oferece pesos de 400 a 800, com `font-display: swap`, sem chamada externa em runtime. A referência atual usa peso intermediário (550) nos títulos amplos, conservando os controles em semibold. Números e identificadores usam algarismos tabulares; `--font-sans` e `--font-mono` mantêm a mesma família.

- **Display / display-stacked / display-mobile**: os três valores do frontmatter descrevem a abertura atual em desktop, tablet e abaixo de 768 px. A entrelinha compacta e o tracking negativo aproximam a composição da referência. Em telas de até 600 px de altura e largura a partir de 768 px, o título usa 36 px.
- **Headline / headline-mobile**: base dos títulos dentro de `main`, com mudança em 768 px. Benefícios, histórico e outros capítulos têm ajustes locais de escala conforme o papel da composição; não são novos padrões globais.
- **Title / role-action**: títulos de grupo e título da simulação de perfil. Os títulos de cartaz e de registro usam escalas locais maiores.
- **Body / lead**: leitura principal e abertura dos capítulos. O lead mantém entrelinha de 1,75 e passa de 17 para 16 px abaixo de 768 px. A descrição da abertura usa 19 px com entrelinha de 1,55, reduzida para 16 px no celular.
- **Action / label / caption**: controles, rótulos informativos e legendas. O aviso da abertura usa 13 px, ou 12 px no celular; os rótulos dos recortes e da pequena janela de vídeo são específicos desses ativos, sem criar uma escala geral menor.
- **Preview body / meta**: leitura e metadados do exemplo ilustrativo. O chamado usa `caption` nos metadados e mantém os estados acompanhados de texto.
- **Brand**: NIVELO e seu descritor no cabeçalho preservado. A palavra ampla do rodapé é uma composição local, não uma nova marca gráfica.

**The Uma Família Rule.** Usar Manrope para manter a identidade. Não restaurar IBM Plex a partir do protótipo histórico.

## Layout

A largura atual dos capítulos é `calc(100% - 8vw)`, limitada a 1500 px, com centralização automática. Abaixo de 768 px, o recuo é de 20 px por lado. O espaçamento vertical da landing usa `landing-section`; abaixo de 768 px, os capítulos usam 76 px. A base compartilhada anterior permanece no CSS, mas as regras posteriores de `isoline.css` determinam esses valores atuais.

A abertura combina texto à esquerda, figura recortada e contornos à direita. A arte tem uma moldura sticky de `100svh`, com mínimo de 740 px no desktop e 800 px no tablet. No celular, a figura ocupa a parte superior e o conteúdo fica abaixo; a abertura cresce conforme a leitura exigir. Telas de até 600 px de altura têm composição própria, com ações lado a lado. A navbar e o menu conservam a implementação anterior, com navegação desktop a partir de 1024 px.

Cartazes, retratos e fotografias usam deslocamentos graduais entre itens no desktop. Os cartazes passam a uma coluna abaixo de 768 px, alternando a posição lateral; os retratos viram linhas de arte e texto. As evidências mantêm a escada no celular, com fotografias maiores e recuos de 2%, 4% e 6%; a última fotografia usa toda a largura do degrau em formato 2:1. Abaixo de 360 px, foto e texto empilham para preservar a leitura. As cordas das evidências usam 36 px, espaço próprio acima das fotos e subida de entrada limitada a 24 px no celular e em paisagem baixa. O histórico combina mostrador sticky e lista no desktop. Abaixo de 768 px, ou até 1023 px em telas de até 600 px de altura, o mostrador fica no fluxo normal da seção, sem sticky: uma área quadrada de até 320 px, limitada à largura disponível, mantém o círculo inteiro e sem recorte. A tabela contratual mantém três colunas em telas amplas e empilha as células no celular. A plataforma passa a uma coluna abaixo de 1024 px. As três abas de perfil continuam visíveis; seu painel empilha abaixo de 768 px. O chamado conserva ajustes próprios em 640 e 400 px.

Na seção do fluxo, abaixo de 768 px ou em paisagem até 1023 × 600 px, as faixas animadas se encontram em duas metades de 50% e cobrem os textos inicialmente. Cada par se afasta para as bordas conforme sua própria posição no viewport, revelando a etapa antes de chegar à região central; a subida reverte o movimento. Sem a camada animada ou com movimento reduzido, as faixas permanecem nas bordas e o texto fica visível. A composição desktop mantém o comportamento anterior.

O movimento expande os contornos da abertura, recua figura e texto, faz os cartazes descerem e oscilarem, muda as camadas e cores do mostrador, abre doze faixas do fluxo e altera as faixas de prazos. As entradas usam 800 ms para partes, 900 ms para títulos, 1100 ms para máscaras de imagem e defasagem de 70 ms, limitada a 280 ms. A rolagem contínua é reversível e não captura a roda do mouse. O driver compartilha observação, listener passivo e lote por frame fora da atualização Angular; a geometria vem de molduras estáveis. A inicialização após hidratação, a limpeza e os fallbacks preservam o HTML legível. Foco encerra entradas pendentes e movimento reduzido apresenta a arte estática. Valores e limites de verificação estão em `docs/ISOLINE_REFERENCE.md`.

## Elevation & Depth

A profundidade vem principalmente dos contornos SVG sobrepostos, recortes de pessoas e campos tonais. As geometrias de Isoline foram adaptadas sob licença MIT, com atribuição preservada. São arte da apresentação, separada do símbolo obrigatório da Nivelo.

A navegação conserva `shadow-header`; diálogo e menu usam `shadow-dialog`. A janela do chamado e a moldura do navegador de celular usam `shadow-preview`. Cartazes e fotografias têm sombras locais discretas para sugerir impressos suspensos: respectivamente `0 14px 24px -16px rgb(16 36 58 / 38%)` e `0 16px 24px -18px rgb(16 36 58 / 40%)`. Esses recortes não transformam todos os grupos em cartões elevados.

O vídeo de luz existente ocupa agora uma pequena janela na abertura, com poster e fallbacks preservados. Não é mais o fundo amplo da página. Continua decorativo, sem áudio, com reprodução após hidratação, pausa fora da tela ou em aba oculta e liberação ao desmontar. Pessoas geradas por IA e a cena de manutenção permanecem identificadas como ilustrativas, sem representar equipe, clientes ou atendimentos reais.

## Shapes

A navegação e os controles principais preservam a cápsula. A janela externa da plataforma, a simulação de perfil e a janela de vídeo usam cantos discretos (`media`); o chamado e o diálogo mantêm `surface`. As abas de perfil são retas e delimitadas por uma linha inferior. A moldura do celular usa raio de 24 px e borda de 5 px. Cartazes e fotografias são retangulares, com pequenos prendedores; contornos fechados e contornos em linha formam a assinatura visual desta composição.

O símbolo obrigatório é o check em camadas da primeira imagem do usuário, vetorizado em `public/images/nivelo-symbol.svg`. Preservar geometria, proporção e suas três cores. O símbolo diferente da prancha não é a marca adotada. O logotipo combina o SVG com NIVELO em texto e o descritor GESTÃO DE SLA.

## Components

### Buttons

As diretivas `appButton`, `appButtonPrimary` e `appButtonSecondary` mantêm cápsula, alinhamento, peso e transição de cor. A altura mínima das ações principais é 50 px; no cabeçalho, 44 px. Padding é ajustado por contexto. A variante primária usa azul corporativo e branco; a secundária usa texto azul-noite e borda `line2`, com azul suave no hover. A variante inversa continua disponível no primitivo, mas a abertura clara usa a padrão.

Hover e foco deslizam uma cópia decorativa do rótulo e giram a seta em 45 graus durante 450 ms, mantendo uma única identificação acessível. A resposta de pressão usa escala de 0,97 por 140 ms. Movimento reduzido elimina esses deslocamentos. O foco global tem contorno de 3 px e offset de 5 px.

### Navigation

A cápsula branca fixa preserva símbolo, texto e âncoras. Links desktop têm área mínima de 44 px. Abaixo de 1024 px, o botão abre um `dialog` nativo como folha inferior, com links de pelo menos 56 px, Escape, foco contido e retorno ao acionador. Selecionar uma âncora fecha o menu e leva o foco ao destino.

### Labels and Status

Disponibilidade e exemplos são avisos informativos. O chamado usa azul suave com texto escuro; prazos cumpridos usam o par verde e o prazo em andamento usa azul. As faixas amplas da plataforma reiteram os três prazos com rótulos e estados. Cor nunca substitui o texto. Rótulos pontuais da composição não criam um padrão obrigatório de sobrancelha decorativa para futuras superfícies.

### Cards and Containers

O chamado tem fundo branco, borda, raio de superfície e padding de 24 px, reduzido para 16 px abaixo de 640 px. Sua janela externa tem cantos de 4 px. Evidências e histórico internos dividem duas colunas a partir de 640 px. A tabela de contratos relaciona contrato, chamado, compromissos, histórico e evidências; não apresenta preços. Não há campos de formulário nesta entrega.

A diretiva compartilhada `appCard` reúne os padrões de apresentação da composição atual: `benefit` organiza o bloco editorial de benefícios; `feature` define a hierarquia de título e descrição das funcionalidades; `role` organiza os retratos e seus recuos responsivos. A diretiva se aplica aos elementos existentes (`div`, `p` e `figure`), mantendo sua semântica e os identificadores usados pelo movimento. As variantes usam utilitários Tailwind e não acrescentam contêineres ao DOM.

### Section Headings

Os 11 títulos dos capítulos usam `appSectionHeading`. A variante padrão `responsive` centraliza a escala móvel/desktop; `statement` conserva o destaque branco dos benefícios; `history` preserva a escala específica do histórico. Entrelinha, peso 550 e tracking são compartilhados. Restrições locais de medida, como a largura do título de acesso móvel, permanecem no template. Títulos do hero, diálogo e chamado têm papéis próprios e conservam seus estilos específicos.

### Role Tabs

Gestor, Técnico e Cliente têm retratos ilustrativos seguidos de três abas. A seleção usa azul corporativo com texto branco; as demais opções têm fundo transparente e feedback suave no hover. Setas, Home e End mudam aba e foco. Cada painel identifica sua aba e anuncia o resultado local; simular e reiniciar não persistem dados nem enviam arquivos.

### Contours and Suspended Prints

Contornos SVG decorativos, sem captura de ponteiro, aparecem na abertura, no mostrador, nos recortes de perfis e no encerramento. Cartazes de resposta, atendimento em campo e resolução mostram todos os compromissos em HTML e acompanham a rolagem com queda e balanço. A antiga cena de linha de progresso de `180svh` foi substituída. Movimento reduzido e ausência das APIs mantêm cartazes e textos disponíveis.

### Availability Dialog

Um `dialog` nativo centralizado, com largura máxima de 460 px e recuo lateral mínimo de 20 px. Recebe foco no botão Entendi, contém Tab, fecha por botão ou Escape e devolve o foco ao acionador. Explica a indisponibilidade atual, sem autenticação ou coleta de dados.

### FAQ

Seis disclosures nativos em `details` e `summary`, com separadores, área mínima de 72 px e símbolo de mais que gira quando aberto. Permanecem operáveis por teclado; movimento reduzido elimina a rotação animada.

### Access Demo — FRONTEND 05

As rotas de entrada e sessão expirada compartilham `AccessLayout`: fundo `bg`, superfície branca e uma foto corporativa ilustrativa ocupando metade esquerda a partir de 1024 px. Em telas menores, a foto some e o formulário ocupa uma coluna. No login, o símbolo e o nome da marca ficam centralizados acima do título. O conteúdo de acesso tem largura máxima de 400 px, recuo mínimo de 20 px e altura natural para permitir rolagem em telas baixas.

No desktop, o contorno externo usa 16 px e a superfície acompanha a altura útil da janela. O conteúdo permanece centralizado entre o cabeçalho e o rodapé, com respiro vertical fluido de 24 a 36 px no `main`. Os intervalos do login são mais compactos a partir de 1024 px, permitindo que o estado inicial caiba em 1280 × 720 e 1366 × 768 sem rolagem. Campos de 52 px, alvos dos controles e espaços para mensagens obrigatórias são preservados. Telas muito baixas, zoom e avisos adicionais mantêm rolagem natural quando necessária.

Os títulos de acesso usam Manrope 600, 30 px no celular e 36 px a partir de 640 px, entrelinha 1,2 e tracking −0,025 em. Rótulos de 14 px ficam acima de campos de 52 px, com raio de 10 px. Os campos usam borda `ink3` a 80%, fundo branco e foco `pri`. Mensagens e bordas de validação usam `danger`. A ação principal reutiliza `ButtonPrimary`, com altura de 52 px no formulário. O carregamento muda o rótulo e desabilita o conjunto, sem alterar a largura do botão; ao terminar, qualquer e-mail válido e senha preenchida seguem para a sessão de demonstração local.

A sessão fictícia usa cabeçalho branco, fundo `bg` e coluna central de até 1100 px. Perfil e explicação de expiração ficam em superfícies tonais, sem sombras. O menu do usuário é a única superfície flutuante: largura de 280 px, raio de 12 px e `shadow-header`. Os alvos do menu têm pelo menos 48 px. A entrada não tem coreografia de carregamento; o movimento se limita ao feedback dos controles e ao indicador de espera, respeitando movimento reduzido.

Todas essas telas identificam a demonstração e os dados fictícios. O acesso real à plataforma permanece indisponível. O formulário de entrada não verifica credenciais e não armazena os valores enviados. O roteiro e os limites funcionais estão em `docs/FRONTEND_05_ACCESS.md`.

### Internal Workspace — FRONTEND 04

Shell em modo Operate: sidebar de 232 px e cabeçalho sobre `bg`, área principal branca com borda `line` a 70%, raio de 16 px e recuo externo de 8 px. A área de leitura tem largura máxima de 1280 px, padding lateral de 16 px no celular e 24 px a partir de 640 px. O cabeçalho tem altura mínima de 80 px, cresce com o seletor em duas linhas no celular e não usa sombra. A sidebar é substituída por um diálogo lateral abaixo de 1024 px.

Títulos usam Manrope 600, 26–28 px e tracking −0,03 em; texto de interface 14 px, apoio 12 px. Navegação ativa usa superfície branca e `pri-d`. Botões e menu do usuário reutilizam os componentes existentes; controles têm alvo mínimo de 44 px. Tabelas tornam-se listas abaixo de 768 px. Estados têm rótulos textuais; atribuído usa ciano suave, resolvido usa o verde existente, e a violação ilustrativa usa `danger` sobre `danger-bg`. Os exemplos são identificados em cada página.

Os perfis têm navegação e conteúdo distintos, sem serem barreiras de autorização. A implementação e os limites das prévias estão documentados em `docs/FRONTEND_04_LAYOUT.md`. A composição foi herdada da marca com a direção `framed-sheet`; não substitui o sistema da landing ou do acesso.

## Do's and Don'ts

### Do:

- **Do** usar os tokens extraídos acima e Manrope local nos papéis documentados.
- **Do** preservar o check em camadas da primeira imagem do usuário, com sua geometria e suas cores.
- **Do** acompanhar estados de texto e manter as variantes escuras para leitura sobre fundos claros.
- **Do** manter foco visível, teclado, retorno de foco e preferência por redução de movimento.
- **Do** identificar exemplos e imagens ilustrativas junto do conteúdo e comunicar a indisponibilidade atual.
- **Do** preservar a imagem estática e o conteúdo semântico quando a camada animada não puder executar.

### Don't:

- **Don't** restaurar a antiga identidade FlowSLA ou substituir a marca pelo símbolo diferente da prancha.
- **Don't** usar cor, imagem ou animação como único veículo de informação.
- **Don't** transformar exemplos ilustrativos em métricas reais, clientes, promessas de prazo ou disponibilidade do sistema.
- **Don't** aplicar a sombra de diálogo a todos os grupos da página.
- **Don't** tratar o protótipo histórico das telas internas como implementação existente.
