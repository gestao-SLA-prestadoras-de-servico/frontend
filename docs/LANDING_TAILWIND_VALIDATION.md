# Validação da landing atual — Fase 2: Tailwind de verdade

Revisão de 02/11/2026, após o redesign Isoline e as três correções mobile. Escopo: subpontos 2.1–2.6 de `REFACTOR_LANDING.md`, preservando a composição, conteúdo, navbar, âncoras, acessibilidade e movimento. A alteração preexistente de `package-lock.json` foi mantida.

## Auditoria por subponto

A conclusão anterior não descrevia mais o código atual. O redesign havia introduzido 1.632 linhas em duas folhas globais da landing e mantido CSS local. Esta revisão substitui o registro de validação da composição anterior.

| Item | Situação encontrada | Resultado desta revisão |
| --- | --- | --- |
| 2.1 — configuração e tokens | `@import`, `@theme` e `@layer base` já existiam | Conferido; acrescentados tokens para as sombras de impressos, fundo dos cartazes e gradientes do vídeo. Espaçamento de seção alinhado à composição atual. |
| 2.2 — landing e layout | Não conforme: `landing-chapters.css` e `isoline.css` concentravam layout, tipografia e responsividade | Migrados para utilitários nos templates; ambas as folhas e seus imports foram removidos. |
| 2.3 — componentes | Parcial: capítulos novos dependiam das folhas globais; vídeo e diálogo tinham CSS próprio | Capítulos, SVGs, prendedores, pseudoelementos, abas, gradientes e transições usam utilitários/variantes Tailwind. Não há CSS local. |
| 2.4 — chamado ilustrativo | Já conforme: `product-preview` usava utilitários | Preservados composição, estados, três prazos, evidências e dados ilustrativos. Conferido nas seis larguras. |
| 2.5 — limpeza e budgets | Não conforme: folhas e referências locais ainda presentes, inclusive um CSS vazio | Removidos cinco arquivos CSS, dois imports e dois `styleUrl`. Não há estilos inline nem bindings `[style]` em `src/app`. Budgets mantidos. |
| 2.6 — visual e testes | Evidência anterior desatualizada para o redesign | Comparação da composição atual nas seis larguras, confirmação em telas baixas, build, lint, tipos, 28 testes unitários e 90 E2E aprovados. Dois E2E do vídeo opcional foram ignorados, conforme explicado abaixo. |

## Como os estilos estão organizados

- `src/styles.css` é o único CSS em `src/`: importa Tailwind, carrega Manrope, define tokens `@theme`, a animação do menu e os padrões `@layer base` de documento, foco e tipografia. Essa configuração é parte do requisito 2.1; não contém folhas de capítulos nem `@layer components`.
- Layout, tamanho, grid, espaçamento, tipografia, cores, sombras, estados e pseudoelementos ficam em classes detectáveis nos templates e hosts Angular. Não houve substituição das folhas antigas por blocos `@apply` com classes semânticas.
- Nomes como `record-row`, `motion-line` e `strata-stage` permanecem como identificadores dos testes e das cenas de movimento; não possuem regras CSS próprias.
- Gradientes do vídeo usam `--background-image-*` e classes `bg-hero-shade*`. O diálogo mantém entrada e saída nativas com `supports-*`, `open:`, `starting:`, `backdrop:` e `transition-discrete`.
- Valores contínuos dos contornos SVG usam atributos de apresentação `fill`, `fill-opacity` e `stroke`. A Web Animations API continua responsável pelo progresso de rolagem, inicialização após hidratação e limpeza. Não foi trocada por uma biblioteca ou por bindings inline de estilo.

Os padrões seguem as referências oficiais de [tema](https://tailwindcss.com/docs/theme), [responsividade](https://tailwindcss.com/docs/responsive-design), [variantes de estado](https://tailwindcss.com/docs/hover-focus-and-other-states) e [transições discretas](https://tailwindcss.com/docs/transition-behavior).

## Responsividade e equivalência visual

Os capítulos usam `md` (768 px), substituindo o corte anterior de 760 px. O driver de movimento foi alinhado ao mesmo valor, com regressão adicional em 767 px. A navbar mantém `lg` (1024 px), a aparência e os comportamentos existentes. Permanecem os ajustes de conteúdo em 360/400 px e as condições de altura, expressos por variantes Tailwind nos elementos; não há folhas paralelas de media queries.

Capturas de página inteira, menu móvel e diálogo foram feitas antes da migração e após a correção conjunta, em Chromium com movimento reduzido. A comparação de propriedades computadas de 733 elementos por largura confirmou igualdade de tamanhos, margens, paddings e tipografia. Representações equivalentes de sombras Tailwind, alinhamento lógico e raio circular foram aceitas; não se afirma comparação pixel a pixel. As medidas e capturas da confirmação estão em `tmp/tailwind-migration/{before,after,final}/`, ignorado pelo Git. Script: `tmp/tailwind-migration/capture.mjs`.

| Largura × altura | Overflow horizontal | Navegação | Diálogo e layout |
| --- | --- | --- | --- |
| 320 × 900 | Ausente | Menu móvel | Conferidos |
| 390 × 900 | Ausente | Menu móvel | Conferidos |
| 768 × 900 | Ausente | Menu móvel | Conferidos |
| 1024 × 900 | Ausente | Desktop | Conferidos |
| 1440 × 900 | Ausente | Desktop | Conferidos |
| 1536 × 900 | Ausente | Desktop | Conferidos |

Também foram confirmados 390 × 667, 844 × 390 e 1024 × 600, com ações do hero acessíveis. A confirmação visual inclui paisagem baixa com movimento habilitado e reduzido. Os E2E validam o círculo completo, a escada das evidências e a cobertura/abertura reversível das faixas do fluxo, incluindo movimento reduzido e ausência de APIs. A validação foi feita por viewports emulados, sem aparelho físico ou Safari.

## Verificação final

| Comando / verificação | Resultado |
| --- | --- |
| `npm run build` | Passou; rota `/` prerenderizada |
| `npm run lint` | Passou |
| `npx tsc --noEmit --project e2e/tsconfig.json` | Passou |
| `npm test -- --watch=false` | 28 testes aprovados, 8 arquivos |
| `PLAYWRIGHT_TEST_BASE_URL=http://localhost:4320 npx playwright test --workers=2 --reporter=line` | 90 aprovados, 2 ignorados; Chromium e Firefox |
| CSS local, `styleUrl`, `styles:` e bindings de estilo | Nenhuma ocorrência em `src/app` |
| Bundle inicial | 453,73 kB; transferência estimada de 107,03 kB |
| Budgets | Sem avisos de tamanho; limites de 500 kB/1 MB e 10/12 kB por componente preservados |

A composição atual mantém o vídeo opcional comentado em `landing.html`. Por isso o cenário E2E de erro de vídeo fica ignorado em cada navegador quando o componente não é renderizado; volta a executar se a janela de vídeo for utilizada. Os testes de SSR e movimento reduzido verificam a ilustração efetivamente exibida. Os seis testes unitários de `HeroBackground` continuam cobrindo reprodução, preferência de movimento, bloqueio de autoplay, erro e liberação de recursos. O build mantém o aviso preexistente `NG8113` do import sem uso de `HeroBackground`.

Nenhuma dependência, API, rota, autenticação, coleta de contatos ou configuração de budget foi adicionada.