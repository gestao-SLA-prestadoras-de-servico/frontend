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
- `src/app/landing/hero-background.ts`: reprodução, acessibilidade e fallback do vídeo da hero após a hidratação.
- `public/videos/nivelo-hero-loop.mp4`: vídeo de fundo otimizado, sem áudio e com emenda suave para repetição contínua.
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

A hero usa o vídeo fornecido pelo usuário em um player HTML nativo, sem áudio, em repetição contínua e com reprodução inline no celular. O arquivo foi otimizado para H.264, 1280 × 720, 24 fps e 8,5 s (cerca de 1,9 MB). Uma mistura suave de 1,5 s entre o final e o início foi incorporada ao arquivo para evitar corte na volta do loop. O primeiro quadro é o poster `images/nivelo-hero-poster.webp`, usado durante o carregamento, com movimento reduzido, bloqueio de autoplay ou falha de reprodução. O vídeo só recebe a fonte após a hidratação, quando a hero está visível e o movimento é permitido; pausa fora da tela e em aba oculta. Não captura cliques ou toques. Consulte `docs/NIVELO_BRAND.md`.

## Validação da landing

A validação anterior da landing passou o build de produção sem avisos, com uma rota pré-renderizada. Os dois testes Angular então existentes também passaram. Sua verificação automatizada e capturas cobrem seis larguras (320, 390, 768, 1024, 1440 e 1536 px), sem violações axe, transbordamento horizontal ou erros JavaScript nos cenários executados.

Na rodada atual, o build de produção passou com uma rota pré-renderizada e os 8 testes Angular passaram. O vídeo foi confirmado em Chrome sem configurações especiais de autoplay, em desktop de 1440 px e celular de 390 px, sem erros JavaScript ou transbordamento horizontal. Duas voltas completas mantiveram os quadros decodificados sem tela preta. Também foram verificados os controles da hero, menu móvel, teclado, pausa fora da tela, retomada, poster com movimento reduzido, bloqueio de autoplay e conteúdo SSR sem JavaScript. O cenário inicial de movimento reduzido não baixou o MP4. Os testes do componente cobrem reprodução, visibilidade, preferências, falha de mídia e liberação de recursos.

O relatório da landing original permanece em `.impeccable/review/nivelo-verification.json` como registro histórico. Os registros do efeito WebGL anterior ficam em `tmp/hero-reference/`. A preparação e a verificação do vídeo atual ficam em `tmp/hero-video/`, incluindo `encoding-report.json`, `verification.json`, `seam-sheet.jpg`, `desktop.png` e `mobile.png`. As ferramentas de inspeção do vídeo e do navegador ficam em `tmp/`, sem alterar as dependências da aplicação.
