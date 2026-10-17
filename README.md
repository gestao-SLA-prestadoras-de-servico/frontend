# Nivelo — frontend

Landing pública da Nivelo, Projeto Integrador 2026.2, construída com Angular 21 e Tailwind CSS 4. A rota `/` apresenta a plataforma em desenvolvimento e identifica os dados e imagens do chamado como ilustrativos. Os controles de disponibilidade abrem um aviso; o sistema ainda não oferece acesso operacional.

## Desenvolvimento

```sh
npm install
npm start -- --port 4301
```

Abra http://localhost:4301/. A porta 4301 evita a instância anterior que pode estar servindo uma versão antiga na porta 4300. Execute apenas um servidor na porta escolhida.

## Build e testes

```sh
npm run build
npm test -- --watch=false
```

O build de produção gera os arquivos em `dist/frontend` e pré-renderiza a rota inicial. A hidratação com repetição de eventos foi preservada.

Para servir o build de produção no PowerShell, após encerrar o servidor de desenvolvimento na mesma porta:

```powershell
$env:PORT = '4301'
$env:NG_ALLOWED_HOSTS = 'localhost,127.0.0.1'
npm run serve:ssr:frontend
```

Abra http://localhost:4301/. `NG_ALLOWED_HOSTS` configura os hosts aceitos nesta execução local; na implantação, informe os domínios efetivamente usados. Consulte a [documentação de hosts permitidos do Angular](https://angular.dev/best-practices/security#configuring-allowed-hosts).

## Organização

- `src/app/landing/`: apresentação, chamado ilustrativo, capacidades, FAQ, ícones, menu móvel e diálogo de disponibilidade.
- `src/app/landing/hero-background.ts`: fundo estático e camada decorativa `shaders/js`, carregada após a hidratação.
- `src/styles.css`: tokens, Manrope local, controles compartilhados e redução de movimento.
- `PRODUCT.md`: contexto confirmado e limites da entrega.
- `DESIGN.md`: fonte da verdade visual atual, extraída do código após a aprovação de C — Faixa de luz.
- `.impeccable/design.json`: extensão do sistema com estados de componentes, sombras, movimento e breakpoints.
- `.impeccable/surfaces/src-app-app-html.md`: direção e composição da landing aprovada.
- `docs/NIVELO_BRAND.md`: símbolo fornecido pelo usuário, paleta da prancha e relação com os ativos atuais.
- `docs/DESIGN_SYSTEM.md`: especificação histórica do protótipo de telas internas, ainda não implementadas.
- `public/fonts/`: Manrope local com licença OFL e fontes IBM Plex históricas preservadas.
- `public/images/`: símbolo vetorial, refração estática sem texto e evidências ilustrativas.

Não há autenticação, API de produto ou coleta de contatos nesta entrega. Contratos, chamados operacionais, notificações, relatórios e fluxos por perfil continuam como capacidades previstas.

## Fundo e movimento

A imagem de refração mantém a composição sem depender de WebGPU. O shader usa `shaders/js` 4.0.4 com Swirl, ChromaFlow, FlutedGlass e FilmGrain; é carregado após a hidratação, com telemetria e rastreamento de desempenho desativados. Pausa quando sai da tela ou a aba fica oculta, limita a resolução e é destruído ao desmontar. Movimento reduzido ou falta de WebGPU preservam o fundo estático. Os parâmetros foram adaptados à opção C porque os valores originais do plano não foram fornecidos; consulte `docs/NIVELO_BRAND.md`.

## Validação da landing

A validação final da landing, após os ajustes de revisão, passou o build de produção sem avisos, com uma rota pré-renderizada. Os dois testes Angular existentes também passaram. A verificação automatizada final e suas capturas cobrem seis larguras (320, 390, 768, 1024, 1440 e 1536 px), sem violações axe, transbordamento horizontal ou erros JavaScript nos cenários executados.

Menu móvel, diálogo, FAQ por teclado e retorno de foco passaram. Foram confirmados o shader ativo, o fundo estático com movimento reduzido, sem WebGPU e com falha de inicialização do adaptador, além do conteúdo pré-renderizado sem JavaScript. Em DPR 2, o shader ficou pronto com resolução limitada a 1280 × 650. O relatório descreve o escopo coberto; não substitui a revisão visual e manual.

O registro dessa rodada está em `.impeccable/review/nivelo-verification.json`. Regenerar o relatório após mudanças que afetem esses cenários. O README registra os testes executados e não declara conclusão automática das etapas ou aprovações do fluxo Impeccable.

Para repetir a verificação com Chrome instalado e o servidor de produção na porta 4301:

```sh
npm install --prefix tmp/flowsla-review --no-save playwright @axe-core/playwright
node tmp/nivelo-verify.mjs
```

As ferramentas ficam em `tmp/`, sem alterar as dependências da aplicação. O nome do diretório auxiliar é histórico; o script atual verifica Nivelo. Capturas e relatórios ficam em `.impeccable/review/`.
