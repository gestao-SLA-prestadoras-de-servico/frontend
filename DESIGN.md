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

A Nivelo conecta prazos, atendimento e comprovação por uma linguagem clara e precisa. Manrope dá unidade aos títulos, à leitura e aos controles; o azul-noite estabelece estrutura, o azul corporativo sinaliza ações e a luz turquesa traz a assinatura óptica da marca. A identidade estabelecida na escolha C — Faixa de luz é preservada na composição A — Fluxo de luz, aprovada em 30/10/2026. A narrativa de doze capítulos pertence à landing e está registrada no briefing da superfície; não redefine o sistema da marca.

Superfícies claras acolhem a informação mais densa. Divisórias, alinhamentos e texto explícito explicam a relação entre etapas e estados. Refração e movimento criam atmosfera sem carregar o conteúdo: títulos, ações e avisos continuam em HTML, legíveis sobre o fundo estático.

Este arquivo é a fonte da verdade visual da landing implementada. Os tokens estão em `@theme` de `src/styles.css`; os primitivos reutilizáveis ficam em `src/app/shared/ui/`, e os componentes específicos da landing em `src/app/features/landing/components/`. Templates e hosts usam utilitários Tailwind 4; `landing-chapters.css` reúne a geometria compartilhada da composição, e a cena de prazos mantém seu CSS local. O documento histórico `docs/DESIGN_SYSTEM.md` descreve a proposta de telas internas ainda não implementadas; ele não substitui estes tokens. A prancha de identidade fixa também o slate de marca, enquanto os textos de apoio atuais usam as variantes legíveis extraídas acima.

**Key Characteristics:**

- Manrope local em todos os papéis, com algarismos tabulares para prazos e identificadores.
- Azul-noite estrutural, azul de ação e turquesa luminoso associado ao símbolo.
- Controles em cápsula, superfícies arredondadas e grupos abertos separados por linhas.
- Informação operacional acompanhada de rótulos, contexto e identificação dos exemplos.
- Movimento discreto, opcional e substituível pela composição estática.

## Colors

A paleta combina a profundidade do azul-noite com azuis claros de apoio e verde operacional. Os nomes abaixo correspondem às chaves normativas do frontmatter e às variáveis Tailwind `--color-*`: por exemplo, `pri` corresponde a `--color-pri`, consumido por `bg-pri`, `text-pri` e `border-pri`.

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

O arquivo variável local oferece pesos de 400 a 800, com `font-display: swap`. Não há chamada externa de fonte em runtime. Números e identificadores mantêm Manrope com `tabular-nums` e `font-semibold`; a antiga classe `mono` foi removida. `--font-sans` e `--font-mono` preservam a mesma pilha da marca.

- **Display**: título principal amplo e compacto. Os tokens de display existentes permanecem disponíveis; o hero desta composição usa `clamp(2rem, 4.8vw, 4.8rem)`, entrelinha de 1,08 e ajustes próprios para telas estreitas e baixas. Abaixo de 640 px, usa o tamanho de `display-mobile` e entrelinha de 1,12.
- **Headline**: títulos de seção com a base global de `<h2>`. Abaixo de `sm`, usam `clamp(1.85rem, 7.5vw, 2.5rem)`.
- **Title**: títulos de grupo; benefícios e registros compactos usam a variação de 16 px, enquanto o painel de perfil tem uma escala própria de destaque.
- **Body / lead**: leitura principal e aberturas. Os capítulos usam lead de 17 px, com entrelinha de 1,75 e limites de linha conforme o conteúdo; abaixo de 640 px, o lead passa a 16 px.
- **Action / label**: controles e informação de desenvolvimento. As ações da hero usam 14 px. O mínimo de toque permanece separado do tamanho da letra; navbar e marca textual conservam sua tipografia anterior.
- **Caption**: metadados pequenos dos novos capítulos e do chamado usam o token `--text-caption`, com entrelinha de `--text-caption--line-height`. O aviso do hero e as legendas de imagem e navegador acompanham esse tamanho de leitura (13 px).
- **Preview body / meta**: conteúdo e metadados do exemplo de chamado, mantidos legíveis quando as colunas empilham. O chamado atual usa `caption` nos metadados, preservando os demais papéis tipográficos existentes.

**The Uma Família Rule.** Usar Manrope para manter a identidade. Não restaurar IBM Plex a partir do protótipo histórico.

## Layout

A composição dos capítulos usa largura máxima de 1328 px e recuos de 20 px por lado como base, 32 px a partir de `sm` (640 px) e 56 px a partir de `xl` (1280 px). O rodapé conserva seu contêiner anterior, com máximo de 1440 px. A separação principal entre seções usa `--spacing-section`.

Grupos abertos e divisórias organizam benefícios e capacidades. Contratos, demonstração do chamado e simulações de perfil concentram a densidade em superfícies próprias; textos de contexto permanecem próximos delas. A hierarquia não depende de cartões repetidos em toda a página.

A navegação desktop e as composições amplas entram em `lg` (1024 px). O fluxo usa uma coluna abaixo de 640 px, duas até 1023 px e quatro a partir de 1024 px. Evidências e foto ocupam duas metades no desktop e empilham abaixo de 1024 px. As abas de perfil conservam três opções visíveis, enquanto o painel passa a uma coluna abaixo de 640 px. Abaixo de 400 px, as linhas de prazo do chamado empilham o estado sob a descrição. As ações do hero quebram linha conforme o espaço disponível. A composição específica e a referência aprovada estão em `.impeccable/surfaces/src-app-app-html.md` e `docs/LANDING_FLUXO_DE_LUZ.md`.

O hero usa altura mínima de `min(760px, 100svh)` no desktop, `min(900px, 100svh)` abaixo de 1024 px e `100svh` abaixo de 640 px. O conteúdo pode fazê-lo crescer. Em telas de até 700 px de altura, os recuos verticais e os intervalos diminuem; até 500 px de altura, com largura de pelo menos 640 px, a tipografia também se ajusta. Título, descrição, duas ações e aviso seguem agrupados à esquerda.

A cena dos três prazos ocupa `180svh`, com área interna sticky de `100svh`, apenas a partir de 1024 px de largura e 700 px de altura e quando o movimento é permitido. Nas demais condições, os mesmos três compromissos ficam estáticos, sem espaço artificial de rolagem. A ordem do conteúdo não depende da animação.

## Elevation & Depth

A página usa principalmente contraste tonal e bordas finas. A cápsula de navegação recebe sombra suave; diálogo e menu móvel usam a sombra de overlay. O chamado permanece plano dentro de uma janela branca; essa janela e a moldura do navegador de celular usam `shadow-preview`. A sombra separa a demonstração do fundo e não é aplicada a todos os grupos abertos.

A hero usa o vídeo fornecido pelo usuário como fundo decorativo em um player HTML nativo. O MP4 de 1280 × 720, 24 fps e 8,5 s tem uma mistura suave de 1,5 s entre o final e o início para repetir sem corte. O vídeo fica sem áudio, preenche a área com `object-fit: cover` e mantém o gradiente escuro para leitura, reforçado na região do texto no celular e em telas baixas. O poster WebP corresponde ao primeiro quadro e permanece visível até a reprodução começar, com movimento reduzido ou quando o vídeo não puder tocar. A reprodução inicia após a hidratação, pausa fora da tela e em aba oculta e libera os recursos ao desmontar. A entrada do vídeo usa uma transição de opacidade de 0,6 s.

O mesmo poster fornece atmosfera estática aos trechos de fluxo e encerramento, com sobreposição azul-noite. A fotografia complementar de manutenção é ilustrativa, identificada junto à imagem e usada como contexto do registro em campo; não é prova documental de operação real.

## Shapes

Controles principais e navegação têm contorno de cápsula. O exemplo de chamado e o diálogo usam o raio de superfície. O menu móvel tem apenas os cantos superiores arredondados e se apoia na borda inferior da tela. Indicadores circulares conectam etapas; divisórias finas fazem a estrutura aparecer sem contornos pesados.

O símbolo obrigatório é o check em camadas fornecido na primeira imagem do usuário, vetorizado em `public/images/nivelo-symbol.svg`. Preservar geometria, proporção e suas três cores. O símbolo diferente que aparece na prancha de identidade não é a marca adotada. O logotipo combina este SVG com o nome NIVELO em texto e o descritor GESTÃO DE SLA.

## Components

### Buttons

Botões nativos `<a>` e `<button>` usam as diretivas `appButton`, `appButtonPrimary` e `appButtonSecondary` de `src/app/shared/ui/button/`. A base concentra alinhamento, espaçamento interno entre conteúdo, forma em cápsula, tipografia e transição de cor; classes Tailwind locais ajustam altura, padding e largura para cada contexto. A altura mínima padrão e a das ações do hero é 50 px; a do cabeçalho é 44 px.

A variante primária usa o azul corporativo e branco. A secundária usa fundo transparente, texto azul-noite e borda `line2`, com fundo azul-claro no hover. No hero escuro, `appButtonSecondary="inverse"` usa texto branco, borda clara e hover branco translúcido.

Hover e foco deslizam uma cópia visual do rótulo e giram a seta em 45 graus durante 450 ms, preservando uma única identificação acessível. O modo de movimento reduzido elimina esses deslocamentos. O foco global usa contorno de 3 px com offset de 5 px; sobre o hero ele usa ciano.

Os controles novos da composição têm resposta de pressão de 140 ms, com escala de 0,97 no estado ativo e o `--ease-out` existente. Essa resposta é removida com movimento reduzido. A navbar conserva sua aparência e seu comportamento anteriores.

### Navigation

Os links de navegação da landing usam a diretiva `appLink` de `src/app/shared/ui/link/`: a variante padrão atende à navegação desktop, `appLink="menu"` às âncoras do menu móvel e `appLink="footer"` ao retorno ao início no rodapé. A navegação desktop vive na cápsula branca fixa e usa âncoras com área mínima de 44 px. No celular, um botão identificado abre um `dialog` nativo em formato de folha inferior, com links de pelo menos 56 px, fechamento, Escape, foco contido e retorno ao acionador. Selecionar uma seção fecha o menu e leva o foco ao destino.

### Section Headings

Os títulos mantêm o nível semântico e o identificador usado por `aria-labelledby`. As novas seções usam a base global de `<h2>` e adaptações locais; as diretivas de títulos existentes continuam disponíveis em `shared/ui/`. As entradas de seção usam opacidade e deslocamento de 20 px por 700 ms, com defasagem de 70 ms por item e o `--ease-out` existente. São executadas uma vez, após a hidratação, respeitam movimento reduzido e são canceladas quando o foco entra no conteúdo.

### Labels and Status

O aviso de desenvolvimento é informativo e tem ponto acompanhado de texto. O estado do chamado usa azul suave com texto azul escuro. Prazos cumpridos recebem o par verde de fundo e texto; o prazo em andamento usa o par azul. Esses estados descrevem dados fictícios, não uma operação em tempo real.

### Cards and Containers

O contrato ilustrativo usa fundo claro e o raio de superfície. O chamado usa fundo branco, borda, raio de superfície e padding de 24 px, reduzido para 16 px abaixo de `sm`; sua janela externa usa o mesmo raio. Evidências e histórico do chamado dividem a área em duas colunas a partir de `sm`. O capítulo de histórico ampliado usa uma linha conectada aos marcadores de cada evento. Não há campos de formulário nesta entrega.

### Role Tabs

Três abas identificam Gestor, Técnico e Cliente. A seleção usa azul corporativo com texto branco; as opções restantes ficam na superfície clara. O painel combina atribuições previstas e uma simulação local. Setas, Home e End mudam a aba e o foco; cada painel tem relação explícita com sua aba, e o resultado da simulação é anunciado. O botão alterna entre simular e reiniciar, sem persistir dados ou enviar arquivos.

### Deadline Scene

Resposta, atendimento em campo e resolução aparecem juntos com ícones SVG, título e descrição. No desktop alto, a rolagem controla uma linha de progresso com Web Animations API e destaca a etapa atual; a lista textual permanece íntegra. A inicialização usa `afterNextRender`, e observadores, listeners, frames e animações são liberados ao desmontar. O tratamento estático mantém o conteúdo em telas estreitas, baixas ou com movimento reduzido. A ausência dos recursos de animação não oculta a lista.

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
