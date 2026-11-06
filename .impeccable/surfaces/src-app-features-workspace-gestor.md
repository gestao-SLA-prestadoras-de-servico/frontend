---
version: 1
slug: "src-app-features-workspace-gestor"
primary_target: "src/app/features/workspace/gestor"
related_targets: ["src/app/features/workspace/workspace.routes.ts","src/app/features/workspace/data/workspace-data.ts","src/app/features/workspace/layout"]
---

# Portal do Gestor Nivelo — FE-018 a FE-027

Mode: Operate. Público: gestor de operações que administra clientes empresariais, contratos, usuários e a fila de atendimento em desktop, tablet e celular.

Direction contract: extensão code-led do shell compartilhado de FRONTEND 04. Herdar Manrope, paleta, estados, controles, foco e superfícies de Nivelo definidos em DESIGN.md e src/styles.css. Referências orientam hierarquia e fluxo de trabalho; não importar a marca FlowSLA, alterar o sistema visual global, ou redesenhar o shell. As áreas Cliente e Técnico permanecem intactas.

THESIS: dar ao gestor contexto suficiente para manter cadastros coerentes e decidir a próxima ação operacional.

OWN-WORLD: texto em azul-noite, ações em azul Nivelo, superfícies claras e densidade proporcional à tarefa. Verde escuro indica ativo ou concluído; cinza, inatividade; ciano e azul suave identificam estados de trabalho; vermelho indica erro ou confirmação destrutiva. Rótulos textuais acompanham cor. Manrope e ícones Lucide locais; primitivos de botão e foco existentes. Espaçamento e breakpoint seguem o shell e DESIGN.md. Sem gradientes, decoração promocional ou componentes com linguagem externa.

STORY: Empresas → consultar, buscar ou filtrar → cadastrar em página própria; editar e confirmar inativação em diálogos. Contratos e vigência → políticas SLA → usuários e perfis → painel e fila → detalhe, triagem, atribuição e acompanhamento da operação.

FE-018 FIRST VIEWPORT: título da gestão de empresas, ação Nova empresa, aviso de demonstração, totais de ativas/inativas e busca com filtro de situação. A lista apresenta razão social, e-mail de contato, endereço, situação e ações; em celular, cada registro vira uma ficha legível sem rolagem horizontal.

FE-018 FORM: página dedicada, campos obrigatórios de razão social, e-mail de contato e endereço, ajuda junto dos campos, erros acessíveis, foco no primeiro campo inválido, confirmação fictícia de cadastro e um estado de erro demonstrável. Edição preserva os dados na abertura do diálogo; inativação pede confirmação e identifica a empresa.

INTERACTION: busca local por razão social, e-mail ou endereço, insensível a acentos; filtro por todas, ativas ou inativas; estado vazio oferece limpar busca/filtro. Diálogos nativos fecham por Escape, mantêm foco durante edição e devolvem foco ao acionador. Mensagens de sucesso e erro são anunciadas e focadas quando necessário. Ações alteram somente a cópia em memória da demonstração na sessão, sem API, persistência, notificação ou operação real.

TRUTH: cenário empresarial fictício coerente com Edifício Aurora, Clínica Horizonte e chamados do portal. Valores são de exemplo, sem CNPJ, promessa operacional ou alegação comercial. Recarregar restaura os dados iniciais.

SCOPE: FE-018 lista, formulário, edição e inativação; FE-019 contratos e vigência; FE-020 matriz SLA e versões; FE-021 usuários e perfis; FE-022 painel/fila; FE-023 detalhe e triagem; FE-024 atribuição; FE-025 cancelamento justificado; FE-026 falha/reprocessamento de evidência; FE-027 preferência individual de aviso. Cada task é revisada antes de iniciar a próxima.

FINISH: em FE-018 verificar busca, filtros, resultado vazio, obrigatoriedade, e-mail inválido, cadastro demonstrativo, erro demonstrativo, edição, confirmação de inativação, teclado e foco. Verificar 320, 390, 768, 1024 e 1440 px e regressão do shell, Cliente e Técnico aplicável. Registrar que todos os dados e estados são demonstrativos e não persistem.

Drift preexistente: .impeccable/design.json está anterior a DESIGN.md. Atualizar via impeccable document em etapa separada, preservando DESIGN.md.
