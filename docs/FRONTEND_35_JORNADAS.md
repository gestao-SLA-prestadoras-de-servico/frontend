# FRONTEND 35 — Jornadas visuais demonstrativas

Validação em 09/11/2026 com fixtures locais e interfaces Angular. Os cenários não autenticam usuários nem consultam serviços externos.

## Checklist

- [x] **Cliente:** estados de carregamento e vazio da lista; formulário com campos inválidos, preenchimento válido, confirmação demonstrativa e reinício. [Captura da validação](references/fe35/cliente-validacao.png).
- [x] **Técnico:** abertura do atendimento #1042, galeria de evidências, alternância de prévias, retorno de foco por Escape e confirmação demonstrativa. Os testes existentes também cobrem rejeição de arquivo inválido e feedback de conclusão. [Captura da prévia](references/fe35/tecnico-evidencia.png).
- [x] **Gestor:** erro e recuperação das notificações, filtros combinados e diálogo de exportação em preparação e conclusão simuladas. A jornada verifica ausência de escrita e armazenamento local. [Captura da exportação](references/fe35/gestor-exportacao.png).
- [x] **Alternância de perfis e abas:** teste existente da navegação entre perfis internos e teste de teclado das abas de perfis da landing. Os fluxos internos revisados não possuem componentes com papel de aba.

As jornadas estão em [visual-journeys.spec.ts](../e2e/visual-journeys.spec.ts). Com as suítes existentes de Cliente, Técnico, relatórios e notificações, **58 execuções passaram em Chromium e Firefox**. A verificação adicional de alternância de perfis e abas aprovou **4 execuções**, totalizando 62 execuções distintas. As capturas mostram cenários em 390 px; a revisão de larguras e foco das telas internas está em [FRONTEND_34_ACESSIBILIDADE.md](FRONTEND_34_ACESSIBILIDADE.md).

As confirmações e a exportação são apenas demonstrações; não há envio, criação de chamados ou download real. A execução não substitui testes com backend, tecnologias assistivas ou dispositivos físicos.
