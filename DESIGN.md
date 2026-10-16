---
name: FlowSLA
description: Clareza operacional para acompanhar prazos, atendimentos e evidências.
colors:
  pri: '#1976d2'
  pri-d: '#115293'
  pri-bg: '#e8f1fb'
  navy: '#0b2545'
  bg: '#f8f9fa'
  sf: '#fff'
  ink: '#1c2025'
  ink2: '#4a5260'
  ink3: '#667080'
  line: '#e3e6ea'
  line2: '#cdd3da'
  on-navy: '#b8c7da'
  grn: '#2e7d32'
  grn-bg: '#e8f5e9'
  grn-t: '#1f6023'
  ora-bg: '#fff1e2'
  ora-t: '#9a4200'
typography:
  display:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: 'clamp(2.25rem, 3.5vw, 2.75rem)'
    fontWeight: 700
    lineHeight: 1.13
    letterSpacing: '-0.035em'
  display-stacked:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: 'clamp(2.25rem, 6.5vw, 3.25rem)'
    fontWeight: 700
    lineHeight: 1.13
    letterSpacing: '-0.035em'
  headline:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: 'clamp(1.75rem, 3.3vw, 2.5rem)'
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '1.25rem'
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: '-0.01em'
  body:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.6
  action:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '1rem'
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: 1.6
  preview-body:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.45
  preview-meta:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.6
  lead-compact:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '1.0625rem'
    fontWeight: 400
    lineHeight: 1.6
  support:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.6
  role-action:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '1.375rem'
    fontWeight: 600
    lineHeight: 1.3
  brand:
    fontFamily: 'IBM Plex Sans, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 700
    lineHeight: 1
  mono:
    fontFamily: 'IBM Plex Mono, monospace'
    fontWeight: 500
rounded:
  control: '8px'
  surface: '12px'
  pill: '99px'
spacing:
  space-1: '4px'
  space-2: '8px'
  space-3: '12px'
  space-4: '16px'
  space-5: '20px'
  space-6: '24px'
  space-8: '32px'
  space-12: '48px'
  section: 'clamp(64px, 7vw, 96px)'
components:
  button-primary:
    backgroundColor: '{colors.pri}'
    textColor: '{colors.sf}'
    typography: '{typography.action}'
    rounded: '{rounded.control}'
    padding: '11px 22px'
  button-primary-hover:
    backgroundColor: '{colors.pri-d}'
  button-secondary:
    backgroundColor: '{colors.sf}'
    textColor: '{colors.pri-d}'
    typography: '{typography.action}'
    rounded: '{rounded.control}'
    padding: '11px 22px'
  button-secondary-hover:
    backgroundColor: '{colors.pri-bg}'
  chip-development:
    backgroundColor: '{colors.pri-bg}'
    textColor: '{colors.pri-d}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '4px 12px'
  card-role:
    backgroundColor: '{colors.bg}'
    textColor: '{colors.ink2}'
    rounded: '{rounded.surface}'
    padding: '28px'
  card-role-compact:
    padding: '20px'
  dialog-availability:
    backgroundColor: '{colors.sf}'
    textColor: '{colors.ink}'
    rounded: '{rounded.surface}'
    padding: '36px'
    width: 'min(460px, calc(100% - 40px))'
---

# Design System: FlowSLA

## Overview

**Creative North Star: "Clareza operacional"**

O FlowSLA usa superfícies claras, azul de ação e títulos em azul-marinho para tornar prazos, atendimento e comprovação fáceis de relacionar. IBM Plex Sans organiza a leitura; IBM Plex Mono distingue números, horários e identificadores. A linguagem é direta, com informação concreta e ornamentação contida.

A apresentação pública combina espaço entre seções com uma demonstração de produto mais densa. As cores de estado acompanham rótulos legíveis, e os exemplos e a disponibilidade atual são identificados no próprio conteúdo.

**Key Characteristics:**

- Superfícies claras e contraste entre títulos, texto e metadados.
- Azul para ações e navegação; cores semânticas acompanhadas de texto.
- Números e identificadores em IBM Plex Mono.
- Cantos discretos, divisórias finas e sombras reservadas.
- Conteúdo responsivo e demonstrações identificadas como ilustrativas.

Este registro descreve a implementação em `src/styles.css` e `src/app/landing/`, após a aprovação da opção A. O guia `docs/DESIGN_SYSTEM.md` continua como referência do protótipo mais amplo; seus componentes internos ainda não implementados não são tokens desta entrega. Os valores do frontmatter são normativos; extensões e exemplos estão em `.impeccable/design.json`.

## Colors

A paleta combina azul nítido, azul-marinho e cinzas frios, com fundos suaves para informação e estado.

- **Primária:** `pri` identifica ações, ícones e destaques. `pri-d` serve ao hover primário e ao texto sobre `pri-bg`. O fundo azul claro também sustenta mensagens de desenvolvimento.
- **Base de marca:** `navy` estrutura títulos e a faixa escura do fluxo; `on-navy` mantém o texto de apoio legível nessa faixa.
- **Neutros:** `sf` recebe o conteúdo; `bg` separa cartões e seções. `ink`, `ink2` e `ink3` distinguem texto principal, apoio e metadados. `line` é a divisória discreta; `line2` reforça contornos de controles.
- **Estados implementados:** verde indica prazo cumprido; laranja identifica atendimento em andamento. Use os pares de fundo e texto correspondentes. O prazo restante usa o par azul claro/azul escuro e um rótulo explícito.

Os tons adicionais do sidecar são amostras para visualização, não uma nova escala autorizada de cores da interface.

## Typography

IBM Plex Sans é a fonte de títulos e interface; IBM Plex Mono, com numerais tabulares, distingue identificadores, horários e durações. Arial e Consolas são fallbacks explícitos, seguidos pelas famílias genéricas. As fontes são locais, com `font-display: swap`; os pesos carregados são 400/500/600/700 para Sans e 500 para Mono.

O papel `display` pertence ao hero em duas colunas. Ao empilhar a composição, aplica-se `display-stacked` até 820 px. `headline` organiza as seções; `title` identifica grupos menores; `body` sustenta a leitura; `lead` abre seções e passa a 17 px até 600 px. Avisos de disponibilidade, navegação, rodapé e contexto dos benefícios usam o papel `support` de 14 px; os rótulos de contexto têm peso 500. Perguntas do FAQ usam 16 px/600 e entrelinha 1,5; respostas têm entrelinha 1,65 e medida máxima de 65ch. O texto do fluxo usa 16 px, entrelinha 1,65 e tracking 0,005em sobre azul-marinho. Os títulos secundários de perfis e encerramento usam a variação observada `clamp(1.75rem, 2.8vw, 2.25rem)`.

Os tamanhos são expressos em `rem`, incluindo os limites dos títulos fluidos, para acompanhar a preferência de fonte do navegador; os equivalentes em pixels abaixo pressupõem raiz de 16 px. Títulos usam tracking de -0,035em no hero, -0,025em nas seções e -0,01em nos grupos. O hero permite quebra natural de linhas; os demais títulos usam balanceamento. Parágrafos usam `text-wrap: pretty` e usam `overflow-wrap: anywhere` para que palavras extensas não ampliem as colunas com texto aumentado. A demonstração usa 14 px para eventos, títulos internos, nomes dos prazos e estados; horários, responsáveis, definições e avisos ilustrativos usam 12 px. Esses tamanhos são mantidos no celular, com empilhamento das linhas de prazo até 400 px.

## Layout

O contêiner tem largura máxima de 1180 px, com 32 px de margem lateral; até 600 px, as margens passam a 20 px. O ritmo parte da escala de espaçamento do frontmatter e de seções com padding vertical fluido.

Na landing, o hero usa colunas `1fr 1.08fr`, intervalo de 44 px e padding vertical de 72/80 px. Até 1000 px, o intervalo cai para 28 px; até 820 px, título e demonstração empilham, com intervalo de 40 px. A demonstração empilhada se limita a 620 px. Até 600 px, ações ocupam a largura disponível e o hero inicia com 32 px de padding.

O cabeçalho fixo ao rolar mede no mínimo 88 px; até 820 px, passa a 72 px e expõe um botão de menu de 44 px. As seis capacidades previstas são agrupadas em três blocos, cuja grade passa de três para duas e depois uma coluna. A seção separada de rastreabilidade foi condensada nos benefícios, na demonstração e nos perfis. Benefícios, perfis, FAQ e o registro dentro do mockup chegam a uma coluna até 600 px. Essa composição pertence à landing; novas superfícies mantêm os tokens sem copiar sua sequência de seções.

## Elevation & Depth

Fundos e divisórias organizam a maior parte da página. Cartões de perfil permanecem planos. A demonstração recebe a sombra `shadow-preview`; o diálogo usa `shadow-dialog` sobre um backdrop azul-marinho a 55%. Os valores exatos estão no sidecar e nas variáveis CSS correspondentes.

O movimento explica as interações; a demonstração permanece estática. O diálogo de disponibilidade e seu backdrop entram em 320 ms e saem em 160 ms, com opacidade e escala de 0,98 a 1. Transições discretas de `display` e `overlay` preservam a camada visual durante a saída, enquanto o fechamento nativo devolve o foco imediatamente. Navegadores sem esse recurso mantêm a abertura e o fechamento nativos. O menu móvel se revela a partir do cabeçalho em 220 ms e fecha imediatamente para retirar seus links da navegação por teclado. Botões respondem à pressão com 1 px de deslocamento e cores em 120 ms; o símbolo do FAQ acompanha a expansão em 180 ms. Todos usam `ease-out`.

Com movimento reduzido, menu e diálogo usam apenas opacidade por 100 ms, botões mantêm a resposta de cor por 100 ms, a mudança do símbolo do FAQ é imediata e a rolagem é direta. Não há loops, revelações ao rolar, bibliotecas de animação ou trabalho contínuo em JavaScript.

## Shapes

Controles usam o raio `control`, enquanto cartões e diálogo usam `surface`. A mensagem de desenvolvimento é uma pílula. O mockup conserva sua moldura de 16 px e pequenos rótulos de estado retangulares; esses detalhes não substituem os raios principais.

Divisórias e contornos têm um pixel. Ícones são SVG sem preenchimento, com traço de 1,8 px, extremidades e junções arredondadas, seguindo a cor do contexto. Use ícone e texto juntos quando o significado depender do estado.

## Components

- **Ações da landing:** “Conhecer a plataforma” é a âncora primária do cabeçalho e do hero; “Sobre a disponibilidade” abre o aviso como ação secundária. O hero informa que o acesso ainda está indisponível. O encerramento aponta ao FAQ com “Consultar dúvidas”.
- **Botões:** altura mínima de 48 px, texto semibold, raio de controle. O primário escurece no hover; o secundário ganha fundo azul claro e contorno azul. O foco compartilhado é um contorno azul de 3 px, afastado 4 px. Ações estreitas do cabeçalho usam texto de 14 px.
- **Navegação:** links de 14 px e altura mínima de 44 px, com sublinhado no hover. No celular, o botão informa expansão e controla uma lista vertical; seleção de âncora fecha o menu.
- **Chips:** a pílula azul comunica desenvolvimento e funcionalidades previstas. O rótulo laranja do chamado e os rótulos de prazo comunicam estado por texto, não são controles interativos.
- **Cartões de perfil:** fundo cinza claro, título de perfil azul escuro, ação principal em navy e descrição em texto secundário; padding compacto até 820 px.
- **Demonstração do produto:** ficha semântica com os três prazos, histórico e evidências. O cabeçalho da demonstração, a legenda da figura e as fotos possuem identificação de conteúdo ilustrativo. SLA é explicado junto aos três prazos, com uma definição curta em cada linha. Listas, horários e texto permanecem selecionáveis; a demonstração não simula controles funcionais.
- **FAQ:** `details`/`summary` nativos, separados por linhas. O resumo mantém foco visível; o sinal de mais gira quando a resposta é aberta.
- **Disponibilidade:** diálogo nativo centralizado, com largura e altura limitadas à janela, descrição e botão “Entendi”. O foco começa no botão principal, permanece no diálogo, Escape fecha e o foco retorna ao acionador. Até 400 px, o padding é 28 px.

Não há campos de formulário nesta implementação; o sidecar não antecipa componentes de autenticação ou coleta.

## Do's and Don'ts

### Do:

- **Do** usar os tokens existentes e manter IBM Plex Sans e IBM Plex Mono nos papéis definidos.
- **Do** acompanhar estados de rótulos legíveis e distinguir ação de informação.
- **Do** manter foco visível, navegação por teclado e redução de movimento.
- **Do** identificar demonstrações e dados fictícios junto do conteúdo e comunicar a disponibilidade atual.
- **Do** preservar leitura e ordem do conteúdo quando as colunas empilharem.

### Don't:

- **Don't** comunicar estado apenas por cor.
- **Don't** usar os metadados compactos do mockup como tamanho padrão de leitura.
- **Don't** transformar exemplos ilustrativos em prova de uso real ou disponibilidade do sistema.
- **Don't** aplicar sombra de diálogo a todos os cartões.
