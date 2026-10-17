# Identidade Nivelo

A identidade atual foi aprovada com a opção **C — Faixa de luz**, em `.impeccable/mocks/nivelo-20261016/c-faixa-de-luz.png`. A fonte da verdade visual implementada é [DESIGN.md](../DESIGN.md); o briefing da landing está em [src-app-app-html.md](../.impeccable/surfaces/src-app-app-html.md).

O símbolo adotado é o **check em camadas da primeira imagem do usuário**, traçado em [nivelo-symbol.svg](../public/images/nivelo-symbol.svg). Sua proporção original é 780 × 626 e suas camadas usam turquesa `#03CBD3`, azul `#0498F4` e azul profundo `#073BD4`. Preservar o arquivo e sua geometria. O símbolo diferente da prancha de identidade não é a marca adotada.

A prancha fornecida fixa a família **Manrope** e a seguinte paleta de marca:

| Papel | Valor |
|---|---|
| Azul-noite | `#10243A` |
| Azul corporativo | `#2864DC` |
| Verde operacional | `#19A68C` |
| Slate | `#64748B` |
| Off-white | `#F4F7FB` |

Os valores de apoio no CSS incluem variantes escuras para texto e estados, ciano luminoso e os tons do símbolo. O slate da prancha não é o token de texto pequeno da landing; os valores efetivos estão no frontmatter de `DESIGN.md` e em `src/styles.css`.

Manrope é servida localmente em WOFF2 variável, pesos 400–800. Origem e licença estão em [public/fonts/README.md](../public/fonts/README.md). A marca textual usa NIVELO e o descritor GESTÃO DE SLA, sem converter o texto em imagem.

O fundo [nivelo-refraction.png](../public/images/nivelo-refraction.png) foi gerado a partir do comp aprovado como ativo atmosférico sem texto. Seu sidecar registra o prompt e a referência. Títulos, navegação, avisos e ações são HTML. A camada animada usa `shaders/js` após a hidratação, sem telemetria; a imagem estática permanece como base e fallback.

Os parâmetros originais do shader solicitados no plano não foram fornecidos. A implementação usa valores ajustados à composição C, registrados em `src/app/landing/hero-background.ts`: `Swirl` (detail 1.5, speed 0.16), `ChromaFlow` (radius 4, opacity 0.7), `FlutedGlass` (aberration 0, angle 0, frequency 48, lightAngle -90, refraction 4, shape rounded, softness 1) e `FilmGrain` (strength 0.06, animated false). Esses valores são uma adaptação documentada, não uma reprodução de parâmetros originais desconhecidos.

O shader é decorativo: não executa com movimento reduzido ou sem WebGPU, pausa fora da tela e com a aba oculta, tem resolução limitada e é destruído ao desmontar. A refração não contém informação exclusiva, logo, interfaces ou dados de produto.
