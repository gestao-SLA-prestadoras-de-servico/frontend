# Gestor — componentes e padronização visual

Atualização de 07/11/2026. Esta entrega estende o portal demonstrativo do Gestor em modo **Operate**, seguindo o painel de operações e a fila de chamados existentes. A identidade `framed-sheet`, o shell, os dados de demonstração e as regras dos fluxos permanecem como base.

Este documento registra as APIs reutilizáveis e o alcance da padronização. [DESIGN.md](../DESIGN.md) continua sendo a fonte visual normativa; [PRODUCT.md](../PRODUCT.md) descreve os limites do produto. A especificação anterior em [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) permanece como referência histórica. Não houve alteração de tokens globais, de `DESIGN.md` ou de `.impeccable/design.json`.

## Direção aplicada

As páginas compartilham Manrope local, títulos de página de 26–28 px, superfícies brancas, contornos de 1 px e cantos do token `deadline` (12 px). Azul indica ações; estados mantêm texto e ícones Lucide, sem depender somente da cor. Os painéis são planos; a sombra de diálogo fica nas superfícies modais.

Os indicadores do painel, de empresas, de contratos e de usuários usam `ManagerMetricCard` com a variante `outlined`. Os indicadores da fila preservam a variante `tinted`. Essas variantes conservam as referências existentes.

As diretivas concentram a aparência recorrente. Os templates continuam responsáveis pela composição, largura, espaçamento, densidade, pontos de quebra e semântica. A padronização não acrescentou CSS por página.

## Cabeçalho de página

Fonte: [manager-page-header.ts](../src/app/features/workspace/gestor/components/manager-page-header.ts).

`ManagerPageHeader` usa o seletor `app-manager-page-header` e oferece:

| API | Contrato |
| --- | --- |
| `title` | `string` obrigatória; gera o `h1` da página com `PageHeading`. |
| `description` | `string`, padrão vazio; mostra a descrição quando preenchida. |
| `demo` | `string`, padrão vazio; mostra o aviso demonstrativo com ícone informativo quando preenchido. |
| `[managerHeaderContext]` | Projeção acima do título, usada por exemplo para estados e identificação do chamado. |
| `[managerHeaderActions]` | Projeção das ações ao lado do título, com quebra natural conforme o espaço. |

Os atributos de projeção são marcadores de conteúdo; não exigem outra diretiva. O elemento projetado conserva sua semântica, seu destino e seus eventos.

```html
<app-manager-page-header
  title="Empresas"
  description="Consulte os clientes empresariais."
  demo="Demonstração com dados fictícios. Nenhum cadastro real é alterado."
>
  <div managerHeaderContext>
    <app-manager-status-badge value="active" />
  </div>
  <a managerHeaderActions appButtonPrimary routerLink="/app/gestor/empresas/nova"
    class="min-h-11 px-4 py-2.5">Nova empresa</a>
</app-manager-page-header>
```

## Superfícies e hierarquia

Fonte: [manager-surface.directive.ts](../src/app/features/workspace/gestor/components/manager-surface.directive.ts). São diretivas aplicadas aos elementos existentes, sem wrappers adicionais.

| Classe / seletor | API e uso |
| --- | --- |
| `ManagerPanel` / `[appManagerPanel]` | Input `'' \| 'compact' \| 'flush'`, padrão `''`. Superfície branca, borda e raio comuns. Padrão: recuo de 16 px, 20 px a partir de 640 px; `compact`: 12/16 px; `flush`: sem recuo interno. |
| `ManagerCollection` / `[appManagerCollection]` | Moldura de tabela ou lista, sem padding nem política de overflow. |
| `ManagerDialog` / `dialog[appManagerDialog]` | Aparência do diálogo nativo: borda, raio, sombra, backdrop e rolagem vertical com limite de altura útil. O conteúdo começa sem padding. |
| `ManagerSectionHeading` / `[appManagerSectionHeading]` | Título de seção de 16 px, peso 600 e entrelinha 1,5. O template escolhe `h2` ou `h3`. |
| `ManagerLabel` / `label[appManagerLabel]` | Rótulo de formulário de 14 px, peso 600. O template associa `for` ao campo. |
| `ManagerTextAction` / `[appManagerTextAction]` | Input `'' \| 'danger'`, padrão `''`. Ação textual sublinhada com área mínima de 44 px; `danger` aplica a cor destrutiva. |

```html
<section appManagerPanel aria-labelledby="company-data-title">
  <h2 appManagerSectionHeading id="company-data-title">Dados da empresa</h2>
</section>
<aside appManagerPanel="compact">Informação de apoio</aside>
<section appManagerPanel="flush"><!-- conteúdo com recuos próprios --></section>
<button type="button" appManagerTextAction="danger" (click)="openDeactivation()">
  Inativar
</button>
```

`ManagerDialog` centraliza apenas o tratamento visual. Largura, recuos do conteúdo, `aria-labelledby`, abertura com `showModal()`, fechamento, Escape, contenção e retorno do foco continuam sob responsabilidade da página. Reutilizar os handlers existentes ao estender um fluxo.

```html
<dialog appManagerDialog #editDialog aria-labelledby="edit-company-title"
  class="w-[min(620px,calc(100%-24px))]" (close)="onDialogClose()"
  (keydown)="trapFocus($event)">
  <div class="p-5 sm:p-7">
    <h2 id="edit-company-title">Editar empresa</h2>
    <!-- formulário e ações do fluxo existente -->
  </div>
</dialog>
```

## Tabelas e coleções responsivas

Fonte: [manager-table.directive.ts](../src/app/features/workspace/gestor/components/manager-table.directive.ts).

`ManagerTable` (`table[appManagerTable]`) define tabela de largura total, bordas colapsadas, texto de 14 px e alinhamento à esquerda. `ManagerTableHead` (`thead[appManagerTableHead]`) aplica fundo de apoio e rótulos de 12 px. `ManagerTableBody` (`tbody[appManagerTableBody]`) aplica divisórias entre linhas.

```html
<div appManagerCollection class="overflow-x-auto">
  <table appManagerTable>
    <caption class="sr-only">Empresas da demonstração</caption>
    <thead appManagerTableHead>
      <tr><th scope="col" class="p-4">Empresa</th><th scope="col" class="p-4">Situação</th></tr>
    </thead>
    <tbody appManagerTableBody>
      <tr><td class="p-4">Empresa de exemplo</td><td class="p-4">Ativa</td></tr>
    </tbody>
  </table>
</div>
```

Colunas, recuos das células, `caption`, cabeçalhos, largura mínima e contêineres focáveis pertencem ao template. As páginas preservam suas listas compactas e pontos de quebra existentes; contratos, por exemplo, trocam de composição em uma largura diferente de chamados e usuários. Quando a tabela larga permanece, a rolagem fica no seu contêiner, sem ampliar a página.

## Estados e ausência de resultados

Fontes: [manager-status-badge.ts](../src/app/features/workspace/gestor/components/manager-status-badge.ts) e [manager-empty-state.ts](../src/app/features/workspace/gestor/components/manager-empty-state.ts).

`ManagerStatusBadge` (`app-manager-status-badge`) recebe `value` obrigatório e `label` opcional, ambos com texto visível acompanhado de ícone. Um `label` não vazio substitui apenas o rótulo padrão, preservando o significado visual do valor.

| `value` | Rótulo padrão | Uso visual |
| --- | --- | --- |
| `active` | Ativa | Verde de situação ativa. |
| `inactive` | Inativa | Neutro. |
| `current` | Vigente | Verde de vigência. |
| `future` | Futuro | Azul informativo. |
| `expired` | Vencido | Perigo. |

```html
<app-manager-status-badge value="active" label="Ativo" />
<app-manager-status-badge value="current" />
<app-manager-empty-state
  title="Nenhuma empresa encontrada"
  description="Revise a busca para consultar os exemplos disponíveis."
>
  <button type="button" appManagerTextAction (click)="clearFilters()">Limpar filtros</button>
</app-manager-empty-state>
```

`ManagerEmptyState` (`app-manager-empty-state`) exige `title` e `description` e projeta conteúdo livre para a recuperação. O bloco tem `role="status"`, borda tracejada e texto centralizado. A página continua responsável por decidir quando exibi-lo e por implementar a ação projetada.

## Indicadores, chamados e botões existentes

Os componentes abaixo continuam sendo reutilizados; a padronização não substitui suas APIs.

| Componente | API |
| --- | --- |
| `ManagerMetricCard` / `app-manager-metric-card` | `label: string`, `value: number` e `icon: ManagerMetricIcon` obrigatórios; `tone: 'blue' \| 'green' \| 'danger' \| 'neutral'` (padrão `blue`), `variant: 'tinted' \| 'outlined'` (padrão `tinted`) e `note: string` (padrão vazio). |
| `ManagerTicketBadge` / `app-manager-ticket-badge` | `value` obrigatório do tipo `ManagerTicketStatus \| ManagerTicketPriority`. O mapa existente fornece ícone, texto e cor. |
| `ManagerTicketClocks` / `app-manager-ticket-clocks` | `ticket: ManagerTicket` obrigatório. Apresenta resposta, atendimento em campo e resolução, com descrição completa acessível; cancelados mostram “Sem apuração de SLA”. |
| `ButtonPrimary` / `[appButtonPrimary]` | Ação principal azul, com a base compartilhada de botão. Aplicável a botão ou link. |
| `ButtonSecondary` / `[appButtonSecondary]` | Input `'' \| 'default' \| 'inverse'`, padrão `default`. No Gestor, usa a variante clara existente. |

Os ícones de indicador disponíveis são `violated`, `triage`, `service`, `validation`, `open`, `resolved`, `overdue`, `companies`, `users`, `technicians`, `active`, `inactive`, `contracts`, `current`, `future` e `expired`. Os componentes de gráfico de atividade, saúde do SLA e carga da equipe também utilizam os painéis e títulos compartilhados, preservando seus conteúdos e cálculos locais.

```html
<app-manager-metric-card
  variant="outlined" label="Empresas" [value]="companies().length" icon="companies" tone="blue"
/>
<app-manager-ticket-badge [value]="ticket.status" />
<app-manager-ticket-clocks [ticket]="ticket" />
<button type="submit" appButtonPrimary class="min-h-12 px-5 py-3">Concluir cadastro</button>
<a appButtonSecondary routerLink="/app/gestor" class="min-h-11 px-4 py-2.5">Voltar ao painel</a>
```

A base dos botões define cápsula, tipografia e estados de cor. Altura mínima e recuos são escolhidos pelo contexto no template: ações correntes usam ao menos 44 px e ações principais de formulário usam 48 px nos exemplos existentes. Ícones são decorativos quando o texto já identifica a ação.

Fontes: [manager-metric-card.ts](../src/app/features/workspace/gestor/components/manager-metric-card.ts), [manager-ticket-badge.ts](../src/app/features/workspace/gestor/components/manager-ticket-badge.ts), [manager-ticket-clocks.ts](../src/app/features/workspace/gestor/components/manager-ticket-clocks.ts) e [button.directive.ts](../src/app/shared/ui/button/button.directive.ts).

## Controles compartilhados

Fontes: [control-classes.ts](../src/app/shared/ui/input/control-classes.ts), [input.directive.ts](../src/app/shared/ui/input/input.directive.ts), [select.directive.ts](../src/app/shared/ui/input/select.directive.ts) e [textarea.directive.ts](../src/app/shared/ui/input/textarea.directive.ts).

`Input` (`input[appInput]`), `Select` (`select[appSelect]`) e `Textarea` (`textarea[appTextarea]`) compartilham `controlClasses`. A base preserva fundo branco, borda legível, raio de 10 px, texto de 16 px, foco visível azul, erro por `aria-invalid` e estado desabilitado. A transição de cor respeita movimento reduzido.

`Input` tem altura de 52 px; `Select`, altura mínima de 52 px; `Textarea`, altura mínima de 112 px e redimensionamento vertical. As diretivas não implementam validação nem substituem os controles nativos ou os formulários Angular.

```html
<label appManagerLabel for="contact-email">E-mail de contato</label>
<input appInput id="contact-email" type="email" formControlName="contactEmail"
  [attr.aria-invalid]="invalid('contactEmail')" aria-describedby="contact-email-error" />
<p id="contact-email-error" [hidden]="!invalid('contactEmail')">Informe um e-mail válido.</p>
<label appManagerLabel for="company-status">Situação</label>
<select appSelect id="company-status" formControlName="status"><option value="active">Ativa</option></select>
<label appManagerLabel for="company-address">Endereço</label>
<textarea appTextarea id="company-address" rows="3" formControlName="address"></textarea>
```

Importar cada classe utilizada no `imports` do componente standalone. O exemplo com formulário também pressupõe `ReactiveFormsModule`; links pressupõem `RouterLink`. Validação, ajuda, mensagens de erro e associações acessíveis permanecem explícitas no template. Não repetir borda, fundo ou foco nos campos que já usam essas diretivas.

## Rotas cobertas

| Rota | Superfície |
| --- | --- |
| `/app/gestor` | Painel de operações. |
| `/app/gestor/chamados` | Fila de chamados. |
| `/app/gestor/chamados/1043` | Detalhe representativo do chamado. |
| `/app/gestor/relatorios` | Prévia de relatórios. |
| `/app/gestor/contratos` | Contratos. |
| `/app/gestor/contratos/nova` | Cadastro demonstrativo de contrato. |
| `/app/gestor/politicas` | Políticas SLA. |
| `/app/gestor/politicas/editar` | Revisão demonstrativa dos prazos. |
| `/app/gestor/empresas` | Empresas e diálogos locais de edição/inativação. |
| `/app/gestor/empresas/nova` | Cadastro demonstrativo de empresa. |
| `/app/gestor/usuarios` | Usuários e diálogos locais. |
| `/app/gestor/usuarios/novo` | Cadastro demonstrativo de usuário. |
| `/app/gestor/auditoria` | Prévia de auditoria. |

O detalhe continua usando a rota parametrizada `chamados/:id`; `1043` é o cenário capturado. [workspace.routes.ts](../src/app/features/workspace/workspace.routes.ts) encaminha relatórios e auditoria para `ManagerPreview`, que lê o mesmo metadata de [workspace-data.ts](../src/app/features/workspace/data/workspace-data.ts). A apresentação compartilhada conserva as informações e a semântica dessas prévias: não acrescenta apuração, exportação nem operações de auditoria.

## Limites da demonstração

Dados, pessoas, empresas, contratos, estados, métricas e horários são fictícios. As simulações que alteram listas ou estados atuam somente na sessão local; recarregar descarta essas alterações. Não há API de produto, persistência, autenticação ou autorização reais, nem integração com Keycloak. Formulários e diálogos não criam nem alteram registros reais.

A revisão de políticas apresenta os números digitados, sem calcular SLA, criar versão, alterar contratos ou registrar histórico. Os três relógios e a amostra do painel permanecem demonstrações locais. Os avisos de cada página continuam distinguindo consulta, prévia e alteração local.

## Evidências e sequência de validação

O pacote de evidências fica em `tmp/manager-standardization/`, conforme [review-packet.md](../tmp/manager-standardization/review-packet.md). Esta documentação registra as verificações existentes; não inicia outra rodada de testes ou inspeção.

1. Passaram 39 testes unitários em 11 arquivos **antes do lote exclusivamente visual de links e campos descrito abaixo**. Não houve nova rodada unitária após os ajustes visuais.
2. A rodada de E2E manager/workspace executou 46 casos em Chromium e Firefox: 44 passaram e 2 falharam na expectativa antiga da coluna de próximo prazo. A expectativa foi atualizada para a lista atual dos três relógios.
3. A revisão visual inicial encontrou links de identidade com `inline-flex` e bordas duplicadas nos campos SLA. Um único lote corrigiu ambos e emoldurou o aside explicativo; as capturas `confirm` são posteriores a esse lote.
4. Após esse lote, passaram 4 execuções E2E: cancelamento em 2 navegadores e o novo teste de empresas em 2 navegadores. O total acumulado chegou a **48 execuções únicas aprovadas** (44 anteriores + 4 posteriores), em 2 navegadores. As 44 anteriores não foram repetidas em conjunto após esse lote.
5. Lint e typecheck passaram. O build registrado no pacote inicial passou com **372,51 kB iniciais e 21 rotas prerenderizadas**.
6. A revisão independente das 13 rotas e 52 capturas registrou `disposition: fix` por um único achado: a sobrancelha “Ação demonstrativa” no diálogo de inativação de usuário. A correção removeu esse parágrafo e o recuo anterior do título, preservando a explicação da simulação.
7. Após essa correção, lint e typecheck passaram novamente. O **build final passou com 372,41 kB iniciais e 21 rotas prerenderizadas**. As 4 execuções E2E de usuários passaram em Chromium e Firefox, incluindo validação dos formulários, bloqueio por carga, Escape e retorno do foco. São **4 repetições**, mantendo o total de **48 execuções únicas aprovadas**. O aviso NG8113 de `HeroBackground` permanece preexistente e fora desta extensão.
8. As mesmas 52 capturas de `confirm/` foram recapturadas com a produção final, sem novos problemas nas métricas. A comparação SHA256 identificou 49 arquivos idênticos; `companies-768.png`, `tickets-768.png` e `users-768.png` foram abertas e validadas novamente. Os dois recortes do diálogo de inativação também foram recapturados e abertos. O parecer posterior marcou o achado como `resolved`, `remaining: clear` e `disposition: ship`.

Os cenários E2E conferiram validação, edição local, inativação, Escape, retorno de foco e ausência de persistência e requisições externas. A sequência acima não equivale a uma suíte completa repetida após cada ajuste visual.

O lint visual do app registrou 48 arquivos, **0 FAIL / 0 WARN**. Os inspetores renderizados de 1440, 768 e 390 px registraram:

| Evidência | Resultado |
| --- | --- |
| `inspect-companies/report.json` | 0 FAIL / 0 WARN. |
| `inspect-company-new/report.json` | 0 FAIL / 1 WARN `tiny-text`. |
| `inspect-sla-edit/report.json` | 0 FAIL / 0 WARN. |

O único aviso é o texto auxiliar de 12 px do formulário de empresa, já usado pelo sistema. Ele permanece visível no registro, sem supressão persistente e sem ser promovido a novo token ou regra geral. `--allow icon-chips` foi utilizado apenas na lista com indicadores explicitamente solicitados pelo usuário, sem ignore gravado. O hook permaneceu ativo nos edits; não foi iniciado um segundo detector.

São **52 capturas**, uma para cada combinação das 13 rotas com 1440, 768, 390 e 320 px, em `confirm/{nome}-{largura}.png`. Nomes: `dashboard`, `tickets`, `ticket`, `reports`, `contracts`, `contract-new`, `sla`, `sla-edit`, `companies`, `company-new`, `users`, `user-new` e `audit`. Em 1440 e 390 px as imagens são full-page desde o topo; em 768 e 320 px mostram o primeiro viewport. O implementador abriu e validou todas.

`confirm/metrics.json` registra zero overflow da página, um `h1` no `main`, zero imagens quebradas e zero `pageerrors`. `company-edit-390.png` registra o diálogo de edição preenchido, com foco visível e ações alcançáveis. Há evidências adicionais de diálogos em `tmp/fe021-deactivate-modal-mobile.png`, `tmp/fe021-deactivate-modal-actions-mobile.png` e `tmp/fe025-cancel-dialog-mobile.png`. As referências anteriores são `before/dashboard-1440.png` e `before/tickets-1440.png`.

**Revisão independente concluída:** [finish-review.md](../tmp/manager-standardization/finish-review.md) registra a revisão original e seu único achado. [review-fix-evidence.md](../tmp/manager-standardization/review-fix-evidence.md) registra a correção, a validação posterior e as recapturas; `post-review-changed-captures.json` e `pre-review-fix-hashes.json` preservam a comparação. [finish-verdict.md](../tmp/manager-standardization/finish-verdict.md) aprova a correção pontuada com `disposition: ship` e nenhuma pendência. O parecer posterior se limita a esse achado e não representa uma nova busca de defeitos nas 13 rotas.
