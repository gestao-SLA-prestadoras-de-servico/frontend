# FRONTEND 34 — Acessibilidade e responsividade

Revisão das interfaces internas de Gestor, Técnico e Cliente com dados fictícios, em 09/11/2026.

Foram examinadas 14 rotas nas larguras de 320, 390, 768 e 1440 px: painel, fila e detalhe de chamado, relatórios, auditoria e áreas administrativas do Gestor; lista e atendimento do Técnico; lista, abertura e detalhe de chamado do Cliente. A inspeção automatizada verificou overflow horizontal, um título principal por página, rótulos de campos e nomes de botões visíveis. Foram também examinadas capturas das três áreas em desktop e celular. Esses resultados não substituem testes com tecnologias assistivas ou dispositivos físicos.

As mensagens das miniaturas de evidências pendentes ou com falha tinham contraste de **4,22:1** sobre o fundo da prévia. A alteração de `text-ink3` para o token existente `text-ink2` eleva a relação para **5,54:1**, mantendo o conteúdo e os estados. As capturas do mesmo painel em 390 px registram o [antes](references/fe34/evidencias-antes.png) e o [depois](references/fe34/evidencias-depois.png).

O teste [visual-accessibility.spec.ts](../e2e/visual-accessibility.spec.ts) verifica o contraste das três mensagens, largura e rótulos nas rotas revisadas em 320/768/1440 px, além de foco visível e retorno do menu móvel por teclado. Build de produção, lint e tipagem passaram. Os testes de acessibilidade e de regressão existentes executaram **22 cenários em Chromium e Firefox**, todos aprovados. Permanece o aviso preexistente `NG8113` referente ao `HeroBackground` da landing.
