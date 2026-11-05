# FRONTEND 04 — Layout dos três perfis

## Escopo confirmado

Shell visual, navegação por perfil e conteúdo demonstrativo. Formulários completos e operações de negócio ficam para as próximas tasks. A implementação usa Angular, Tailwind, SSR e hidratação existentes. Não há autenticação, autorização, integração com APIs ou persistência de dados.

O trabalho segue os entregáveis de `docs/tasks/tasks_frontend.md`, os papéis e fluxos da proposta e a estrutura descrita em `docs/DESIGN_SYSTEM.md`. Esse último documento é uma referência histórica: marca, fonte e cores continuam sendo as da NIVELO atual em `DESIGN.md`.

A referência pública do Claude informada pelo usuário apresentou uma verificação de segurança e não permitiu inspecionar o artefato. Nenhum conteúdo dessa página foi copiado. A estrutura implementada vem dos documentos locais e da identidade existente.

## Rotas e navegação

Abra `/app/gestor`, `/app/tecnico` ou `/app/cliente`. `/app` leva ao perfil Gestor. Também há um link **Explorar telas internas** na página `/sessao-demo`.

| Perfil  | Áreas demonstrativas                                                                   |
| ------- | -------------------------------------------------------------------------------------- |
| Gestor  | Painel; Fila de chamados; Relatórios; Contratos e SLA; Clientes e usuários; Auditoria. |
| Técnico | Meus chamados; Atendimento atual.                                                      |
| Cliente | Meus chamados; Abrir chamado.                                                          |

O seletor **Perfil de demonstração** muda o contexto e a rota inicial. Todas as áreas são acessíveis diretamente; a mudança de menu não é uma regra de autorização. Os menus de Gestor e Técnico têm uma prévia local de notificações. O Cliente não tem sino. **Sair** e **Simular sessão expirada** reutilizam as telas da FRONTEND 05.

As dez páginas de exemplo têm títulos, breadcrumbs e estado ativo na navegação. As áreas que dependem de próximas tasks exibem informações estáticas, contexto e um caminho de retorno. Não apresentam formulários ou ações que finjam cadastrar, alterar ou exportar dados.

Endereços desconhecidos apresentam **Página não encontrada**, com resposta HTTP 404 e retorno ao início do perfil. Fora de `/app`, a página oferece retorno ao site público. O fallback usa a renderização do próprio Angular; não há endpoint de produto.

## Composição e componentes

Modo **Operate**, com a identidade herdada. A direção de composição é `framed-sheet`, registrada em `.taste-skill/internal/direction.json` (seed `1296575869`): moldura em `bg`, sidebar de 232 px e área branca, com raio de 16 px, recuo de 8 px e sem sombra. Manrope, azul corporativo e símbolo SVG original são preservados. Não há novas fontes ou imagens.

`WorkspaceShell` concentra cabeçalho adaptativo, breadcrumbs, seletor, navegação e menu do usuário. `WorkspaceNavigation` é reutilizado na sidebar e no menu móvel. `WorkspacePage` recebe metadados da rota e apresenta os exemplos; `TicketList` alterna tabela e lista conforme a largura. `MissingPage` é compartilhado pelos contextos interno e público. O módulo é carregado sob demanda.

O menu lateral dá lugar a um `dialog` abaixo de 1024 px. O foco inicial fica em Fechar navegação; Tab e Shift+Tab percorrem o menu, Escape e o fundo o fecham. Escape devolve o foco ao acionador; uma navegação entrega o foco ao novo título. Ao ampliar para desktop, o diálogo fecha e o seletor recebe foco. O link de pular conteúdo mantém o usuário na página atual.

As listas usam tabela a partir de 768 px e itens em uma coluna abaixo disso. O cabeçalho permite que o seletor ocupe uma segunda linha no celular. Alvos têm no mínimo 44 px. Não há entradas decorativas nem movimento contínuo; as transições de cor respeitam movimento reduzido.

## Dados de exemplo

`data/workspace-data.ts` contém as definições dos perfis e um cenário fixo de novembro de 2026. Nomes, empresas, estados, datas e prazos são fictícios. Nenhum prazo é calculado com o relógio atual.

- Gestora Camila Moreira: quatro chamados no cenário; um em triagem e um em campo.
- Técnico Rafael Costa: dois chamados atribuídos, com empresa e local, sem contrato ou política comercial nas suas telas.
- Cliente Marina Alves: três chamados do Edifício Aurora; o chamado da Clínica Horizonte não aparece nesse contexto.

As contagens vêm dos mesmos exemplos exibidos. A filtragem local serve à apresentação e não protege os dados. O cenário não é uma comprovação de operação real.

## Verificação

Validação de produção concluída em 04/11/2026:

- Build aprovada, com 15 rotas prerenderizadas e fallback 404 renderizado pelo Angular.
- Pacote inicial de 340,19 kB, abaixo do budget existente de 500 kB; nenhum budget foi ampliado.
- Lint e tipagem aprovados. Antes do ajuste final de texto, a suíte completa aprovou 39 testes unitários e 126 testes E2E em Chromium e Firefox, incluindo 22 cenários novos do shell. Dos 128 cenários E2E, dois cenários preexistentes do vídeo opcional foram ignorados quando o componente não foi renderizado.
- Os três perfis foram inspecionados visualmente em 1440, 768 e 390 px. Nenhuma das nove combinações apresentou overflow horizontal ou imagem quebrada; Manrope estava carregada. A inspeção automatizada não encontrou falhas de contraste.
- A revisão visual abrangeu 14 capturas e pediu um ajuste de linguagem nas prévias. Após a correção de cinco descrições, build, lint e tipagem foram aprovados novamente e dez capturas de desktop e celular foram renovadas. O revisor marcou esse ajuste como resolvido e retornou `ship` nesse escopo. A suíte completa não foi repetida após essa alteração apenas de texto.
- O espaço livre abaixo dos dois chamados fictícios do Técnico foi avaliado na revisão como não material; a observação foi preservada, sem supressão.

O aviso de compilação preexistente `NG8113`, referente ao `HeroBackground` opcional, permanece fora do escopo desta entrega.

`e2e/workspace.spec.ts` cobre os três menus e suas áreas, troca de perfil, teclado, menu móvel e resize, breadcrumbs, estado ativo, skip-link, notificações, saída, sessão expirada, páginas 404, responsividade de 320 a 1440 px, telas baixas e HTML prerenderizado sem JavaScript. Também verifica ausência de chamadas a APIs e de armazenamento local durante a troca de perfis.

Os testes existentes da landing e do acesso são mantidos. A landing passa a usar carregamento sob demanda, preservando seu HTML prerenderizado e os componentes atuais. Isso evita incorporar as telas públicas ao pacote inicial das áreas internas; o budget de produção não foi ampliado.
