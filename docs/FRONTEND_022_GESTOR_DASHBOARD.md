# FRONTEND 022 — Painel de operações do Gestor

## Escopo

Atualização demonstrativa de `/app/gestor`, preservando o shell compartilhado, a identidade Nivelo e os conteúdos de Cliente e Técnico. Os dados mudam somente em memória na sessão; não há API, armazenamento persistente ou operação sobre uma plataforma real.

## Indicadores e fila

Os quatro indicadores usam `ManagerTicketDemoStore`:

- **Violados:** chamados com `overdue`; o total pode se sobrepor a outros estados.
- **Aguardando triagem:** chamados `ABERTO`.
- **Em atendimento:** chamados `EM_ATENDIMENTO`; `ATRIBUIDO` permanece separado.
- **Aguardando validação:** chamados `RESOLVIDO`.

“Chamados que pedem atenção” lista todos os chamados não finalizados: `ABERTO`, `ATRIBUIDO`, `EM_ATENDIMENTO` e `RESOLVIDO`. Os estados `CANCELADO` e `ENCERRADO` ficam fora da lista e dos totais por estado. Violações recebem rótulo e cor de alerta. O título do chamado abre seu detalhe; o botão do cabeçalho abre a fila completa.

## Resumos

**Chamados por estados** mostra os quatro estados não finalizados, incluindo contagens iguais a zero.

**Cumprimentos SLA do mês** é uma amostra fixa e explicitamente demonstrativa: 56 chamados encerrados em setembro de 2026.

| Compromisso | Cumpridos | Violados | Cumprimento |
|---|---:|---:|---:|
| Resposta | 54 | 2 | 96% |
| Atendimento em campo | 51 | 5 | 91% |
| Resolução | 49 | 7 | 88% |

Os percentuais são arredondados a partir das contagens exibidas. A amostra não representa apuração real.

**Carga por técnico** lista usuários com perfil Técnico e situação Ativo, usando `UserDemoStore`. A carga exibida soma chamados atribuídos e em atendimento, comparada ao limite definido para aquele técnico; número e barra comunicam a proporção.

## Adaptação e verificação

Em telas largas, a fila e os resumos aparecem lado a lado; estados e carga ocupam a primeira linha dos resumos, com SLA em uma faixa larga abaixo. Em tablet e celular, a tabela se transforma em fichas, sem rolagem horizontal. O acesso à fila e aos detalhes permanece disponível por teclado.

Verificações desta atualização: `npm run typecheck`, `npm run lint`, `npm run build` e 12 testes Playwright Chromium nos arquivos `e2e/manager-tickets.spec.ts` e `e2e/workspace.spec.ts`. O inspetor da build de produção avaliou 1440×900, 768×1024 e 390×844 sem falhas ou avisos.
