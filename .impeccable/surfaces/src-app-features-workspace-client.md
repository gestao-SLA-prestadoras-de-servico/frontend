---
version: 1
slug: 'src-app-features-workspace-client'
primary_target: 'src/app/features/workspace/client'
related_targets:
  - 'src/app/features/workspace/workspace.routes.ts'
  - 'src/app/app.routes.server.ts'
---

# Portal Cliente Nivelo — FE-010 a FE-012

Mode: Operate. Público: contato do cliente que consulta solicitações, abre um chamado e revisa o atendimento. Uso pelo navegador em desktop, tablet e celular.

Direction contract: extensão do shell existente, implementada em código conforme o plano aprovado. As referências orientam os cards e o fluxo; a identidade permanece Nivelo. Não substituir o mundo visual global, o shell ou os componentes de Gestor e Técnico.

THESIS: deixar claro o que está em atendimento, o que exige revisão e quais são os três compromissos de prazo.

OWN-WORLD: Manrope local; tokens de `src/styles.css`; azul corporativo nas ações, azul-noite no texto, verde escuro para prazos cumpridos; estados usam cinza aberto, azul atribuído, turquesa em atendimento, âmbar aguardando validação e verde encerrado. Prioridades usam verde suave (baixa), cinza azulado (normal), âmbar (alta) e vermelho Nivelo (crítica). Todas conservam rótulo textual e contraste AA. Superfícies claras, bordas discretas, cartões de 12 px e controles de ação em cápsula. Primitivos de botão e foco da Nivelo, ícones Lucide. Nada da identidade FlowSLA é reproduzido.

STORY: Meus chamados → Abrir chamado → Detalhe, validação e reabertura. Resumos calculados sobre o conjunto completo de fixtures; filtros e busca alteram apenas a listagem. Na abertura, contrato e dados do problema precedem a confirmação demonstrativa. No detalhe, contexto e revisão precedem os prazos, relato, evidência e linha do tempo.

FIRST VIEWPORT: título da tarefa, ação principal e identificação da demonstração. A listagem mostra os três totais e o aviso de validação. O formulário traz seus campos e apoio contratual ao lado em telas amplas. O detalhe oferece revisão somente quando resolvido, com prazo explícito. Sem animação de entrada ou atraso artificial.

FORM: tabela de cinco colunas (Chamado, Estado, Prioridade, Aberto em, Prazos); cards legíveis no celular. Formulário em uma coluna de leitura, com apoio lateral que empilha em telas menores. Estados sempre textuais; datas fixas de demonstração em horário de Brasília. Erros junto aos campos, limites visíveis e foco no primeiro campo inválido.

INTERACTION: busca por número, título ou local, insensível a acentos; filtros combináveis por estado e prioridade. Carregamento e lista vazia acessíveis em “Estados de demonstração”, sem temporizador. Contrato vencido bloqueia a confirmação do formulário. Validação e reabertura usam diálogo nativo, Escape, contenção e retorno de foco. A reabertura requer justificativa de 20 a 1.000 caracteres. Resultados recebem foco e explicam seu caráter demonstrativo.

TRUTH: quatro chamados fictícios do Edifício Aurora, dois em andamento, um aguardando validação e um encerrado. Cena fixa de 05/11/2026 às 10h. A imagem existente de manutenção gerada por IA é explicitamente ilustrativa e não representa o atendimento. Sem API, armazenamento ou mudança de estado nas fixtures. A confirmação de resolução explica o encerramento que ocorreria em uma operação real.

FINISH: typecheck, lint, testes unitários, build com prerenderização, E2E em Chromium e Firefox; busca/filtros, campos inválidos e espaços em branco, contrato indisponível, confirmação, modais, teclado, evidência, ausência de escrita e 404. Verificar 320, 390, 768, 1024 e 1440 px nos fluxos aplicáveis. Regressão do shell dos três perfis. Evidências e limites em `docs/FRONTEND_10_12_CLIENTE.md`.

Drift preexistente: `.impeccable/design.json` está anterior a `DESIGN.md`. A atualização via `impeccable document` permanece separada; esta entrega não altera o sistema global.
