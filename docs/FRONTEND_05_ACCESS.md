# FRONTEND 05 — Entrada, saída e sessão expirada

Esta entrega apresenta os estados de acesso da NIVELO com dados exclusivamente fictícios. A landing e sua navegação permanecem na rota `/`.

| Rota                    | Experiência                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `/login`                | Campos obrigatórios, formato de e-mail, exibição da senha e entrada local com qualquer e-mail válido e senha preenchida. |
| `/login?estado=saida`   | Confirmação visual de saída, com formulário vazio.                                                                   |
| `/login?estado=expirou` | Orientação de entrada após o aviso de expiração.                                                                     |
| `/sessao-demo`          | Perfil fictício, menu do usuário com Sair e controle de simulação de expiração.                                      |
| `/sessao-expirada`      | Aviso e ação Entrar novamente.                                                                                       |

## Como demonstrar

1. Abra `/login` e envie o formulário vazio para visualizar as mensagens obrigatórias.
2. Informe qualquer e-mail válido e uma senha. Após a espera de 650 ms, a página abre a sessão de demonstração local.
3. No menu de Camila Moreira, escolha **Sair** para voltar ao formulário vazio e à confirmação de saída.
4. Use **Simular sessão expirada** na página ou no menu para visualizar o aviso. Selecione **Entrar novamente** e envie qualquer e-mail válido com uma senha preenchida.

O perfil de Camila Moreira e o domínio `.example` ficam apenas nos dados fictícios da sessão, em `src/app/features/access/data/access-demo.ts`; não são credenciais de entrada. Qualquer pessoa pode abrir diretamente todas as rotas.

## Limites e organização

Não há autenticação, guardas de rota, tokens, armazenamento de credenciais ou dados de produto, chamadas a APIs de autenticação ou de produto, integração com Keycloak ou redirecionamentos OIDC. Os parâmetros `estado` só selecionam o feedback visual. Qualquer e-mail válido com uma senha não vazia libera a rota de demonstração após o carregamento local; os valores não são comparados nem armazenados. A saída não revoga acesso e a expiração não depende de um temporizador de sessão.

As páginas usam carregamento sob demanda. O Angular gera HTML prerenderizado das três rotas e da landing. O formulário só é habilitado após a hidratação; sem JavaScript, o conteúdo informa como ativar a interação e não permite envio nativo de campos.

`AccessLayout` reúne a imagem ilustrativa e o conteúdo de entrada/expiração. A imagem ocupa metade da composição em telas a partir de 1024 px; em telas menores, o formulário ocupa toda a largura. No login, a marca fica centralizada acima do título. Os controles `Brand`, `Input`, `PageHeading` e `UserMenu` ficam em `shared/ui`. O menu emite intenções de saída e expiração, sem conhecer dados de acesso. As páginas reutilizam `ButtonPrimary` e usam apenas utilitários Tailwind.

## Identidade e acessibilidade

Manrope, símbolo SVG original, azul corporativo, azul-noite, turquesa e superfícies claras seguem `DESIGN.md`. A entrada usa uma foto ilustrativa corporativa na metade esquerda do desktop e centraliza a marca acima do formulário. A foto some abaixo de 1024 px para priorizar os campos. A sessão de demonstração usa conteúdo centralizado e painéis tonais, sem inventar um dashboard operacional.

Rótulos visíveis, mensagens associadas aos campos, foco no primeiro campo inválido, anúncios de erro/carregamento e foco no título após cada navegação compõem o fluxo. O menu aceita Enter, Espaço, setas, Home, End e Escape; Tab continua a navegação normal, e Escape devolve o foco ao acionador. O conteúdo se adapta a telas estreitas e baixas. Movimento reduzido elimina rotação do indicador e transformações de pressão.

## Verificação

Em 04/11/2026, a build estática concluiu com quatro rotas prerenderizadas e a inspeção visual confirmou a composição em 1440 × 900 e 390 × 844. Os testes automatizados desta atualização não foram executados.

Os resultados abaixo foram coletados em 03/11/2026, antes da mudança para entrada com qualquer e-mail válido e senha preenchida.

Validação concluída em 03/11/2026 na build de produção:

- Build: quatro rotas prerenderizadas; lint e tipagem aprovados.
- Unidade: 39 testes aprovados; os cinco testes do login foram confirmados novamente após o ajuste de hidratação.
- E2E: 104 testes aprovados em Chromium e Firefox, incluindo 14 novos cenários de acesso. Os dois testes existentes do vídeo opcional permanecem ignorados quando ele não é renderizado.
- Inspeção visual: login, perfil, menu, avisos obrigatórios e expiração em 1440, 768 e 390 px. As nove combinações de página/largura não apresentaram imagens quebradas, overflow ou erros de execução. Os testes também verificam 320 px e 1024 × 600 px.
- A inspeção automática não encontrou problemas de contraste nas três páginas. A revisão visual inclui foco visível e mensagens que não dependem somente de cor.

O aviso de compilação preexistente `NG8113` sobre o componente opcional `HeroBackground` permanece fora do escopo desta entrega.

Refinamento de layout do login: o desktop usa espaçamentos compactos e centralização vertical, com o estado inicial inteiro em 1280 × 720, 1366 × 768 e 1440 × 900. Os testes verificam altura do documento igual à da janela e rodapé visível nessas resoluções. O layout móvel mantém seus espaçamentos; alturas menores, zoom e feedback adicional podem exigir rolagem para manter todo o conteúdo acessível.

Os testes de unidade em `login.spec.ts` cobrem campos obrigatórios, formato de e-mail, carregamento/entrada com dados válidos, envios repetidos e limpeza de trabalho pendente. `e2e/access.spec.ts` verifica o fluxo completo, senha visível, teclado/foco, saída, expiração, ausência de envio de dados e de armazenamento local, larguras de 320 a 1440 px, telas baixas e HTML sem JavaScript em Chromium e Firefox.

Com uma build servida localmente, execute:

```powershell
npm run lint
npm run typecheck
npm run test:ci
npm run build
$env:PLAYWRIGHT_TEST_BASE_URL = 'http://localhost:4324'
npx playwright test --workers=2 --reporter=line
```
