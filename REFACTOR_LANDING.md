# Refatoração da Landing Page

Plano de refatoração do frontend da Nivelo: tirar a landing de um estado "só landing" e transformá-la na **base escalável** de uma aplicação Angular 21 (zoneless + SSR) que vai crescer para autenticação, contratos, chamados, SLA, evidências, relatórios e papéis.

Este documento é um roteiro executável. Siga as tarefas **na ordem**, uma de cada vez, validando ao final de cada fase.

## 1. Contexto e objetivo

- Projeto: Angular 21.2.x, SSR com `@angular/ssr`, hidratação com `withEventReplay` (`src/app/app.config.ts:5,10`), sem `zone.js` (zoneless).
- Escopo atual: apenas a landing na rota `/` (`src/app/app.routes.ts:4`).
- Escopo alvo: base de código preparada para as telas internas descritas em `docs/DESIGN_SYSTEM.md` e `docs/Prosposta-Integrador(2).md`.
- Backend: aplicação separada em `../backend` (Spring Boot). O frontend ainda **não** consome API; a camada HTTP deve ser apenas preparada, não implementada.

Objetivos da refatoração:

1. Adotar **Tailwind de verdade** (migração da landing concluída na Fase 2).
2. Criar **camadas reutilizáveis** (`core`, `shared`, `features`).
3. Organizar a landing em subpastas por responsabilidade.
4. Reduzir custo cognitivo: achar qualquer peça sabendo apenas a sua responsabilidade.
5. Promover a global o que é global (primitivos, moldura, tokens).
6. Destravar o ambiente de desenvolvimento.
7. Padronizar e organizar os testes.

## 2. Diagnóstico do estado atual

Evidências do diagnóstico original, com a resolução do problema 1 atualizada nesta entrega. Os demais itens não foram reavaliados nesta fase:

| #   | Problema                                   | Evidência                                                                                                                                                                                                                                                               |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Resolvido: landing migrada para Tailwind 4 | `src/styles.css` define tokens em `@theme` e padrões em `@layer base` com `@apply`; templates e hosts em `features/landing/` usam utilitários, variantes de estado e breakpoints padrão. CSS local restrito aos gradientes do fundo e às transições nativas do diálogo. |
| 2   | Sem componentes reutilizáveis              | Não existe `core`/`shared`; primitivos globais vivem em `landing/` (`icon.ts`, `action-label.ts`, `availability-dialog.ts`).                                                                                                                                            |
| 3   | Pasta `landing/` bagunçada                 | 17 arquivos soltos misturando página, seções, primitivos e infra.                                                                                                                                                                                                       |
| 4   | Custo cognitivo alto                       | Conteúdo hardcoded em TS (`landing.ts:24-71`, `faq.ts:95-126`, `platform-overview.ts:12-48`); 3 CSS de página com nomes genéricos (`landing.css`, `landing-sections.css`, `landing-responsive.css`).                                                                    |
| 5   | Global misturado com landing               | Header/footer/skip-link/ícones/diálogo não são peças de landing, mas moram nela. Sem environments nem camada HTTP/auth.                                                                                                                                                 |
| 6   | Dev mode quebrado                          | Ver seção 3.                                                                                                                                                                                                                                                            |
| 7   | Estilo de componente inconsistente         | Uns usam `styleUrl`, outros têm CSS inline grande (`availability-dialog.ts:29-130`, `faq.ts:23-92`, `hero-background.ts:7-16`, `icon.ts:20`).                                                                                                                           |
| 8   | Botão/link sem componente                  | `.button`, `.button-primary`, `.button-secondary` são classes globais (`src/styles.css:69-73`); o markup se repete em `landing.html:13-14,44-45`.                                                                                                                       |
| 9   | Focus trap duplicado                       | `landing.ts:110-117` e `availability-dialog.ts:145-161` reimplementam o que `<dialog>` nativo já faz.                                                                                                                                                                   |
| 10  | Higiene                                    | `playwright-report/` e `test-results/` não estão no `.gitignore`; `shaders` é dependência morta (`package.json:26`); `src/app/app.css` vazio.                                                                                                                           |

## 3. Causa do "dev mode dá timeout"

Sintoma: `ng serve` sobe, mas ao acessar `http://localhost:4200` a requisição estoura timeout. `ng build` e o SSR de produção funcionam.

Causa provável (issue oficial do angular-cli): a partir do `@angular/build` **21.2.14**, o `ComponentStylesheetBundler` colide cache-key quando há **múltiplos componentes com blocos `styles:` inline** no projeto, e o processo fica pendurado. O dev server impõe **timeout de 30s por requisição SSR**; por isso o acesso expira. O build de produção não passa por esse caminho, por isso funciona.

Gatilhos no projeto: quatro componentes com `styles:` inline (tabela item 7).

Mitigações possíveis (resolver na fase 0):

- Eliminar os `styles:` inline.

Contribui também para o acesso: o dev server, sem `options` no target `serve`, libera apenas o host `localhost`; acessos por `127.0.0.1` ou IP de rede caem em "Blocked request".

## 4. Decisões travadas

- Abordagem: **reestruturar em fases** (não reescrever do zero), preservando acessibilidade, vídeo e SSR.
- Nomenclatura: **`shared/ui`** (primitivos visuais) + **`shared/layout`** (moldura estrutural).
- Botões/links: **diretiva de variante** aplicada em `<a>`/`<button>` nativos (preserva semântica e a11y).
- Tailwind: **adotar de verdade**, com `@theme` derivado dos tokens atuais.
- Escopo: **base escalável + landing** já migrada.
- Path aliases no `tsconfig` para imports limpos.

## 5. Esqueleto de pastas esperado

```
src/
  app/
    core/                          # singletons globais, sem UI
      config/                      # guards e services globais
        environments/              # environment.ts, environment.development.ts
      http/                        # client, interceptors (apenas esqueleto por ora)
      index.ts
    shared/
      ui/                          # primitivos visuais reutilizáveis (os componentes do React/Next)
        button/                    # diretiva appButton / appButtonPrimary / appButtonSecondary
          button.directive.ts
          button.directive.spec.ts # ATENÇÃO: nem todos os primitivos/componentes precisam ser testados, na maioria das vezes não precisam
          index.ts
        link/
        icon/
        action-label/
        dialog/
        section-heading/
        card/
      layout/                      # moldura estrutural
        header/
        footer/
        shell/
        skip-link/
      pipes/
      index.ts
    features/
      landing/
        sections/
          hero/
            hero.ts
            hero.html
            hero.css
            hero.spec.ts
          hero-background/
            hero-background.ts
            hero-background.html
            hero-background.css
            hero-background.spec.ts
          platform-overview/
          product-preview/
          faq/
        data/                      # conteúdo tipado, sem lógica
          benefits.ts
          steps.ts
          faq-items.ts
          roles.ts
          features.ts
        landing.routes.ts
      # futuras rotas/páginas: auth/, contracts/, tickets/, sla/, evidence/, reports/
    app.ts
    app.html
    app.config.ts
    app.config.server.ts
    app.routes.ts
    app.routes.server.ts
    app.spec.ts
  testing/                         # helpers reutilizáveis de teste
    helpers.ts
  styles.css                   # @import 'tailwindcss' + @theme para criação de classes e evitar css inline
  main.ts
  main.server.ts
  server.ts
  index.html
```

Regras:

- Nenhum arquivo de landing na raiz de `app/`.
- `shared/ui` nunca importa de `features` nem de `core`.
- `features` podem importar de `shared` e `core`; nunca entre si.
- Guards/services globais ficam em `core`.
- Dados mockados ou textos (como os da Landing Page) não ficam em componentes, fica em `features/.../data/`.
- `*.spec.ts` sempre ao lado do arquivo testado.
- `*.spec.ts` testar somente o que for necessário, evitar testes bobos.

## 6. Como os testes acontecem hoje

### Sobre testes unitários

Ferramentaria:

- Runner: **Vitest** (`vitest ^4.0.8`), via builder `@angular/build:unit-test` (`angular.json:76-78`).
- Ambiente DOM: **jsdom** (`jsdom ^28.0.0`).
- Tipos globais de teste: `vitest/globals` (`tsconfig.spec.json:7-8`).
- Configuração de teste: **não há** `vitest.config.*`; tudo vem do builder do Angular.
- Script disponível: apenas `"test": "ng test"` (`package.json:9`).

Como rodar:

```sh
npm test                 # modo watch (desenvolvimento)
npm test -- --watch=false   # execução única (CI/validação)
```

Onde estão (hoje):

- `src/app/app.spec.ts` — 2 testes: cria o `App` e valida o render da landing na rota `/` (h1, figcaption, 6 `details`).
- `src/app/landing/hero-background.spec.ts` — 6 testes: reprodução do vídeo, visibilidade, `prefers-reduced-motion`, bloqueio de autoplay, erro de mídia e liberação de recursos.
- Total atual: **8 testes** (confirmado no `README.md:58`).

Lacunas: não há testes para o menu móvel e foco (`landing.ts`), diálogo de disponibilidade (`availability-dialog.ts`), FAQ (`faq.ts`), visão de plataforma (`platform-overview.ts`) nem rotas.

### Sobre testes E2E

Apesar de conter arquivos como `test-results/` e `playwright-report/`, nenhuma dessas dependências foi realmente instalado, o **Playwright** não está instalado no projeto.

- **O que fazer?**

Os artefatos `test-results/` e `playwright-report/` são resíduos e não fazem parte da suíte atual. O Playwright já está configurado na `develop` (`playwright.config.ts`, `e2e/` e dependências), mas não chegou a esta branch porque ela foi criada antes do merge do setup.

Na sincronização da Fase 0, trazer o setup da `develop`, rodar `npx playwright install --with-deps` e ajustar `e2e/example.spec.ts` para o título real da landing. Manter o job de E2E no CI.

### Organização alvo dos testes

- Manter a co-locação: `<nome>.spec.ts` ao lado do arquivo.
- Testes de componente em `shared/ui/**/` e `shared/layout/**/` apenas onde houver comportamento a testar (evitar testes bobos); testes de fluxo de feature em `features/<feature>/**/`.
- `app.spec.ts` continua na raiz de `app/` (teste de integração da shell/rotas).
- Helpers comuns (ex.: criar harness, stub de `matchMedia`, stub de `IntersectionObserver`) centralizados em `src/testing/helpers.ts`.
- Adicionar scripts em `package.json`:
  - `"test:ci": "ng test --watch=false"`
  - `"test:coverage": "ng test --watch=false --coverage"`
- Adicionar os artefatos `test-results/` e `playwright-report/` no `.gitignore`.

## 6.5 Sincronização com a `develop`

A `feature/landing-page` foi criada a partir da `main` em 08/10, antes de o PR do setup (`chore/frontend-setup`) ser mergeado na `develop` em 16/10. Por isso ela está 5 commits atrás e não possui CI, ESLint, Playwright nem `zod`. Não se trata de arquivos removidos: eles nunca chegaram a esta branch.

### Passos para voltar ao fluxo ideal pela develop

**1. Feche o que está solto na branch atual**

```sh
git status
```

**2. Traga a develop**

```sh
git fetch origin
git merge origin/develop
```

**3. Resolva os 3 conflitos mantendo a união dos dois mundos**

- `package.json`: manter @lucide/angular; remover shaders (Fase 0.7); adicionar zod, @playwright/test, playwright-ng-schematics; manter os scripts serve:ssr:frontend.
- `angular.json`: manter "analytics": false; restaurar schematicCollections, os targets lint e e2e.
- `package-lock.json`: não edite à mão. Depois de resolver o package.json, rode npm install e aceite o lock gerado.

**4. Reinstale e valide**

```bash
npm install
npx playwright install --with-deps
npm run lint
npm test -- --watch=false
npm run build
npm run e2e
```

**5. Finalize**

```bash
git add -A
git commit -m "chore: sincroniza branch com a develop"
git push origin feature/landing-page
```

Depois abra o PR feature/landing-page → develop e valide os checks.

**6. Prevenção no GitHub**

- Proteja a develop: exigir PR, review e status checks (lint, unit-tests, e2e-tests, build).
- Marcar "Require branches to be up to date before merging".
- Padronizar: toda branch nova sai de origin/develop atualizada, nunca da main.

## 7. Tarefas passo a passo

Legenda de esforço: P = pequeno (≤1h), M = médio (meio dia), G = grande (1 dia).

### Fase 0 — Destravar o desenvolvimento

- [ ] **0.0 (M)** Executar a sincronização com a `develop` descrita na seção 6.5 antes de qualquer outra tarefa.
- [ ] **0.1 (M)** Reproduzir o timeout: rodar `npm start`, em outro terminal `curl -sv --max-time 35 http://localhost:4200/`; capturar a mensagem do terminal e conferir se há processo `esbuild` pendurado (`ps aux | grep esbuild`).
- [ ] **0.2 (M)** Confirmar a causa (colisão de cache de `styles:` inline do `@angular/build` 21.2.x). Registrar o resultado neste arquivo, na seção 3.
- [ ] **0.3 (M)** Aplicar a mitigação ainda na Fase 0: converter os `styles:` inline dos 4 componentes em `styleUrl`/`templateUrl` (estilos compartilhados vão para `src/styles.css`). A Fase 3 apenas confirma que não sobrou nenhum. Se o timeout persistir, registrar versão exata do `@angular/build`, log do dev server e processo pendente; só então avaliar pin em `21.2.13` ou upgrade para 22.x.
- [ ] **0.4 (P)** Em `angular.json`, no target `serve`, adicionar `"options": { "allowedHosts": ["localhost", "127.0.0.1"] }`.
- [ ] **0.5 (P)** Em `package.json`, adicionar `"dev": "ng serve"`.
- [ ] **0.6 (P)** Padronizar a porta de desenvolvimento em `4200` (default do `ng serve` e do `.vscode/launch.json:10`): remover `--port 4301` das instruções do `README.md` e ajustar também a variável de porta do `serve:ssr:frontend` documentada.
- [ ] **0.7 (P)** Remover a dependência morta `shaders` de `package.json:26` (não é importada em `src`).
- [ ] **0.8 (P)** Validar: `ng serve` acessível sem timeout em `localhost` e `127.0.0.1`; `npm run build` e `npm test -- --watch=false` verdes.

### Fase 1 — Esqueleto escalável

- [ ] **1.1 (P)** Criar a árvore de pastas de `src/app/` conforme a seção 5 (`core`, `shared/ui`, `shared/layout`, `features/landing/sections`, `features/landing/data`).
- [ ] **1.2 (P)** Em `tsconfig.json`, adicionar `paths`: `@app/core/*`, `@app/shared/*`, `@app/features/*` (e `baseUrl` se necessário).
- [ ] **1.3 (M)** Mover `landing/hero-background.ts` (+ spec) para `features/landing/sections/hero-background/`.
- [ ] **1.4 (M)** Mover `landing/platform-overview.*` para `features/landing/sections/platform-overview/`.
- [ ] **1.5 (M)** Mover `landing/product-preview.*` para `features/landing/sections/product-preview/`.
- [ ] **1.6 (M)** Mover `landing/faq.ts` para `features/landing/sections/faq/`.
- [ ] **1.7 (G)** Mover `landing/landing.ts/.html` e os 3 CSS (`landing.css`, `landing-sections.css`, `landing-responsive.css`) para `features/landing/`, renomeando para `landing.*` (ex.: `landing.css` unificado ou `landing.sections.css`/`landing.responsive.css` com nome claro). Extrair o `<section class="hero">` de `landing.html:34-49` para `features/landing/sections/hero/hero.*`.
- [ ] **1.8 (M)** Extrair conteúdo hardcoded para `features/landing/data/`: `benefits.ts` e `steps.ts` (de `landing.ts:24-71`), `faq-items.ts` (de `faq.ts:95-126`), `features.ts` e `roles.ts` (de `platform-overview.ts:12-48`). Tipar os arrays e importar nos componentes.
- [ ] **1.9 (M)** Mover primitivos globais para `shared/ui`: `icon.ts` → `shared/ui/icon/`, `action-label.ts` → `shared/ui/action-label/`, `availability-dialog.ts` → `shared/ui/dialog/`.
- [ ] **1.10 (M)** Mover a moldura: header, footer e skip-link saem de `landing.html`/`landing.css` para `shared/layout/header`, `shared/layout/footer`, `shared/layout/skip-link`. Ajustar `features/landing/landing.html` para compor esses componentes.
- [ ] **1.11 (P)** Criar `features/landing/landing.routes.ts` e ajustar `app.routes.ts:4` para carregar a feature (preparando lazy loading).
- [ ] **1.12 (P)** Atualizar todos os imports para os aliases e remover caminhos relativos profundos.
- [ ] **1.13 (P)** Validar: build, testes e navegação manual da landing.

### Fase 2 — Tailwind de verdade

Concluída mantendo a organização atual de `docs/STRUCTURE_GUIDE.md`: componentes em `features/landing/components/`. Esta entrega resolve o problema 1; não antecipa as extrações e diretivas das outras fases. As durações `--motion-*` permanecem variáveis globais consumidas por utilitários; os demais tokens usam os namespaces de tema do Tailwind.

- [x] **2.1 (M)** Configurar `src/styles.css` com `@import 'tailwindcss'`, `@theme` (cores, fontes, raios, sombras, espaçamentos, tipografia e curva) e `@layer base`.
- [x] **2.2 (G)** Migrar `features/landing/landing.*` para utilitários Tailwind em layout, grid, espaçamento, tipografia e cores; remover `landing.css`.
- [x] **2.3 (M)** Migrar `components/hero-background` e demais componentes para o esquema híbrido, preservando gradientes e transições nativas de diálogo em CSS.
- [x] **2.4 (M)** Migrar `components/product-preview/` preservando a composição, estados e dados ilustrativos.
- [x] **2.5 (P)** Remover CSS global morto e arquivos CSS esvaziados, seus `styleUrl` e os estilos inline dos ícones; conferir os budgets existentes.
- [x] **2.6 (P)** Comparar referências visuais em 320/390/768/1024/1440/1536 px, incluindo menu e diálogo, e validar build, lint e testes. Evidências em `docs/LANDING_TAILWIND_VALIDATION.md`.

> **Observação**: Com relação a responsividade, deve ser utilizado as classes do próprio Tailwind para resolver isso (`sm:`,`md:`,`lg:`,`xl:`,`2xl:`), mantendo assim o padrão visual em todas as páginas.

### Fase 3 — Componentes e consistência

- [ ] **3.1 (M)** Criar diretiva `shared/ui/button` com variantes (`appButton`, `appButtonPrimary`, `appButtonSecondary`) para uso em `<a>` e `<button>`; substituir `.button*` em `styles.css:69-73` e o markup repetido de `landing.html`.
- [ ] **3.2 (M)** Criar `shared/ui/link` (aparência/estilo de link de navegação) e aplicar onde hoje há classes soltas.
- [ ] **3.3 (M)** Criar `shared/ui/section-heading` e `shared/ui/card` se a migração revelar repetição (usar nas seções e na visão de plataforma).
- [ ] **3.4 (M)** Confirmar que não restou nenhum `style:` inline (isto também elimina o gatilho da Fase 0).
- [ ] **3.5 (M)** Reavaliar os focus-traps manuais (`landing.ts:110-117`, `availability-dialog.ts:145-161`): confiar no comportamento nativo do `<dialog>` e remover código redundante, mantendo devolução de foco ao acionador.
- [ ] **3.6 (P)** Adicionar `ChangeDetectionStrategy.OnPush` onde ausente e revisar signals/`input`.
- [ ] **3.7 (P)** Remover `NgZone`/`runOutsideAngular` de `hero-background.ts:21,25` se não fizer diferença em app zoneless.
- [ ] **3.8 (P)** Remover `src/app/app.css` vazio e limpar `app.html`/`app.ts` se necessário.
- [ ] **3.9 (P)** Validar build, testes e fluxos de teclado (menu, diálogo, skip-link).

### Fase 4 — Testes, qualidade e higiene

- [ ] **4.1 (P)** Adicionar scripts `test:ci` e `test:coverage` em `package.json`.
- [ ] **4.2 (M)** Criar `src/testing/helpers.ts` com stubs reutilizáveis (`matchMedia`, `IntersectionObserver`, harness de componente) e refatorar `hero-background.spec.ts` para usá-los.
- [ ] **4.3 (M)** Escrever `features/landing/landing.spec.ts` (abrir/fechar menu móvel, foco ao fechar, navegação por âncoras) e specs de seção para o diálogo de disponibilidade e o FAQ.
- [ ] **4.4 (P)** Manter/ajustar `src/app/app.spec.ts` para a nova estrutura (rota `/`, shell, componentes de layout).
- [ ] **4.5 (P)** Restaurar da `develop` o ESLint (`eslint.config.js`, dependências e scripts `lint`/`e2e`); adicionar os scripts `format` e `typecheck` (`tsc --noEmit`).
- [ ] **4.6 (P)** Atualizar `.gitignore` com `playwright-report/` e `test-results/`; remover os resíduos já existentes do repositório.
- [ ] **4.7 (P)** Restaurar o workflow de CI da `develop` (`.github/workflows/ci.yml`) e corrigir o job de testes para `npm run test -- --watch=false`; o job de lint já existe.
- [ ] **4.8 (P)** Atualizar `README.md` (estrutura, scripts de dev/teste) e este arquivo marcando as fases concluídas.

## 8. Ordem de execução e dependências

1. **Fase 0** primeiro: sem dev funcional, testar qualquer mudança fica doloroso.
2. **Fase 1** em seguida: mover arquivos antes de mudar conteúdo reduz conflito.
3. **Fase 2** depois: migrar estilo sobre a estrutura final, evitando retrabalho.
4. **Fase 3** em sequência: extrair componentes já no lugar certo.
5. **Fase 4** por último: cobertura e ferramentas sobre a base estável.

Dentro de cada fase, as tarefas estão em ordem de dependência. Tarefas marcadas P podem ser agrupadas em um único turno.

## 9. Critérios de conclusão (definition of done)

- `ng serve` acessível sem timeout em `localhost` e `127.0.0.1`.
- `npm run build` e `npm test -- --watch=false` verdes.
- `npm run lint` e `npm run typecheck` verdes (após 4.5).
- Nenhum arquivo de landing na raiz de `src/app/`.
- Nenhum `styles:` inline em componentes.
- Tailwind com `@theme` e utilitários efetivamente usados.
- Conteúdo textual e dados mockados fora de componentes (em `data/`).
- Suíte cobrindo menu, diálogo, FAQ e integração de rotas (primitivos sem lógica não exigem teste).
- Fidelidade visual e de acessibilidade preservada (teclado, foco, reduced motion, contraste).
