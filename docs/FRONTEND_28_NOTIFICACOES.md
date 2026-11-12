# FRONTEND 28 — Notificações de demonstração

## Escopo

Entrega UI-only concluída em 09/11/2026. O sino compartilhado aparece no cabeçalho de Gestor e Técnico em `/app`; o Cliente não tem sino. A lista apresenta notificações fictícias, contagem de não lidas, agrupamento por data, leitura individual ou em lote e links para detalhes de chamados existentes.

Este é um snapshot histórico independente, com datas fixas de 05/11/2026 e anteriores. Não acompanha as preferências demonstrativas da FE-027 nem gera notificações a partir de outras ações simuladas. A remoção de atribuição do Técnico é anterior à nova atribuição do mesmo chamado; seu detalhe continua acessível no cenário.

Não há polling, consultas HTTP, APIs de produto ou autenticação. A leitura existe apenas em memória: não usa `localStorage`, `sessionStorage` ou persistência no servidor. Navegar ou trocar de perfil preserva a leitura na instância atual; recarregar completamente a aplicação restaura os exemplos iniciais.

## Reuso e dados

`WorkspaceShell` integra `WorkspaceNotifications` com `[profile]="profile().key"`, substituindo a prévia antiga. O componente reutiliza `ButtonSecondary`, `Select`, os ícones Lucide e os tokens existentes. Mantém o modo Operate e a composição `framed-sheet`: Manrope, superfície branca, azul de ação, cores semânticas, divisórias, elevação de popover e controles de pelo menos 44 px. `DESIGN.md`, `.impeccable/design.json` e os estilos globais permanecem preservados. Nenhum novo ativo raster foi criado para publicação.

`NotificationDemoStore`, compartilhado na aplicação, expõe:

| Método | Comportamento local |
| --- | --- |
| `forProfile(profile)` | Retorna os exemplos do destinatário; Cliente recebe uma lista vazia. |
| `markRead(profile, id)` | Marca somente a notificação correspondente como lida; repetição e ID de outro perfil não alteram o estado. |
| `markAllRead(profile)` | Marca todas como lidas somente no perfil informado. |

| Perfil | Exemplos iniciais | Não lidas | Eventos ilustrados |
| --- | --- | --- | --- |
| Gestor | 3 | 2 | Violação do prazo de resposta e conclusões de atendimento. |
| Técnico | 4 | 2 | Atribuição, reatribuição, reabertura e remoção anterior. |

`groupNotifications` ordena datas e horários do mais recente para o mais antigo, sem mutar a origem. Os grupos usam datas explícitas em português, sem depender do relógio atual. Marcar leitura não muda a ordem cronológica. Texto **Lida/Não lida**, peso e fundo distinguem o estado; o sino também comunica a contagem no nome acessível.

## Roteiro e interação

1. Abra `/app/gestor` ou `/app/tecnico` e acione o sino: a lista começa com duas não lidas por perfil.
2. Marque uma notificação ou todas como lidas; a contagem muda apenas para o destinatário atual.
3. Abra um item para navegar ao chamado correspondente e marcá-lo localmente como lido. Os links conservam o comportamento nativo, inclusive abertura em outra aba.
4. No rodapé, expanda **Estados da demonstração** e use **Visualizar cenário** para alternar entre exemplos, lista vazia, carregamento e erro.
5. **Restaurar exemplos** no vazio e **Tentar novamente** no erro retornam à lista em memória, sem consulta e sem desfazer leituras. O seletor também permite sair do carregamento simulado.

O painel é uma região não modal identificada. Abrir pelo sino ou por Seta para baixo entrega foco ao título; Tab e Shift+Tab seguem a ordem nativa e podem sair da região. Escape ou Fechar devolvem foco ao sino. Clique externo, foco externo e navegação fecham o painel sem capturar o foco. Ler um item mantém foco no link; a ação em lote entrega foco ao botão Fechar. O feedback de leitura é anunciado por uma região viva.

No celular, o painel ocupa a largura disponível com margens e rolagem interna limitada à altura útil. O cabeçalho permanece visível durante a rolagem, permitindo alcançar fechamento, itens e seletor mesmo em telas baixas. O indicador de carregamento fica estático com movimento reduzido. Menu móvel, seletor de perfil, menu do usuário, SSR e hidratação seguem o comportamento do shell.

## Verificação

Evidências da entrega em 09/11/2026:

- Build de produção aprovada: pacote inicial de 374,51 kB e 21 rotas prerenderizadas, sem ampliar budgets. O aviso preexistente `NG8113` de `HeroBackground` permanece fora deste escopo.
- Lint, tipagem e Prettier aprovados; três novos testes unitários do store aprovados, cobrindo isolamento, leitura idempotente, restauração por nova instância e agrupamento cronológico.
- Os 32 cenários E2E únicos passaram entre as execuções: oito de notificações, 22 do shell e dois da FE-027. A execução inicial aprovou 30 e teve duas falhas de protocolo no teardown de contexto do Firefox (`Browser.removeBrowserContext`); ambas passaram na repetição isolada e serial. Não houve falha de asserção.
- A cobertura inclui teclado, isolamento por perfil, reset após recarga completa, ausência de requisições/armazenamento de produto, SSR sem JavaScript, movimento reduzido e limites em telas pequenas/baixas.
- As 16 capturas de produção são válidas, em larguras de 1440, 768, 390 e 320 px e altura reduzida de 400 px. As métricas não registraram overflow horizontal, imagens quebradas ou erros de página. Incluem os dois destinatários, leitura total, vazio, carregamento, erro, acesso ao rodapé e Cliente sem sino.
- O lint de fonte Taste retornou zero falhas e zero avisos. O inspetor de navegador registrou `heavy-shadow` no popover real, `covered-text` no dashboard atrás do painel aberto e `tiny-text` no dashboard existente e nos metadados de 12 px. Esses achados foram avaliados no contexto, sem declarar o gate de navegador inteiramente limpo e sem acrescentar supressões.
- A revisão independente abriu as 16 capturas e o antes, leu a implementação e retornou `ship` para toda a extensão estreita FE-028, sem correções materiais ou recaptura. A revisão usou evidências e código; não executou uma nova sessão interativa.

Fontes da implementação: `src/app/features/workspace/components/workspace-notifications/`, `src/app/features/workspace/data/notification-demo-store.ts` e integração em `layout/workspace-shell.{ts,html}`. Testes: `notification-demo-store.spec.ts`, `e2e/workspace-notifications.spec.ts`, `e2e/workspace.spec.ts` e `e2e/manager-ticket-notifications.spec.ts`. Capturas em `.impeccable/review/fe028/`; métricas, relatório do inspetor e parecer em `tmp/fe028/` (`finish-review.md`).
