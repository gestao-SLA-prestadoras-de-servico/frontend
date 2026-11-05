# Identidade Nivelo

A identidade foi estabelecida com a opção **C — Faixa de luz**, em `.impeccable/mocks/nivelo-20261016/c-faixa-de-luz.png`. Em 31/10/2026, o usuário substituiu a composição **A — Fluxo de luz** pela referência **Isoline, da 8B**, com a gravação fornecida como autoridade de movimento. Manrope, paleta, símbolo original e navbar foram preservados. A fonte da verdade visual implementada é [DESIGN.md](../DESIGN.md); o briefing da landing está em [src-app-app-html.md](../.impeccable/surfaces/src-app-app-html.md), e a composição atual, suas atribuições e sua verificação estão em [ISOLINE_REFERENCE.md](ISOLINE_REFERENCE.md).

A referência A anterior permanece arquivada sem alterações em [nivelo-opcao-a-fluxo-de-luz.png](references/nivelo-opcao-a-fluxo-de-luz.png), com origem e autorização registradas no [sidecar](references/nivelo-opcao-a-fluxo-de-luz.png.json). Ela não é exibida no site e não é mais a autoridade da composição atual. Seus números, textos e elementos de interface não estabelecem fatos do produto, resultados comerciais ou disponibilidade. [LANDING_FLUXO_DE_LUZ.md](LANDING_FLUXO_DE_LUZ.md) e [LANDING_SCROLL_MOTION.md](LANDING_SCROLL_MOTION.md) preservam o histórico dessa entrega.

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

A composição atual combina contornos azuis e verdes em camadas, pessoas recortadas, cartazes suspensos, fotografias em degraus e faixas amplas. As geometrias foram adaptadas da referência Isoline sob [licença MIT preservada](references/isoline-MIT-LICENSE.txt); a atribuição pública está em `public/licenses`. Esses contornos são arte da apresentação e não substituem o símbolo da Nivelo. A entrega não importa fotografias de coworking, textos comerciais ou scripts de terceiros da referência.

O vídeo fornecido pelo usuário, `Light_animation_sliding_on_surface_20261017210638.mp4`, preparado em [nivelo-hero-loop.mp4](../public/videos/nivelo-hero-loop.mp4), ocupa agora uma pequena janela da abertura. A arte mantém a luz azul e turquesa da composição Nivelo; não é mais o fundo amplo da landing. Títulos, navegação, avisos e ações continuam em HTML. O antigo [nivelo-refraction.png](../public/images/nivelo-refraction.png) permanece arquivado no repositório.

O original tem 240 quadros a 24 fps. A preparação combina os 36 quadros finais e os 36 iniciais com uma mistura de peso cosseno durante 1,5 s; o restante do vídeo começa no quadro 36 e termina antes dessa mistura. O resultado tem 204 quadros, 8,5 s, resolução de 1280 × 720 e cerca de 1,9 MB. A codificação usa H.264, `yuv420p`, CRF 21 e `faststart`, sem faixa de áudio. A passagem do último para o primeiro quadro foi comparada à variação normal entre quadros. O poster [nivelo-hero-poster.webp](../public/images/nivelo-hero-poster.webp) foi extraído do primeiro quadro do loop.

O vídeo é decorativo, sem áudio, controles ou captura de cliques e toques. O player nativo repete o arquivo continuamente e só o carrega após a hidratação, quando sua moldura está visível e o movimento é permitido. Pausa fora da tela e com a aba oculta, retomando da mesma posição. Movimento reduzido, bloqueio de autoplay ou erro de mídia preservam o poster. Os recursos de reprodução são liberados ao desmontar. A pequena janela mantém a sobreposição do player; o texto principal da abertura está sobre fundo claro.

Fluxo e disponibilidade usam agora faixas e contornos da referência atual. O SVG da marca, o MP4 e o WebP existentes foram reutilizados sem recriação. O poster permanece como fallback da janela de vídeo.

A foto complementar [manutencao-ilustrativa.png](../public/images/manutencao-ilustrativa.png) foi gerada em 30/10/2026 com a ferramenta integrada `image_gen`. Mostra um técnico documentando uma unidade de climatização com o celular e traz a indicação visível “Imagem gerada por IA · ilustrativa”. Não representa equipe, cliente ou atendimento real. O PNG foi preservado sem conversão. O [prompt exato](references/manutencao-ilustrativa.prompt.txt) e o [sidecar da imagem](../public/images/manutencao-ilustrativa.png.json) registram sua proveniência; o prompt também está embutido no arquivo.

Os novos recortes [Gestor](../public/images/nivelo-gestor-ilustrativo.webp), [Técnico](../public/images/nivelo-tecnico-ilustrativo.webp) e [Cliente](../public/images/nivelo-cliente-ilustrativo.webp) foram produzidos com `image_gen`, com fundo transparente, e otimizados para WebP com alpha preservado. Os três somam cerca de 217 kB. Seus [prompts exatos](references/isoline-figures-prompts.json) e sidecars adjacentes preservam a origem. A página os identifica como pessoas geradas por IA e ilustrativas dos perfis previstos; não representam membros da equipe, clientes ou atendimentos reais.

As imagens menores de evidências já existentes continuam identificadas como ilustrativas no chamado #1042 e na demonstração de navegador do celular. Nenhuma fotografia ou demonstração deve ser apresentada como prova de operação real.
