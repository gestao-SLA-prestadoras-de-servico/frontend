# Adaptação mobile — revisão por pontos

## 1. Histórico: círculo completo

Corrigido a partir da captura `Captura de tela 2026-11-02 172058.png` fornecida pelo usuário. A área do mostrador usava altura de `30svh`, `overflow: clip` e posição sticky no celular. Agora o círculo ocupa uma área quadrada de até 320 px, limitada à largura disponível, com altura automática e sem recorte. Abaixo de 760 px e em paisagem baixa de até 1023 × 600 px, o mostrador permanece na posição da seção e sai da tela com ela; não acompanha a lista. O desktop mantém o comportamento anterior.

Validação: build de produção, lint, TypeScript dos E2E e testes de regressão em Chromium e Firefox. Os testes verificam limites de todos os paths, proporção quadrada, ausência de overflow horizontal e posição no fluxo normal em 320 × 568, 390 × 844 e 844 × 390, com e sem redução de movimento. As cenas desktop existentes também foram verificadas. Capturas e medidas em `tmp/mobile-adapt/point-1/`; evidência principal: `390-history.png`. A validação usa viewports emulados, sem teste em aparelho físico ou Safari.

## 2. Evidências: cards e cordas

As três primeiras fotos passam de 100 para aproximadamente 129 px em uma tela de 390 px; o tamanho varia com a largura disponível. A escada mantém recuos progressivos de 2%, 4% e 6%, com a borda direita aproveitando a largura do contêiner. A última fotografia ocupa toda a largura do degrau, em formato 2:1, mostrando os dois equipamentos. Em telas abaixo de 360 px, texto e foto empilham dentro de cada degrau para evitar uma coluna de leitura estreita.

As cordas das evidências foram reduzidas de 100 para 36 px no celular e em paisagem baixa. Cada registro reserva 64 px acima e 36 px abaixo do conteúdo; a subida de entrada dessas fotos foi reduzida de 70 para 24 px, mantendo o balanço. A mudança não se aplica aos cartazes da seção dos três prazos.

Validação: build de produção, lint, TypeScript dos E2E e 34 testes em Chromium/Firefox, cobrindo a escada, a largura da última foto, a ausência de overflow e a distância entre cordas e texto durante a entrada, com e sem redução de movimento. Inclui regressões do ponto 1 e das cenas existentes. Capturas em 320, 390, 430, 768 e 1440 px em `tmp/mobile-adapt/point-2/after/`; os testes também cobrem paisagem de 844 × 390. As capturas isoladas da seção omitem apenas a navegação fixa durante a captura, sem alteração da interface. Não houve teste em aparelho físico ou Safari.

## Próximo ponto solicitado

3. Fazer os retângulos do fluxo cobrirem os textos inicialmente e se afastarem até as bordas conforme a rolagem.

O ponto 3 fica para a próxima etapa, após a revisão visual do ponto 2 solicitada pelo usuário.
