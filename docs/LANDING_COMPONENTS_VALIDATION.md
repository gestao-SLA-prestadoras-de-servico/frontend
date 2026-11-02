# Validação do item 3.3 — Componentes e consistência

Entrega de 02/11/2026. A auditoria encontrou `SectionHeading` e `Card` definidos e testados, mas sem uso na landing. A implementação atual aplica os dois primitivos à composição existente, mantendo Tailwind, elementos HTML, conteúdo, âncoras e movimento.

## SectionHeading

Arquivo: `src/app/shared/ui/section-heading/section-heading.directive.ts`.

| Variante | Aplicação | Contrato |
| --- | --- | --- |
| `responsive` (padrão) | Nove títulos gerais | Escala móvel/desktop em `md`, entrelinha 1,02, peso 550 e tracking −0,035em. |
| `statement` | Benefícios | Escala ampla, texto branco e medida máxima de 17ch. |
| `history` | Histórico | Escala específica do mostrador e sua narrativa, com a base tipográfica compartilhada. |

Os 11 títulos usam a diretiva em dez templates. As nove cópias do conjunto completo de utilitários de título foram removidas dos templates. As variantes antigas `inverse` e `prominent`, sem consumidores de produção, foram substituídas pelas variantes da composição atual. O título de acesso móvel mantém sua restrição local de largura; animações e spans de linha continuam nos elementos existentes.

```html
<h2 appSectionHeading id="workflow-title">...</h2>
<h2 appSectionHeading="statement" id="benefits-title">...</h2>
<h2 appSectionHeading="history" id="history-section-title">...</h2>
```

## Card

Arquivo: `src/app/shared/ui/card/card.directive.ts`.

| Variante | Aplicação | Contrato |
| --- | --- | --- |
| `benefit` (padrão) | Bloco editorial dos benefícios | Composição em uma coluna no celular e duas em telas amplas, com os alinhamentos e intervalos existentes. |
| `feature` | Três funcionalidades da plataforma | Tipografia da descrição e destaque do título em `strong`. |
| `role` | Três perfis ilustrativos | Relação entre figura e texto no celular e recuos graduais no desktop. |

O seletor passou de `article[appCard]` para `[appCard]`: o primitivo trata apresentação e conserva a semântica do elemento nativo. Benefícios continuam em `div`, funcionalidades em `p` e retratos em `figure`/`figcaption`. Há sete blocos renderizados consumindo a diretiva. Classes locais, atributos de identificação e ganchos de rolagem permanecem nos templates. Os antigos estilos de borda e padding, que pertenciam à composição anterior, foram substituídos pelos padrões atuais.

```html
<div class="statement-grid" appCard="benefit">...</div>
<p appCard="feature"><strong>Registro no contexto</strong>...</p>
<figure class="profile-portrait" appCard="role" data-profile>...</figure>
```

Ambos os primitivos mantêm `input()` tipado e classes Tailwind estáticas, detectáveis pelo compilador. A troca de variante substitui as classes anteriores e conserva as classes locais. Não há CSS de componente ou bindings inline de estilo.

## Verificação

- `npm run build`: aprovado, com `/` prerenderizada; bundle inicial de 453,34 kB, abaixo dos budgets existentes.
- `npm run lint`: aprovado.
- `npm test -- --watch=false`: 28 testes aprovados em oito arquivos. Os testes dos primitivos verificam preservação de elementos, classes locais e ganchos, além da troca reativa de variantes sem resíduos do layout anterior.
- `PLAYWRIGHT_TEST_BASE_URL=http://localhost:4320 npx playwright test --workers=2 --reporter=line`: 90 aprovados e dois ignorados em Chromium/Firefox. Inclui menu, diálogo, foco, FAQ, perfis, conteúdo sem JavaScript e regressões das animações e das três correções mobile.

As capturas e propriedades computadas foram conferidas em 320, 390, 768, 1024, 1440 e 1536 px, com 900 px de altura. As referências validadas da Fase 2 estão em `tmp/tailwind-migration/final/`; a nova composição está em `tmp/components-consistency/after/`. A comparação de 733 elementos por largura confirmou os tamanhos, espaçamentos, tipografia e cores dos elementos visíveis. A única diferença de propriedades está no contêiner das funcionalidades, que deixou de fornecer tipografia e cor por herança: esses valores agora pertencem aos próprios parágrafos via `Card`, sem mudança na apresentação. A conferência usa viewports emulados, sem aparelho físico ou Safari.

O vídeo opcional permanece comentado na landing: seu E2E de falha é ignorado em cada navegador quando o componente não existe na página; os seis testes unitários do vídeo continuam aprovados. Permanece o aviso preexistente `NG8113` do import sem uso de `HeroBackground`. Nenhuma dependência, rota, API ou configuração de budget foi alterada; a alteração preexistente em `package-lock.json` foi preservada.
