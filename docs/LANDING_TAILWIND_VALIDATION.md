# Validação da migração da landing para Tailwind 4

Entrega: problema 1 do diagnóstico e tarefas 2.1–2.6 de `REFACTOR_LANDING.md`. A organização permanece em `features/landing/components/`, com os contratos Angular, conteúdo e ativos existentes preservados. A alteração preexistente em `package-lock.json` foi mantida.

## Implementação

- Tokens em `src/styles.css`, com namespaces `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`, `--spacing-*`, `--text-*` e `--ease-*` em `@theme`.
- Padrões de documento, tipografia e foco em `@layer base`; durações `--motion-*` consumidas pelas classes Tailwind.
- Cabeçalho, menu, hero, benefícios, fluxo, plataforma, chamado, FAQ, rodapé, diálogo, ícones e rótulos animados migrados para utilitários detectáveis nos templates e hosts.
- Removidos `landing.css`, `faq.css`, `platform-overview.css` e `product-preview.css`, com seus `styleUrl`. CSS específico restante: gradientes do fundo e transições nativas de diálogo.
- Breakpoints padrão: `sm` para composições intermediárias, `lg` para navegação desktop e composições amplas, `xl` para recuos maiores e `2xl` para o respiro inferior do hero. Variantes específicas preservam telas baixas, horizontal e conteúdo estreito do chamado.
- Animações de rotação e deslocamento dos botões limitadas a `motion-safe`; FAQ, menu, diálogo e vídeo respeitam movimento reduzido.

O mapeamento segue as referências oficiais de [tokens de tema](https://tailwindcss.com/docs/theme) e [responsividade](https://tailwindcss.com/docs/responsive-design).

## Comparação visual

Capturas anteriores à migração comparadas com a versão final no Chrome, com viewport de 900 px de altura e movimento reduzido para manter o poster consistente. Conferidos página completa, menu nas larguras móveis e diálogo em todas as larguras. As imagens de evidência também foram carregadas na conferência final.

| Largura | Rolagem horizontal | Navegação  | Diálogo   |
| ------- | ------------------ | ---------- | --------- |
| 320 px  | Ausente            | Menu móvel | Conferido |
| 390 px  | Ausente            | Menu móvel | Conferido |
| 768 px  | Ausente            | Menu móvel | Conferido |
| 1024 px | Ausente            | Desktop    | Conferido |
| 1440 px | Ausente            | Desktop    | Conferido |
| 1536 px | Ausente            | Desktop    | Conferido |

As medidas principais de hero, benefícios, fluxo e FAQ se mantiveram. Em 1536 px, o título do hero sobe 20 px com o respiro de `2xl`, antes aplicado somente a partir de 1600 px. A migração dos breakpoints também passa as transições de 600/900/1200 px para os pontos padrão do Tailwind. Pequenas diferenças de arredondamento e altura no exemplo de chamado foram aceitas na comparação visual.

As capturas locais ficam em `tmp/landing-tailwind/{before,after,final}/`, ignoradas pelo Git.

## Verificação funcional e build

| Verificação                                       | Resultado                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `npm run build`                                   | Passou; `/` prerenderizada                                                            |
| `npm run lint`                                    | Passou                                                                                |
| `npm test -- --watch=false`                       | 12 testes passaram                                                                    |
| `npx playwright test --workers=2 --reporter=line` | 26 testes passaram em Chromium e Firefox                                              |
| Utilitários personalizados no CSS de produção     | Conferidos cores, raios, espaçamento, sombras e curva; Manrope e durações preservadas |
| Budget inicial                                    | 383,00 kB; abaixo do aviso de 500 kB e limite de 1 MB                                 |
| Budget de CSS por componente                      | Sem avisos; limites de 10/12 kB mantidos                                              |

Os E2E cobrem as seis larguras, contenção e retorno de foco, Escape, Tab/Shift+Tab, navegação por âncora, fechamento do menu em 1024 px, FAQ por teclado, poster com movimento reduzido, fallback após erro de vídeo e ações acessíveis em 390×667, 844×390 e 1024×600. A conferência adicional no navegador verificou o feedback dos botões com movimento habilitado e sua supressão com movimento reduzido.

Os navegadores compatíveis com a versão instalada do Playwright foram instalados para executar a configuração padrão. Nenhuma dependência ou configuração de budget foi alterada.
