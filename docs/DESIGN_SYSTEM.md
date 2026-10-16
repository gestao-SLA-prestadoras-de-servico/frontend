# FlowSLA — Design System

Referência de design patterns da **Plataforma de Gestão de SLA para Prestadoras de Serviço** (Projeto Integrador 2026.2). Documenta o que está desenhado no canvas "FlowSLA — Design da plataforma" (16 telas) para guiar a implementação do frontend.

> **Fonte da verdade visual:** o canvas. Este documento descreve as decisões e os nomes; se os dois divergirem, o canvas manda e este arquivo deve ser atualizado.
> **Nomes de classe:** os nomes abaixo (`.chip`, `.rc`, `.ck`…) são os usados no protótipo. Podem ser mantidos, ou traduzidos para componentes (Angular) com os mesmos nomes de variantes.

---

## 1. Princípios

1. **A cor responde uma pergunta:** o prazo estourou, está em andamento ou foi cumprido? Cores semânticas só aparecem com esse significado.
2. **A cor nunca é o único sinal.** Todo estado, prioridade e relógio tem rótulo em texto.
3. **Superfície clara e leitura longa.** Fundo cinza muito claro, cartões brancos, texto em cinza chumbo (nunca preto puro). A trilha de auditoria e as descrições técnicas são lidas por muito tempo.
4. **Vermelho é cirúrgico.** Violação de SLA, prioridade alta e `CANCELADO`. Nada mais.
5. **Um perfil, um foco.** Gestor decide e audita; técnico executa e comprova; cliente acompanha e valida. Cada perfil tem seu menu e suas telas.
6. **Números e identificadores em fonte monoespaçada**, para alinhar e escanear.

---

## 2. Fundamentos (tokens)

### 2.1 Cores

Definidas como variáveis CSS em `:root`.

**Primária e base**

| Token | Hex | Uso |
|---|---|---|
| `--pri` | `#1976D2` | Botão primário, aba ativa, sino, relógio "correndo" |
| `--pri-d` | `#115293` | Hover do primário; texto sobre `--pri-bg` |
| `--pri-bg` | `#E8F1FB` | Item ativo do menu, avisos informativos, linha selecionada |
| `--navy` | `#0B2545` | Faixas da landing e painel de marca do login |
| `--bg` | `#F8F9FA` | Fundo geral do sistema |
| `--sf` | `#FFFFFF` | Cartões, modais, tabelas, barra superior |
| `--ink` | `#1C2025` | Texto principal |
| `--ink2` | `#4A5260` | Texto secundário |
| `--ink3` | `#667080` | Metadados e legendas |
| `--line` | `#E3E6EA` | Bordas de cartão e divisórias |
| `--line2` | `#CDD3DA` | Bordas de campo e botão secundário |

**Semânticas (cada uma tem puro, fundo suave e texto escuro)**

| Cor | Puro | Fundo suave | Texto sobre suave | Significa |
|---|---|---|---|---|
| Vermelho | `--red` `#D32F2F` | `--red-bg` `#FDECEC` | `--red-t` `#B3261E` | Violação de SLA, prioridade alta, `CANCELADO`, falha |
| Laranja | `--ora` `#ED6C02` | `--ora-bg` `#FFF1E2` | `--ora-t` `#9A4200` | `EM_ATENDIMENTO`, prazo apertando, aviso de validação automática |
| Verde | `--grn` `#2E7D32` | `--grn-bg` `#E8F5E9` | `--grn-t` `#1F6023` | `RESOLVIDO`, `ENCERRADO`, prazo cumprido, sucesso |
| Roxo | `--pur` `#7B1FA2` | `--pur-bg` `#F3E8F8` | `--pur` | `ABERTO` (aguardando triagem) |
| Ciano | `--cya` `#00838F` | `--cya-bg` `#E0F4F6` | `--cya-t` `#00656E` | `ATRIBUIDO`, evidência `RECEBIDA` |

**Regra de contraste.** O laranja puro não atinge 4,5:1 como texto sobre branco. Por isso:
- laranja **puro** só em pontos, barras e bordas;
- **texto** laranja sempre na variante `--ora-t`, sobre `--ora-bg`;
- o mesmo cuidado vale para vermelho, verde e ciano em texto pequeno.
As variantes foram escolhidas para ficar em torno de 4,5:1 ou mais; **validar com ferramenta de contraste na implementação.**

### 2.2 Tipografia

| Papel | Fonte | Detalhe |
|---|---|---|
| Interface e títulos | **IBM Plex Sans** 400/500/600/700 | Google Fonts |
| Números, prazos, `#id`, hashes | **IBM Plex Mono** 500/600 | Classes `.mono` e `.id` |

| Nível | Tamanho / peso | Onde |
|---|---|---|
| Hero da landing | `clamp(36px, 5vw, 58px)` / 700, tracking −.035em | Só landing |
| Título de seção (landing) | `clamp(28px, 3.4vw, 40px)` / 700 | `.h2` |
| Título de página (app) | 26 / 700, tracking −.02em | `.ph h1` |
| Título de cartão | 15 / 600 | `.ch h2` |
| Corpo | 14 / 400, line-height 1.5 | padrão |
| Apoio e metadados | 12,5 / 400 | `.sub`, `.hint` |
| Valor de KPI | 34 / 600 mono | `.kpi .v` |
| Eyebrow | 12 / 600 mono, caixa alta, tracking .1em | `.eyebrow` |

### 2.3 Espaçamento, raio e elevação

- **Escala de espaçamento:** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 px.
- **Padding de cartão:** 20 px (`.cp`). **Padding de página:** 28 × 32 px (16 px abaixo de 720 px).
- **Raios:** 8 px (campos, botões, itens de menu) · 10 px (avisos, tiles) · 12 px (cartões) · 99 px (chips, barras).
- **Elevação:** cartões usam só borda de 1 px. Sombra é reservada a camadas flutuantes: painel do sino `0 14px 36px rgba(28,32,37,.18)`, modal `0 24px 60px rgba(28,32,37,.3)`, mockup da landing `0 24px 56px rgba(28,32,37,.14)`.

### 2.4 Ícones

SVG inline, traço de 1,8 px, `stroke: currentColor`, sem preenchimento, cantos arredondados (estilo Lucide). Tamanhos: `.ic` 18 px, `.ic.s` 15 px, `.ic.l` 22 px. Ícone isolado em botão precisa de `aria-label`. Na implementação, preferir uma biblioteca de ícones em vez de SVG repetido.

---

## 3. Semântica de estado

### 3.1 Estados do chamado

| Estado | Classe do chip | Cor | Quando |
|---|---|---|---|
| `ABERTO` | `.c-aberto` | Roxo | Aguardando triagem e atribuição |
| `ATRIBUIDO` | `.c-atrib` | Ciano | Técnico definido; também após reabertura |
| `EM_ATENDIMENTO` | `.c-atend` | Laranja | Técnico em campo |
| `RESOLVIDO` | `.c-resol` | Verde suave | Aguardando validação do cliente |
| `ENCERRADO` | `.c-enc` | Verde **sólido** com texto branco | Final, apuração congelada |
| `CANCELADO` | `.c-canc` | Vermelho suave | Final, sem apuração de SLA |

`RESOLVIDO` (suave) e `ENCERRADO` (sólido) usam o mesmo verde de propósito, e o peso visual diferencia "ainda pode mudar" de "fechado".

**Rótulos.** No app interno o chip mostra o nome do estado como no back-end (`EM_ATENDIMENTO`). Na landing, onde o público é comercial, usa-se rótulo amigável ("Em atendimento").

### 3.2 Prioridade

| Valor | Classe | Aparência |
|---|---|---|
| Alta | `.c-alta` | Vermelho sólido, texto branco |
| Normal | `.c-norm` | Cinza neutro |

### 3.3 Estados da evidência

| Estado | Classe | Cor |
|---|---|---|
| `RECEBIDA` | `.c-rec` | Ciano |
| `PROCESSANDO` | `.c-proc` | Laranja |
| `DISPONIVEL` | `.c-disp` | Verde |
| `FALHA` | `.c-falha` | Vermelho |
| `EXPURGADA` | `.c-exp` | Cinza |

### 3.4 Relógios de SLA

Os três relógios (resposta, atendimento em campo, resolução) usam os mesmos quatro estados visuais.

| Estado | Mini (`.ck`) | Cartão (`.rc`) | Regra |
|---|---|---|---|
| Correndo | `.ck` (neutro) | `.rc.run`, borda e barra azuis | Dentro da folga |
| Apertando | `.ck.warn` | `.rc.warn`, laranja | Menos de 25% do prazo restante |
| Violado | `.ck.bad` (vermelho sólido) | `.rc.bad`, vermelho | Prazo ultrapassado. **Permanece violado mesmo se cumprido depois** |
| Cumprido | `.ck.ok` | `.rc.ok`, verde | Evento ocorreu no prazo |

Formato do tempo restante: `11h38`, `2d 1h58` (dias úteis e horas de janela). Chamado cancelado mostra "Sem apuração de SLA" no lugar dos relógios.

> **Nota de implementação.** O limite de 25% para "apertando" é decisão de design do protótipo, não regra de negócio da proposta. Confirmar com a equipe.

### 3.5 Vocabulário de cor por significado (resumo)

- **Vermelho:** quebra de prazo, urgência, cancelamento, falha.
- **Laranja:** em andamento ou atenção preventiva.
- **Verde:** concluído ou cumprido.
- **Roxo/Ciano:** início e transição.
- **Azul primário:** ação e navegação (botões, abas, sino), nunca estado de negócio.

---

## 4. Layout

### 4.1 Shell do app

```
┌──────────┬───────────────────────────────────────────┐
│ .side    │ .top   busca · sino                       │
│ 232px    ├───────────────────────────────────────────┤
│ marca    │ .page  (padding 28×32, gap 24)            │
│ .nav     │   .ph  título + ações                     │
│          │   conteúdo em cartões                     │
│ .me      │                                           │
└──────────┴───────────────────────────────────────────┘
```

- `.app`: `display:flex; flex-wrap:wrap`. `.side`: `flex:1 1 232px`. `.main`: `flex:999 1 560px; min-width:0`.
- **Responsividade sem media query:** em tela estreita o menu empilha acima do conteúdo. Tabelas rolam na horizontal dentro de `.tw`. Há uma media query única em 720 px que reduz paddings.
- **Menu lateral por perfil:**
  - **Gestor:** Painel, Fila de chamados (badge vermelho com violações), Relatórios · Contratos e SLA, Clientes e usuários · Auditoria.
  - **Técnico:** Meus chamados, Atendimento atual.
  - **Cliente:** Meus chamados, Abrir chamado.
- **Barra superior:** gestor e técnico têm o **sino** (cor primária, contador azul). **Cliente não tem sino**, só e-mail.
- Rodapé do menu `.me`: avatar com iniciais, nome e perfil.

### 4.2 Grades

| Classe | Uso |
|---|---|
| `.grid4` | Linha de KPIs (`minmax(220px,1fr)`, auto-fit) |
| `.grid3` | Três relógios, três cartões de chamado |
| `.grid2` | Pares de informação |
| `.split` | Coluna principal `.l` + lateral `.r` (lateral vira linha de baixo em tela estreita) |

### 4.3 Anatomia de página

1. **Cabeçalho `.ph`:** migalha opcional, `h1`, linha de chips (para páginas de chamado) e ações à direita.
2. **Faixa de aviso** (quando há algo urgente): `.note.r` para violação, `.note.o` para validação automática.
3. **KPIs** (painéis) ou **relógios** (páginas de chamado).
4. **Conteúdo** em `.split` ou cartões empilhados.

Páginas de **chamado** seguem sempre: relógios → descrição → atendimentos e evidências → linha do tempo à esquerda; **ações do perfil** à direita.

---

## 5. Componentes

### 5.1 Botões

| Classe | Uso |
|---|---|
| `.btn.p` | Ação principal da tela (uma por contexto) |
| `.btn` | Secundária |
| `.btn.g` | Confirmação de sucesso ("Validar e encerrar", "Concluir atendimento") |
| `.btn.d` | Destrutiva (cancelar, inativar). Borda vermelha; pode ser sólida dentro de modal de confirmação |
| `.btn.sm` / `.btn.lg` | 32 px / 48 px. Padrão: 40 px |
| `[disabled]` | 50% de opacidade |

Telas de campo (técnico, celular) usam `.lg` (48 px) e botões em largura total.

### 5.2 Cartão

`.card` (borda 1 px, raio 12) com `.ch` (cabeçalho: título à esquerda, chip ou meta à direita, borda inferior) e `.cp` (corpo, 20 px).

### 5.3 Chip

```html
<span class="chip c-atend">EM_ATENDIMENTO</span>
```
24 px de altura, pílula, ponto colorido à esquerda. Os chips sólidos (`.c-enc`, `.c-alta`, `.c-viol`) têm texto branco e ponto branco. Variante informativa: `.c-pri`.

### 5.4 KPI

```html
<div class="card kpi red"><span class="l">Violações de SLA</span><span class="v">1</span><span class="s">Resposta · #1040</span></div>
```
Borda superior de 4 px na cor do significado (`pri`, `red`, `ora`, `grn`, `pur`). Valor em mono. Limite: 4 por linha.

### 5.5 Tabela

`.tw > table.tb`. Cabeçalho em caixa alta 12 px cinza; linhas de 13 px de padding vertical; hover `#FAFBFC`. Link da primeira coluna: `#id` mono + título em 600.
- **Linha com violação:** `tr.viol` ganha filete vermelho de 4 px à esquerda da primeira célula.
- **Coluna "Relógios":** sempre `.clk` com três `.ck`.
- Largura mínima 820 px (1080 px na fila). Abaixo disso, rola.

### 5.6 Filtros e abas

- `.filters`: linha de `select.in.sm` + opções, dentro do cartão, acima da tabela.
- `.tabs`: abas por estado com contagem em mono. Ativa: texto `--pri-d`, sublinhado azul de 2 px.

### 5.7 Formulários

- `.fld`: rótulo (`label`, 13/600) + controle + `.hint` (12,5 cinza).
- `.in`: 40 px, borda `--line2`, raio 8. Foco: contorno azul de 2 px com offset. `textarea.in` cresce na vertical. `.in.sm`: 32 px, em filtros.
- **Interruptor:** `<input class="sw" type="checkbox">` com aparência customizada. Usado na preferência "avisar-me quando o técnico concluir".
- **Opção em cartão:** `.rad` (+ `.on`), usada em prioridade. Mostra valor e uma linha de ajuda.
- **Campo obrigatório:** o rótulo diz "(obrigatória)" ou "(obrigatório)", sem asterisco. Vale para motivo de cancelamento, justificativa de reabertura e técnico substituto.

### 5.8 Avisos (`.note`)

| Variante | Quando |
|---|---|
| `.note.r` | Violação de SLA, erro de negócio |
| `.note.o` | Alerta preventivo (validação automática próxima) |
| `.note.g` | Regra atendida, sucesso |
| `.note.i` | Informação neutra e regras de negócio explicadas ao usuário |

Estrutura: ícone + texto, com a frase-chave em negrito.

### 5.9 Relógio

```html
<div class="clk"><span class="ck ok">RESP ✓</span><span class="ck warn">CAMPO 1h23</span><span class="ck bad">RESOL violado</span></div>
```
Siglas nas listas: `RESP`, `CAMPO`, `RESOL`. No cartão `.rc` os nomes completos: "Resposta", "Atendimento em campo" (para o cliente: "Técnico no local"), "Resolução". Cartão: título em caixa alta, valor mono 22 px, barra de progresso, descrição com o prazo e a data de vencimento.

**Barra `.bar`:** 8 px, fundo `#E9ECEF`, preenchimento colorido por significado (`.b-pri`, `.b-grn`, `.b-ora`, `.b-red`, `.b-pur`, `.b-cya`). Também usada em carga por técnico e cumprimento por cliente.

### 5.10 Linha do tempo (`.tl`)

Lista vertical com pontos de 20 px conectados por linha de 2 px. Cor do ponto = significado do evento: `.dt.p` aberto · `.dt.b` ação do gestor · `.dt.c` atribuição/aviso · `.dt.o` atendimento · `.dt.g` resolução · `.dt.r` violação. Cada item: título em negrito + linha `.sub` com quem, quando e efeito.

### 5.11 Sino e notificações

- **Sino `.bell`:** botão 40 px, ícone azul, contador `b` (azul, mono). Aberto: `.bell.open`.
- **Painel `.np`:** cartão flutuante de 392 px ancorado abaixo do sino, com sombra.
- **Item `.ni`:** ícone circular `.nic` + texto. Não lida: fundo `#F4F8FD` (`.ni.un`). Lida: fundo branco.
- **Cor do ícone** segue o significado: `.nic.r` violação · `.nic.c` atribuição · `.nic.o` reabertura · `.nic.g` conclusão · `.nic.n` aviso neutro (remoção de chamado).
- **Texto:** primeira linha em negrito (o que aconteceu), segunda com `#id` e título do chamado, e `small` com o tempo.
- **Clique:** leva ao chamado e marca como lida. Se o usuário não tem mais acesso (ex.: após reatribuição), mostra só um aviso sem dados do chamado.
- Rodapé do painel: "Notificações são mantidas por 90 dias."

### 5.12 Evidências

- **Tile `.th`:** proporção 4:3, fundo listrado (placeholder de foto). Abaixo: nome do arquivo, tamanho, hash abreviado e chip de estado.
- **Área de envio `.dz`:** borda tracejada, ícone, instrução, formatos aceitos ("JPEG, PNG ou WebP, até 10 MB"), aviso de privacidade e botões "Tirar foto" / "Escolher arquivo".
- **Progresso de envio:** nome do arquivo + porcentagem + `.bar`.
- Cliente vê só as fotos reduzidas, com legenda "Antes / Durante / Depois". **Não há botão de excluir evidência para nenhum perfil.**

### 5.13 Modal

`.ov` (fundo escurecido a 50%) + `.modal` (600 px, raio 14). Estrutura: título + botão fechar · corpo · rodapé com ações alinhadas à direita (cancelar à esquerda da ação destrutiva). Foco inicial no primeiro campo obrigatório.

### 5.14 Marca e avatar

Marca: quadrado azul 32 px com relógio + "FlowSLA" 18/700. Avatar `.av`: círculo 34 px, iniciais, fundo `--pri-bg`. Usuário inativo: avatar e nome em cinza.

### 5.15 Componentes da landing

`.wrap` (largura máx. 1180 px) · `.sec` (96 px de padding vertical) · `.eyebrow` · `.h2` · `.lead` (18 px) · `.lnav` · `.step` + `.no` (número em círculo azul) · `.fi` (ícone em quadrado 44 px). Seções alternam fundo `--bg`, branco e `--navy`. A faixa navy usa cartões brancos e texto `#B8C7DA` (apoio) / `#8DBCEF` (eyebrow).

---

## 6. Padrões por fluxo

### 6.1 Triagem do chamado (gestor)
Chamado `ABERTO`. Cartão "Triagem" na lateral, com três blocos em ordem: **prioridade definitiva** (cartões `.rad`, com os prazos de cada opção; alterar recalcula só prazos ainda não cumpridos) → **primeiro posicionamento** (textarea + aviso de que segue por e-mail e cumpre o SLA de resposta) → **atribuição** (select com a carga de cada técnico). Preferência de notificação como interruptor em cartão próprio. Cancelamento isolado em cartão com borda vermelha clara, no fim.

### 6.2 Violação
Quando um relógio é violado: faixa `.note.r` no topo da página, chip `SLA de resposta violado` (`.c-viol`) no cabeçalho, cartão `.rc.bad`, linha `tr.viol` nas listas e notificação vermelha no sino. O texto explica que cumprir depois não remove a violação.

### 6.3 Atendimento e evidências (técnico)
Tela focada: sobre o chamado → descrição técnica → evidências → envio. Lateral: prazos somente leitura e "Concluir atendimento" com checklist (descrição registrada, ao menos uma evidência). **Foto `RECEBIDA` já vale** para concluir. Falha de processamento é explicada, não bloqueia. Versão celular: coluna única, grade de fotos 2×N, botões de 48 px, "Tirar foto" como ação primária.

### 6.3.1 Sem dados comerciais para o técnico
Telas do técnico mostram empresa e endereço do local, nunca contrato, política ou valores.

### 6.4 Validação e reabertura (cliente)
Cartão "O serviço foi resolvido?" com botão verde, e abaixo "Não foi resolvido?" com justificativa **obrigatória** e botão secundário. Faixa laranja explica a validação automática (data, hora e quando o aviso por e-mail chega). Texto da reabertura diz que o chamado volta ao técnico atual e que os prazos de campo e de resolução recomeçam.

### 6.5 Inativação de técnico com substituto (gestor)
Modal destrutivo: resumo por estado do que será transferido (`ATRIBUIDO`, `EM_ATENDIMENTO`, `RESOLVIDO`, cada um com chip, efeito e contagem) → select de substituto obrigatório → aviso `.note.i` sobre prazos e notificações → botão vermelho com o total ("Inativar e transferir 3 chamados").

### 6.6 Política de SLA versionada
Matriz relógio × prioridade com campos em **minutos** e conversão em texto ao lado ("540 min · 1 dia útil"). Validação visível (`.note.g`) da ordem resposta < campo < resolução. Ação "Salvar como nova versão". Histórico de versões ao lado, marcado "Imutável".

### 6.7 Auditoria
Tabela somente leitura (sem ações de editar ou excluir) + painel "Registro selecionado" com quem, chamado, quando, transição, justificativa e efeitos. Aviso fixo no topo: registros imutáveis por 5 anos.

### 6.8 Relatórios
Filtros (período, cliente, técnico) + exportar PDF/CSV no cabeçalho. KPIs de cumprimento por relógio, depois tabelas por cliente e por técnico com barra + porcentagem. Barra verde com 90% ou mais, laranja abaixo disso. "Por técnico" não mostra SLA de resposta (é obrigação do gestor).

---

## 7. Acessibilidade

- **Elementos reais:** `button`, `a[href]`, `input` + `label`, `select`, `textarea`. Nada de `div` clicável.
- **Rótulos:** botões só com ícone têm `aria-label` (sino informa a contagem de não lidas).
- **Contraste:** texto 4,5:1 (3:1 a partir de 24 px). Ver regra do laranja em 2.1.
- **Estado nunca só por cor:** sempre texto no chip; relógios violados dizem "violado".
- **Alvos de toque:** mínimo 40 px no desktop, 44–48 px em telas de campo.
- **Foco visível:** contorno azul de 2 px nos campos; manter em botões e links na implementação.
- **Tabelas:** `th` no cabeçalho; rolagem horizontal em caixa própria.
- **Idioma:** `lang="pt-BR"`.

---

## 8. Conteúdo e tom

- **Idioma:** português do Brasil, direto. Frases curtas, verbo no início das ações ("Registrar e enviar", "Inativar e transferir 3 chamados").
- **Rótulo de botão diz o efeito**, incluindo a quantidade quando relevante.
- **Regras de negócio aparecem como `.hint` ou `.note.i`** no ponto da decisão (ex.: "Atribuir não cumpre nenhum SLA"), não em manual separado.
- **Datas:** `seg 05/10 às 08:05` em texto corrido; `05/10 08:05` em tabelas (mono). **Prazos:** `restam 11h38`, `2d 1h58`.
- **Identificador do chamado:** `#1042` (número legível), em mono.
- **Landing:** linguagem comercial, sem nomes de estado, hash, EXIF ou tecnologias.

---

## 9. Mapa de telas

| Arquivo | Página do canvas | Perfil | Conteúdo |
|---|---|---|---|
| `Main` | Landing e acesso | Público | Landing page comercial |
| `Login` | Landing e acesso | Todos | Acesso (tela do provedor de identidade) com atalhos de protótipo |
| `Gestor-Dashboard` | Gestor | Gestor | Painel de operações |
| `Gestor-Fila` | Gestor | Gestor | Fila de chamados com abas e filtros |
| `Gestor-Chamado` | Gestor | Gestor | Chamado `ABERTO` em triagem, com violação |
| `Gestor-Contratos` | Gestor | Gestor | Contratos e política de SLA versionada |
| `Gestor-Usuarios` | Gestor | Gestor | Usuários e modal de inativação de técnico |
| `Gestor-Relatorios` | Gestor | Gestor | Relatório de cumprimento de SLA |
| `Gestor-Auditoria` | Gestor | Gestor | Trilha de auditoria |
| `Tecnico-Dashboard` | Técnico | Técnico | Meus chamados, com o sino aberto |
| `Tecnico-Atendimento` | Técnico | Técnico | Atendimento e evidências |
| `Tecnico-Mobile` | Técnico | Técnico | Atendimento no celular (390 px) |
| `Cliente-Dashboard` | Cliente | Cliente | Meus chamados |
| `Cliente-Novo-Chamado` | Cliente | Cliente | Abrir chamado |
| `Cliente-Chamado` | Cliente | Cliente | Chamado `RESOLVIDO`: validar ou reabrir |
| `Guia-de-estilo` | Guia de estilo | — | Paleta, estados e componentes |

---

## 10. Como implementar

1. **Tokens primeiro.** Copiar o bloco `:root` da seção 2.1 como variáveis CSS (ou mapear para o tema do framework). Todos os componentes consomem as variáveis, nunca hex solto.
2. **Componentes por significado, não por cor.** Criar `StatusChip` (prop `estado`), `PriorityChip`, `EvidenceChip`, `SlaClock` (prop `estado` ∈ `correndo | apertando | violado | cumprido`) e `Note` (prop `tom`). A tradução estado → cor mora em um único mapa.
3. **Fonte de tempo restante.** O frontend não calcula SLA: exibe prazos e estados vindos do back-end, que grava os prazos na abertura.
4. **Autorização.** O menu e as telas por perfil refletem o papel do token, mas quem decide acesso é o back-end. O sino consome a API do ms-notificacoes; as telas, a do app-principal.
5. **Estados vazios, de carregamento e de erro** não estão desenhados no canvas; seguir o padrão do `.dz` (vazio) e `.note.r` (erro).

---

## 11. Pendências e decisões em aberto

| Item | Situação |
|---|---|
| `CANCELADO` em vermelho | Seguiu o briefing, mas dá ao vermelho dois sentidos (violação e cancelamento). Avaliar cinza. |
| Limite de 25% para "apertando" | Decisão do protótipo. Confirmar com a equipe. |
| KPI ciano | Hoje usa estilo inline (`border-top-color: var(--cya)`). Criar variante `.kpi.cya`. |
| Tela de cadastro de cliente | A aba "Clientes" existe, mas não foi desenhada. |
| Reprocessamento de evidência (RF-29) e consulta de evidência expurgada (RF-46) | Sem tela dedicada. |
| Estados vazios, carregamento e erro | Não desenhados. |
| Tema escuro | Fora do escopo. |
| Dados de exemplo | Nomes, números e percentuais do canvas são fictícios. |
| Contraste | Validar todas as combinações com ferramenta antes de fechar a implementação. |
