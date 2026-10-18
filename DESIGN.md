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
typography:
  display:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(2.5rem, 5.1vw, 5rem)'
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: '-0.04em'
  display-stacked:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(2.5rem, 6.7vw, 4.5rem)'
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: '-0.04em'
  display-mobile:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(2rem, 8.7vw, 3.25rem)'
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(2rem, 3.65vw, 3.5rem)'
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: '-0.04em'
  title:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '1.25rem'
    fontWeight: 700
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
    fontSize: '1.375rem'
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: '-0.025em'
  brand:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '1.375rem'
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: '-0.035em'
rounded:
  surface: '16px'
  control: '99px'
  deadline-list: '12px'
  status: '5px'
  menu-top: '24px'
spacing:
  section: 'clamp(72px, 8vw, 128px)'
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
    textColor: '{colors.pri-d}'
    typography: '{typography.label}'
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

A Nivelo conecta prazos, atendimento e comprovação por uma linguagem clara e precisa. Manrope dá unidade aos títulos, à leitura e aos controles; o azul-noite estabelece estrutura, o azul corporativo sinaliza ações e a luz turquesa traz a assinatura óptica da marca. A identidade segue a escolha C — Faixa de luz, aprovada pelo usuário, com a composição da landing registrada no briefing da superfície.

Superfícies claras acolhem a informação mais densa. Divisórias, alinhamentos e texto explícito explicam a relação entre etapas e estados. Refração e movimento criam atmosfera sem carregar o conteúdo: títulos, ações e avisos continuam em HTML, legíveis sobre o fundo estático.

Este arquivo é a fonte da verdade visual da landing implementada. Os tokens foram extraídos de `src/styles.css` e dos componentes em `src/app/landing/`. O documento histórico `docs/DESIGN_SYSTEM.md` descreve a proposta de telas internas ainda não implementadas; ele não substitui estes tokens. A prancha de identidade fixa também o slate de marca, enquanto os textos de apoio atuais usam as variantes legíveis extraídas acima.

**Key Characteristics:**

- Manrope local em todos os papéis, com algarismos tabulares para prazos e identificadores.
- Azul-noite estrutural, azul de ação e turquesa luminoso associado ao símbolo.
- Controles em cápsula, superfícies arredondadas e grupos abertos separados por linhas.
- Informação operacional acompanhada de rótulos, contexto e identificação dos exemplos.
- Movimento discreto, opcional e substituível pela composição estática.

## Colors

A paleta combina a profundidade do azul-noite com azuis claros de apoio e verde operacional. Os nomes abaixo correspondem às chaves normativas do frontmatter e às variáveis CSS homônimas.

### Primary

- **Azul corporativo (`pri`)**: ações principais, ícones, destaques de títulos e indicadores ativos. `pri-d` é a variante de hover e de texto sobre `pri-bg`.
- **Azul informativo (`pri-bg`)**: estado amigável do chamado, prazo em andamento e feedback suave do botão secundário.

### Secondary

- **Turquesa do símbolo (`turquoise`)**: ponto de disponibilidade e luz da composição. O ciano luminoso (`cyan`) destaca títulos sobre azul-noite e o foco no hero.
- **Verde operacional (`operational`)**: cor da identidade. Os componentes de prazo cumprido usam o verde mais escuro (`grn`), o fundo (`grn-bg`) e o texto (`grn-t`) para manter leitura em tamanho pequeno.

### Neutral

- **Azul-noite (`navy` / `ink`)**: estrutura escura, títulos e texto principal.
- **Branco (`sf`) e off-white (`bg`)**: superfícies de leitura e alternância entre seções.
- **Apoio (`ink2`) e metadados (`ink3`)**: descrições, contexto, horários e legendas.
- **Divisórias (`line`) e bordas de controle (`line2`)**: delimitam grupos sem elevar cada item a um cartão.
- **Apoio sobre azul-noite (`on-navy`)**: descrições do fluxo e informações do rodapé.

**The Estado Legível Rule.** Todo estado tem rótulo textual. O turquesa luminoso e o verde da prancha não substituem as variantes escuras de texto em superfícies claras.

## Typography

**Display Font:** Manrope, com Arial e sans-serif de fallback.
**Body Font:** Manrope, na mesma pilha.

O arquivo variável local oferece pesos de 400 a 800, com `font-display: swap`. Não há chamada externa de fonte em runtime. Números e identificadores mantêm Manrope com `font-variant-numeric: tabular-nums`; a classe histórica `mono` não usa uma família monoespaçada.

- **Display**: título principal amplo e compacto. A versão padrão recebe ajuste para `4.7vw` até 1200 px; até 900 px usa `display-stacked`, e até 600 px usa `display-mobile`.
- **Headline**: títulos de seção com variações próprias em benefícios, perfis e encerramento. Até 600 px, o título genérico usa `clamp(1.85rem, 7.5vw, 2.5rem)`.
- **Title**: títulos de grupo; benefícios e capacidades usam a variação de `1.1875rem`.
- **Body / lead**: leitura principal e aberturas; o lead genérico limita a linha a 65 caracteres e passa a `1rem` até 600 px.
- **Action / label**: controles e informação de desenvolvimento. As ações da hero usam 14 px; avisos de desenvolvimento, legendas dos três prazos e metadados da barra do exemplo usam pelo menos 12 px, inclusive no celular. O mínimo de toque permanece separado do tamanho da letra.
- **Preview body / meta**: conteúdo e metadados do exemplo de chamado, mantidos legíveis quando as colunas empilham.

**The Uma Família Rule.** Usar Manrope para manter a identidade. Não restaurar IBM Plex a partir do protótipo histórico.

## Layout

A largura de conteúdo é `min(1440px, calc(100% - 112px))`. Os recuos passam a 32 px por lado até 1100 px e a 20 px por lado até 600 px. A separação principal entre seções usa o token fluido `section`.

Grupos abertos e divisórias organizam benefícios, capacidades e perfis. A demonstração de chamado concentra a densidade dentro de uma superfície própria; textos de contexto permanecem próximos dela. A hierarquia não depende de cartões repetidos em toda a página.

Até 900 px, a navegação desktop dá lugar ao menu móvel, as principais composições empilham e o fluxo passa a duas colunas. Até 600 px, benefícios, fluxo, capacidades, perfis e FAQ passam a uma coluna. Abaixo de 400 px, as linhas de prazo do exemplo empilham o estado sob a descrição. Abaixo de 360 px, as ações do hero se empilham. A composição específica do primeiro viewport e a referência aprovada estão em `.impeccable/surfaces/src-app-app-html.md`.

A altura mínima da hero considera também `100svh`, sem limitar o crescimento necessário ao conteúdo. Em telas de até 700 px de altura, os recuos verticais e os intervalos diminuem para manter título, descrição e ações visíveis. No celular horizontal entre 601 e 900 px de largura e até 500 px de altura, título e apoio ficam lado a lado. A ordem das seções permanece a mesma; benefícios, fluxo e capacidades usam descrições concisas, sem repetir os problemas em uma segunda legenda.

## Elevation & Depth

A página usa principalmente contraste tonal e bordas finas. A cápsula de navegação recebe sombra suave; diálogo e menu móvel usam a sombra de overlay. O exemplo de chamado permanece plano, com borda. O token CSS `shadow-preview` existe, mas não é aplicado à superfície atual.

A hero usa o vídeo fornecido pelo usuário como fundo decorativo em um player HTML nativo. O MP4 de 1280 × 720, 24 fps e 8,5 s tem uma mistura suave de 1,5 s entre o final e o início para repetir sem corte. O vídeo fica sem áudio, preenche a área com `object-fit: cover` e mantém o gradiente escuro para leitura, reforçado na região do texto no celular e em telas baixas. O poster WebP corresponde ao primeiro quadro e permanece visível até a reprodução começar, com movimento reduzido ou quando o vídeo não puder tocar. A reprodução inicia após a hidratação, pausa fora da tela e em aba oculta e libera os recursos ao desmontar. A entrada do vídeo usa uma transição de opacidade de 0,6 s.

## Shapes

Controles principais e navegação têm contorno de cápsula. O exemplo de chamado e o diálogo usam o raio de superfície. O menu móvel tem apenas os cantos superiores arredondados e se apoia na borda inferior da tela. Indicadores circulares conectam etapas; divisórias finas fazem a estrutura aparecer sem contornos pesados.

O símbolo obrigatório é o check em camadas fornecido na primeira imagem do usuário, vetorizado em `public/images/nivelo-symbol.svg`. Preservar geometria, proporção e suas três cores. O símbolo diferente que aparece na prancha de identidade não é a marca adotada. O logotipo combina este SVG com o nome NIVELO em texto e o descritor GESTÃO DE SLA.

## Components

### Buttons

Botões em cápsula, com altura mínima padrão de 50 px, texto de ação claro e foco visível. A variante primária usa o azul corporativo e branco; a secundária tem fundo transparente e borda. No hero escuro, a secundária usa texto e borda claros. O cabeçalho usa altura mínima de 44 px; no hero móvel, 48 px.

Hover e foco deslizam uma cópia visual do rótulo e giram a seta em 45 graus durante 450 ms, preservando uma única identificação acessível. O modo de movimento reduzido elimina esses deslocamentos. O foco global usa contorno de 3 px com offset de 5 px; sobre o hero ele usa ciano.

### Navigation

A navegação desktop vive na cápsula branca fixa e usa âncoras com área mínima de 44 px. No celular, um botão identificado abre um `dialog` nativo em formato de folha inferior, com links de pelo menos 56 px, fechamento, Escape, foco contido e retorno ao acionador. Selecionar uma seção fecha o menu e leva o foco ao destino.

### Labels and Status

O aviso de desenvolvimento é informativo e tem ponto acompanhado de texto. O estado do chamado usa azul suave com texto azul escuro. Prazos cumpridos recebem o par verde de fundo e texto; o prazo em andamento usa o par azul. Esses estados descrevem dados fictícios, não uma operação em tempo real.

### Cards and Containers

O chamado ilustrativo usa fundo branco, borda, raio de superfície e padding de 24 px, reduzido para 16 px no celular. Evidências e histórico dividem a área em duas colunas e empilham até 600 px. Perfis e benefícios são grupos abertos com filete superior. Não há campos de formulário nesta entrega.

### Availability Dialog

Um `dialog` nativo, centralizado, com largura máxima de 460 px e recuo lateral mínimo de 20 px. Recebe foco no botão Entendi, contém Tab, fecha por botão ou Escape e devolve o foco ao acionador. Explica a indisponibilidade atual; não realiza autenticação nem coleta dados.

### FAQ

Seis disclosures nativos em `details` e `summary`, com separadores, área mínima de 72 px e símbolo de mais que gira quando aberto. Permanecem operáveis por teclado; a rotação não é animada com movimento reduzido.

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
