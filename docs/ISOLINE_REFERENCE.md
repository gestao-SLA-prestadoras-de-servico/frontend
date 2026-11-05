# Nivelo — composição e movimento Isoline

O pedido de 31/10/2026 substitui a composição anterior por uma reprodução visual de [Isoline, por 8B](https://8b.com/templates/isoline/demo.html), adaptada à identidade da Nivelo. A gravação local `Gravando 2026-10-30 234018.mp4` (1918 × 866, 30,47 s) fornecida pelo usuário é a referência de movimento. O HTML público e a prévia oficial também foram examinados. O acesso por interface foi interrompido pela ferramenta, que não conseguiu validar a URL atual; não foi considerada uma inspeção interativa completa do site externo.

## Correspondência visual

| Referência | Tradução Nivelo |
| --- | --- |
| Título amplo, figura recortada e campo de contornos | Proposta de chamados, prazos e evidências; gestor ilustrativo; camadas azuis e turquesa |
| Segundo painel azul com três âncoras | Benefícios e acesso aos prazos, histórico e evidências |
| Três cartazes suspensos em alturas diferentes | Resposta, atendimento em campo e resolução |
| Mostrador colorido ao lado da agenda | Quatro eventos ilustrativos do chamado #1042 |
| Fotografias em degraus | Solicitação, acompanhamento, serviço em campo e evidências |
| Estratos que se abrem | Configure, Distribua, Registre e Valide |
| Retratos com contornos | Gestor, Técnico e Cliente, seguidos das simulações locais existentes |
| Faixas de eventos que mudam de cor | Situação dos três prazos do chamado ilustrativo |
| Tabela de trabalhos e planos | Relações entre contrato, chamado, compromissos, histórico e evidências; sem preços |
| Visita e palavra de fechamento ampla | Consulta de disponibilidade e palavra Nivelo no rodapé; sem formulário de contatos |

Manrope, paleta, símbolo original e navbar foram preservados. O vídeo de luz anterior permanece em um recorte na abertura, com o poster e seus fallbacks. Dados operacionais seguem identificados como exemplos; não foram adicionados clientes, depoimentos, preços, métricas ou prazos comerciais.

## Movimento implementado

O driver de rolagem existente foi ampliado, sem nova dependência: WAAPI pausada e atualizada pela rolagem nativa, um listener passivo e um lote por frame fora da atualização Angular. Molduras estáveis fornecem a geometria. Inicialização após hidratação, observação compartilhada e limpeza ao desmontar.

| Before | After | Why |
| --- | --- | --- |
| Fotografia/vídeo amplo de fundo | Contornos SVG que se expandem, enquanto figura e texto recuam | Reproduzir a transição de profundidade da abertura |
| Três prazos sobre uma linha horizontal | Cartazes que descem e oscilam de −3,2° a 0°, alternando a direção | Reproduzir a suspensão e a sequência da referência |
| Histórico estático junto do texto | Contornos cujas camadas se deslocam e atravessam azul, verde e azul-noite | Relacionar a passagem pela sequência ao atendimento |
| Fluxo em quatro colunas | Doze faixas que se afastam para revelar quatro etapas | Reproduzir a abertura em estratos do vídeo |
| Capítulos com um mesmo tipo de entrada | Máscaras de texto, balanço, expansão, revelação fotográfica e faixas coloridas | Variar o movimento conforme a composição |

As entradas mantêm 800 ms, títulos 900 ms e fotografias 1100 ms; o balanço e as transformações maiores são controlados pela posição da rolagem. Os efeitos são reversíveis e não capturam a roda do mouse. A preferência por movimento reduzido cancela os efeitos espaciais e apresenta a arte estática; sem as APIs, texto e conteúdo continuam visíveis. No celular, os cartazes ficam em sequência e o mostrador ocupa uma faixa menor. As abas, o diálogo e o menu mantêm teclado, foco e retorno de foco.

## Ativos e atribuição

As geometrias dos contornos foram adaptadas do [código Isoline por 8B](https://github.com/8bsite/coworking-website-template), distribuído sob [licença MIT](references/isoline-MIT-LICENSE.txt), preservada integralmente no projeto. Não foram importados scripts de analytics, formulários, GSAP ou Lenis da referência. Fotografias do coworking e textos comerciais da referência não são publicados na Nivelo.

Novos ativos: `public/images/nivelo-gestor-ilustrativo.webp`, `nivelo-tecnico-ilustrativo.webp` e `nivelo-cliente-ilustrativo.webp`. Foram produzidos com a ferramenta integrada `image_gen`, com transparência, e otimizados para WebP. Os três passaram de 4,69 MB para cerca de 217 kB, com alpha preservado. Prompts exatos em [isoline-figures-prompts.json](references/isoline-figures-prompts.json) e nos sidecars adjacentes (fallback do comando de proveniência para WebP). As imagens estão identificadas como geradas por IA nas seções. Não representam membros da equipe, clientes ou atendimentos reais.

A fotografia de manutenção, as imagens de equipamentos, o símbolo e o vídeo/poster anteriores foram reutilizados com suas origens e avisos existentes. Não foi criada prova comercial fictícia. Fotografias reais poderão substituir as ilustrações quando estiverem disponíveis.

## Verificação

Primeira rodada: capturas em 1440, 768 e 390 px, estados de movimento e verificações adicionais em 320 px e tela baixa. Sem imagens quebradas, overflow horizontal ou erros de página. Encontrou sobreposição da ação com a figura no tablet e viewBox inadequado no mostrador do celular; ambos foram corrigidos no mesmo lote. Os recortes também foram otimizados antes da captura final.

A confirmação final passou no build de produção, lint, checagem TypeScript dos E2E, 28 testes unitários e 52 E2E (26 Chromium, 26 Firefox). O build prerenderizou `/`, com 435,57 kB iniciais e estimativa de transferência de 105,76 kB, sem aviso de orçamento.

Foram verificados navegação por teclado, abas e simulações, menu, âncoras, diálogo e retorno de foco, FAQ, vídeo, falha de mídia, movimento reduzido dinâmico e ausência das APIs de animação. As novas cenas têm testes de expansão, mudança de cor, abertura e reversão. Cinco dimensões adicionais foram medidas pelo script de captura: 1440 × 900, 768 × 1024, 390 × 844, 320 × 700 e 844 × 390, sem overflow horizontal, imagens quebradas ou erros de página. Os E2E também cobrem 1024, 1536 e outras alturas baixas.

A confirmação detectou e corrigiu uma regra de empilhamento das ações em paisagem e uma falha específica do Firefox ao manter os contornos SVG ampliados atrás do painel seguinte. Os estratos externos agora retornam após a expansão, como na referência; a geometria ampliada é liberada quando o segundo painel a cobre e é recomposta ao voltar pela rolagem. O teste que expôs a falha passou nos dois navegadores.

O inspector final registrou zero falhas e cinco avisos: diversidade de tamanhos tipográficos, texto secundário com contraste de 5,5:1, vídeo abaixo do limiar de área do detector, espaço ao lado do título do fluxo e repetição dos estados da demonstração no celular. A tipografia ampla, os espaços e as faixas reproduzem a referência escolhida; o contraste atende ao mínimo de leitura; o vídeo existe em recorte pequeno; os estados da demonstração preservam informação operacional. Nenhum aviso foi apresentado como uma falha corrigida sem evidência.

O verificador genérico `scenes.mjs` também foi executado e sua prancha de movimento reduzido foi revisada. Ele procura a estrutura `section.scene`/Stage própria do skill, ausente nesta implementação Angular; não foi atribuído a ele o teste das cenas nativas. Essa cobertura vem dos E2E e das capturas de entrada e acomodação.

Uma amostra isolada de rolagem rápida da página inteira por seis segundos, em Chromium desktop com CPU limitada a 4×, registrou p95 de 66,7 ms e p99 de 83,3 ms entre frames com movimento, contra 16,7 e 16,8 ms com movimento reduzido. Essa carga expõe o custo das cenas e não sustenta promessa de 60 fps em aparelhos modestos. Não é uma medição de GPU ou memória de celular físico. O registro está em `tmp/isoline-copy/round-2/performance.json`.

A revisão independente retornou **ship**, sem correções materiais, comparando os quatro tamanhos de captura, as imagens de referência, estados de movimento e trechos do código. O parecer registra explicitamente que a paridade temporal exata não foi verificada por reprodução contínua. Parecer completo em `tmp/isoline-copy/finish-review.md`.

Evidências locais em `tmp/isoline-copy/round-1`, `round-2` e `.impeccable/review`. A prévia roda em `http://localhost:4310`.

## Crítica da segunda rodada

ROUND 2

Seen in one second: proposta de prazos e comprovação, figura em atividade e contornos azuis.

Idea (one sentence): traduzir a profundidade e os movimentos de Isoline para a passagem entre compromisso, atendimento e registro na Nivelo.

Live thing: três perfis com simulações locais, além das cenas reversíveis de rolagem.

Layout words by section: abertura=campo e figura / benefícios=declaração / prazos=cartazes suspensos / histórico=mostrador e lista / evidências=degraus / fluxo=estratos / perfis=retratos e seletor / plataforma=interface e faixas / contratos=tabela / celular=moldura vertical / FAQ=acordeão / disponibilidade=texto e contornos.

Scores: design 8 · usability 8 · creativity 7 · content 8 → overall 7,8 antes dos limites; 6,5 na régua estrita do skill, que limita títulos com três linhas, sombras e divisórias. Esses recursos pertencem à referência escolhida e à navbar preservada, e não foram removidos para elevar a nota automática. A avaliação é uma leitura interna do render, não pesquisa com usuários.

Caps applied: título em três linhas no desktop e celular e em quatro no tablet; sombra da navegação e divisórias presentes na composição solicitada.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `round-1/768-fold.png`: ação sobre a figura. Corrigida com empilhamento das ações no tablet, confirmado na segunda rodada.
2. `round-1/390-historico.png`: recorte do círculo por viewBox inadequado. Corrigido para a geometria original 1000 × 1000 e confirmado no celular.
3. Captura adicional `round-2/844-fold.png`: a confirmação funcional detectou ações abaixo da dobra na regra inicial de paisagem. Corrigida a composição de tela baixa; ambas as ações e o aviso estão integralmente visíveis na captura de entrega.

Sem rodada adicional de mudanças estéticas após a confirmação; eventuais correções da revisão independente são registradas no respectivo parecer.
