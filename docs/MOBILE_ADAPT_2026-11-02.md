# Adaptação mobile — revisão por pontos

## 1. Histórico: círculo completo

Corrigido a partir da captura `Captura de tela 2026-11-02 172058.png` fornecida pelo usuário. A área do mostrador usava altura de `30svh`, `overflow: clip` e posição sticky no celular. Agora o círculo ocupa uma área quadrada de até 320 px, limitada à largura disponível, com altura automática e sem recorte. Abaixo de 760 px e em paisagem baixa de até 1023 × 600 px, o mostrador permanece na posição da seção e sai da tela com ela; não acompanha a lista. O desktop mantém o comportamento anterior.

Validação: build de produção, lint, TypeScript dos E2E e testes de regressão em Chromium e Firefox. Os testes verificam limites de todos os paths, proporção quadrada, ausência de overflow horizontal e posição no fluxo normal em 320 × 568, 390 × 844 e 844 × 390, com e sem redução de movimento. As cenas desktop existentes também foram verificadas. Capturas e medidas em `tmp/mobile-adapt/point-1/`; evidência principal: `390-history.png`. A validação usa viewports emulados, sem teste em aparelho físico ou Safari.

## Próximos pontos solicitados

2. Aumentar os cards das evidências, preservar a escada, aproveitar a largura do último item e ajustar o espaço e o comprimento das cordas no celular.
3. Fazer os retângulos do fluxo cobrirem os textos inicialmente e se afastarem até as bordas conforme a rolagem.

Os pontos 2 e 3 ficam para as próximas etapas, após a revisão visual do ponto 1 solicitada pelo usuário.
