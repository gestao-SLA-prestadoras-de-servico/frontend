# FlowSLA — frontend

Landing de apresentação do FlowSLA, Projeto Integrador 2026.2, construída com Angular 21. A rota `/` apresenta a plataforma em desenvolvimento; todos os botões de acesso abrem um aviso de indisponibilidade. Os dados e imagens da demonstração são ilustrativos.

## Desenvolvimento

```sh
npm install
npm start
```

Abra http://localhost:4200/. Se a porta já estiver ocupada, use `npm start -- --port 4300`.

## Build e testes

```sh
npm run build
npm test -- --watch=false
```

O build de produção gera os arquivos em `dist/frontend` e pré-renderiza a rota inicial. A configuração existente de hidratação com repetição de eventos foi preservada.

Para testar o servidor de produção no PowerShell:

```powershell
$env:PORT = '4300'
$env:NG_ALLOWED_HOSTS = 'localhost,127.0.0.1'
npm run serve:ssr:frontend
```

Abra http://localhost:4300/. O Angular exige uma lista explícita de hosts para servir a aplicação pelo motor SSR; a variável acima configura somente esta execução local. Na implantação, informe os domínios efetivamente usados em `NG_ALLOWED_HOSTS`. Consulte a [documentação de hosts permitidos do Angular](https://angular.dev/best-practices/security#configuring-allowed-hosts).

## Organização

- `src/app/landing/`: apresentação, mockup, plataforma, FAQ, ícones e diálogo.
- `src/styles.css`: tokens, fontes locais, controles compartilhados e redução de movimento.
- `PRODUCT.md`: contexto confirmado e limites da entrega.
- `DESIGN.md`: direção visual implementada, baseada na opção A aprovada.
- `docs/DESIGN_SYSTEM.md`: guia mais amplo do projeto, preservado.
- `public/fonts/`: IBM Plex Sans e Mono, com licença OFL.
- `public/images/`: demonstração fotográfica gerada e identificada como ilustrativa.

Não há autenticação, API ou coleta de contatos nesta entrega.

## Validação da landing

Build de produção e dois testes unitários aprovados. A revisão em Chrome verificou larguras de 320 a 1536 px, menu móvel, âncoras, seis perguntas do FAQ por teclado, três acionadores do diálogo, Escape, Entendi, ciclo de Tab e retorno de foco. A análise automática axe não encontrou violações nos tamanhos desktop, celular e 1536 px.

Capturas e resultados estão em `.impeccable/review/`. Para repetir a verificação isolada, com Chrome instalado e o servidor de produção na porta 4300:

```sh
npm install --prefix tmp/flowsla-review --no-save playwright @axe-core/playwright
node .impeccable/review/verify.mjs
```

As ferramentas dessa verificação ficam em `tmp/`, sem alterar as dependências da aplicação.
