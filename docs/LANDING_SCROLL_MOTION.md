# Movimento da landing Nivelo

O refinamento preserva a composição A, as doze seções, a navbar, a identidade e o conteúdo factual. A referência solicitada é o [Isoline](https://8b.com/templates/isoline/demo.html). O HTML e os scripts públicos da referência foram examinados; o navegador conectado estava indisponível. A comparação de movimento partiu desses scripts, sem afirmar uma reprodução visual exata da página externa.

A tese é acompanhar o caminho **contrato → chamado → evidência → histórico**. Textos apresentam o contexto; as superfícies do exemplo se acomodam durante a rolagem; a fotografia revela o serviço e a linha do histórico acompanha seus registros. As demonstrações e os horários continuam ilustrativos.

A direção continua sendo **A — Fluxo de luz**, já aprovada, sem novo sorteio ou redesenho. O seletor de perfis e suas demonstrações locais continuam sendo a interação explorável. Nenhuma imagem ou filmagem foi adicionada: os ativos, créditos e avisos ilustrativos existentes foram mantidos.

## Comparação de comportamento

| Before | After | Why |
| --- | --- | --- |
| Uma entrada de 20 px para o bloco inteiro | Títulos com máscaras por frase e parágrafos em sequência | Dar ritmo à leitura sem fragmentar palavras ou duplicar texto acessível |
| Contrato e janela do chamado entram como blocos planos | Deslocamento, escala e perspectiva suaves ligados à rolagem | Mostrar a passagem do compromisso ao atendimento |
| Fotografia imóvel | Abertura por máscara e deslocamento dentro do próprio recorte | Aproximar o atendimento em campo do registro apresentado |
| Linha do histórico estática | Preenchimento por trecho conforme os registros passam | Tornar o percurso entre as ações visível |
| Moldura do celular estática em todas as telas | Inclinação e deslocamento leves em telas maiores | Introduzir a demonstração móvel sem mover seus controles |

## Gatilhos e limites

- Títulos: frases já presentes no HTML, em máscaras `.motion-line`, com entrada de 900 ms. As frases podem ocupar mais de uma linha visual no celular; nenhuma medição de texto ou alteração de DOM após a hidratação é necessária.
- Partes de cada bloco: 800 ms, deslocamento de 24 px e defasagem de 70 ms, limitada a 280 ms no total. Cada entrada ocorre uma vez, quando chega aos 90% superiores da área visível.
- Fotografia: máscara retangular de 1100 ms; deslocamento de +30 a −30 px e escala de 1,12 dentro do recorte. Abaixo de 768 px, o deslocamento é de +12 a −12 px.
- Contrato: deslocamento de 44 px, escala de 0,96 e inclinação inicial de −5° no eixo Y e −1° no eixo Z, acomodando até a posição final na entrada.
- Plataforma: deslocamento de 64 px, escala de 0,96 e inclinação inicial de 5° no eixo X e 1,5° no eixo Z, acomodando até a posição final na entrada.
- Celular: deslocamento de +42 a −18 px e inclinação de −3° a 1°. As inclinações e deslocamentos contínuos do contrato, plataforma e celular ficam desativados abaixo de 768 px.
- Hero: o fundo se desloca até 32 px enquanto o primeiro capítulo sai, com escala de 1,06 a 1,10. Título, ações e aviso permanecem no fluxo normal.
- Histórico: cada conexão cresce conforme o registro cruza a faixa entre 70% e 45% da altura da tela.

Os efeitos ligados à rolagem são reversíveis. A cena existente dos três prazos conserva sua faixa de `180svh`. A rolagem continua nativa; não foram adicionados GSAP, Lenis ou dependências.

## Implementação e acesso

`reveal.directive.ts` trata as entradas com `IntersectionObserver` e Web Animations API. `scroll-motion.directive.ts` compartilha um listener passivo, um lote de leitura/escrita por frame e observação de tamanho entre as superfícies visíveis. A geometria vem de molduras estáticas; as imagens transformadas não são usadas para medir sua própria posição. Valores já acomodados não são reescritos em cada frame. O trabalho de rolagem ocorre fora da atualização Angular.

A inicialização ocorre depois de `afterNextRender`. Antes disso, sem JavaScript ou sem as APIs de animação, os elementos permanecem legíveis. Foco em uma seção encerra suas entradas pendentes. A preferência por movimento reduzido cancela as entradas e os efeitos espaciais; o poster continua disponível. Observadores, eventos, frames e animações são liberados ao desmontar.

Os tokens de entrada são `--motion-reveal`, `--motion-line`, `--motion-image` e `--motion-stagger`, com o `--ease-out` existente e uma curva `--ease-in-out` para a máscara. `motion-timing.ts` converte tanto `900ms` quanto `.9s` para o valor esperado pela WAAPI. Essa conversão cobre a serialização de CSS feita pelo build de produção.

## Evidências

As rodadas ficam em `tmp/scroll-motion/round-1` e `round-2`: capturas completas em 1440, 768 e 390 px; estados de entrada e acomodação no desktop e celular; verificação em 320 px e telas baixas; registros de animação e amostra de execução com CPU limitada a 4×.

A primeira rodada identificou a conversão incorreta de segundos para milissegundos na leitura dos tokens. O ajuste recebeu testes unitários de regressão e verificação da duração real da máscara no build de produção. O teste de foco distingue as novas entradas WAAPI das transições de foco dos controles existentes, que foram preservadas.

A segunda rodada confirmou:

- Build de produção com `/` prerenderizada: 409,97 kB iniciais, estimativa de transferência de 98,58 kB, sem aviso de orçamento.
- Lint, checagem TypeScript dos E2E, 28 testes unitários e 46 E2E aprovados (23 em Chromium e 23 em Firefox). A suíte cobre navegação, diálogo, FAQ, vídeo, teclado, movimento reduzido, reversão dos efeitos e ausência das APIs de animação.
- Inspeção em 1440 × 900, 768 × 1024, 390 × 844, 320 × 700, 844 × 390 e 1024 × 600: sem overflow horizontal, imagens quebradas ou erros de página. Os elementos de rolagem ficam sem transformação com movimento reduzido.
- Capturas de entrada e acomodação revisadas em desktop e celular. O registro de execução contém 100 chamadas WAAPI no desktop e 74 no celular; a duração real da máscara no CSS otimizado é de 1100 ms.
- Inspector visual: zero falhas e três avisos relativos à escala tipográfica existente, ao texto secundário com contraste de 6,7:1 e às margens inferidas durante transformações. As molduras estáticas têm margens simétricas: 56 px no desktop e 32 px no tablet. A composição aprovada foi preservada.

O verificador `scenes.mjs` também foi executado e gerou a prancha de movimento reduzido, revisada integralmente. Ele não detecta as cenas Angular desta implementação, pois procura a estrutura própria `section.scene`/Stage do skill. As etapas e superfícies Angular foram verificadas pelas capturas locais de entrada/acomodação e pelos E2E, sem atribuir essa cobertura ao verificador genérico.

A revisão corrigiu a conversão dos tokens de tempo e a atualização inicial de superfícies que o Firefox ainda considerava recortadas pela máscara. As entradas ocorrem uma vez; os efeitos contínuos acompanham a rolagem de ida e volta. O HTML da navbar e do menu móvel permaneceu idêntico à versão anterior.

Na amostra isolada de rolagem rápida por seis segundos, com CPU limitada a 4× em Chromium desktop, o intervalo entre frames teve p95 de 33,4 ms e p99 de 50 ms com movimento; com movimento reduzido, ambos ficaram em 16,8 ms. A animação acrescenta custo nesse cenário e a amostra não garante 60 fps, nem representa GPU ou memória de um celular físico. O registro está em `tmp/scroll-motion/round-2/performance-isolated.json`.

## Revisão visual final

ROUND 2

Seen in one second: título sobre prazos e comprovação, acompanhado do fluxo luminoso azul.

Idea (one sentence): acompanhar visualmente a passagem dos compromissos do contrato aos registros do atendimento.

Live thing: seletor Gestor/Técnico/Cliente com demonstrações locais; efeitos de imagem, interface e histórico ligados à rolagem nativa.

Layout words by section: abertura=imagem ampla / benefícios=lista lateral / prazos=sequência fixa no desktop / contratos=duas colunas / como funciona=fluxo horizontal / plataforma=demonstração ampliada / evidências=fotografia lateral / histórico=linha temporal / perfis=seletor / celular=moldura vertical / FAQ=acordeão / fechamento=chamada ampla.

Scores: design 7,5 · usability 8 · creativity 7 · content 8 → overall 7,6 antes dos limites; **6,5 pela régua estrita do skill**.

Caps applied: a composição aprovada contém rótulos de seção, gradientes e sombras, e o título ocupa três linhas no celular. Esses elementos anteriores ao refinamento foram preservados conforme o escopo; a nota estrita não constitui uma avaliação independente de usuários.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `mobile-fold.jpg`: título em três linhas. Uma composição com duas linhas exigiria nova decisão de texto ou tipografia; foi mantida a direção aprovada. O texto está integralmente visível.
2. `desktop-page-01.jpg` e `desktop-page-02.jpg`: repetição dos títulos com segunda frase azul e dos rótulos de seção. Uma futura rodada de composição pode variar essa hierarquia; o refinamento atual preserva a identidade e acrescenta variação nos movimentos.
3. `desktop-page-02.jpg`: a fotografia contextual é ilustrativa e há poucas cenas fotográficas distintas. Fotografias reais do produto em uso podem fortalecer a comprovação quando existirem; nenhum cliente, atendimento ou resultado real foi simulado como prova.

Os problemas de tempo e geometria encontrados na primeira rodada foram corrigidos em conjunto. A segunda rodada não encontrou novos defeitos visuais que exigissem alterar a camada de movimento.
