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

O fundo atual é o vídeo fornecido pelo usuário, `Light_animation_sliding_on_surface_20261017210638.mp4`, preparado em [nivelo-hero-loop.mp4](../public/videos/nivelo-hero-loop.mp4). A arte mantém a luz azul e turquesa da composição Nivelo. Títulos, navegação, avisos e ações continuam em HTML. O antigo [nivelo-refraction.png](../public/images/nivelo-refraction.png) permanece arquivado no repositório.

O original tem 240 quadros a 24 fps. A preparação combina os 36 quadros finais e os 36 iniciais com uma mistura de peso cosseno durante 1,5 s; o restante do vídeo começa no quadro 36 e termina antes dessa mistura. O resultado tem 204 quadros, 8,5 s, resolução de 1280 × 720 e cerca de 1,9 MB. A codificação usa H.264, `yuv420p`, CRF 21 e `faststart`, sem faixa de áudio. A passagem do último para o primeiro quadro foi comparada à variação normal entre quadros. O poster [nivelo-hero-poster.webp](../public/images/nivelo-hero-poster.webp) foi extraído do primeiro quadro do loop.

O vídeo é decorativo, sem áudio, controles ou captura de cliques e toques. O player nativo repete o arquivo continuamente e só o carrega após a hidratação, quando a hero está visível e o movimento é permitido. Pausa fora da tela e com a aba oculta, retomando da mesma posição. Movimento reduzido, bloqueio de autoplay ou erro de mídia preservam o poster. Os recursos de reprodução são liberados ao desmontar. O gradiente escuro sobre o vídeo mantém a leitura do conteúdo.
