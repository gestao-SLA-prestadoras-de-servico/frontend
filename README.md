# FlowSLA - Frontend

Bem-vindo ao repositório de frontend do **FlowSLA** - um sistema para automatizar o controle de prazos, evidências e histórico de atendimento relacionados a SLAs (Service Level Agreements), voltado especialmente para empresas prestadoras de serviços técnicos de pequeno e médio porte.

## Qual é o propósito desse repositório?

Este repositório é responsável pelo frontend do **FlowSLA**, incluindo a implementação da interface da aplicação, páginas, componentes, fluxos de navegação e demais recursos relacionados à experiência do usuário, além das documentações específicas do frontend.

## Stack

| Ferramenta                                    | Versão |
| --------------------------------------------- | ------ |
| [Angular](https://angular.dev/)               | 21.2.0 |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.2  |
| [TailwindCSS](https://tailwindcss.com/)       | 4.1.12 |
| [RxJS](https://rxjs.dev/)                     | 7.8.0  |
| [Vitest](https://vitest.dev/)                 | 4.0.8  |
| [Playwright](https://playwright.dev/)         | 1.63.0 |
| [ESLint](https://eslint.org/)                 | 10.3.0 |

## Como executar o projeto

> [!IMPORTANT]
>
> Requisitos:
>
> - Node.js - v20+
> - npm - v11+

Antes de tudo, instale as dependências com:

```bash
npm install
```

### Execução do modo de desenvolvimento:

```bash
npm run start
```

### Execução do modo de produção (build):

Primeiro construa a aplicação:

```bash
npm run build
```

Agora rode com:

```bash
npm run serve:ssr:frontend
```

### Como executar os testes

#### Para executar testes unitários, rode

```bash
npm run test
```

#### Para executar testes E2E

Se está executando os testes E2E pela primeira vez, instale os navegadores e suas dependências:

```bash
npx playwright install --with-deps
```

Em seguida, execute os testes:

```bash
npm run e2e
```

## Estrutura de pastas

```bash
.
├── angular.json
├── e2e # Testes End-to-End (E2E)
│   ├── example.spec.ts
│   └── tsconfig.json
├── eslint.config.js # Configuração das regras do ESLint
├── package.json
├── package-lock.json
├── playwright.config.ts # Configuração do Playwright
├── public
│   └── favicon.ico
├── README.md
├── src # Código-fonte da aplicação
│   ├── app # Componentes, páginas e lógica da aplicação
│   ├── index.html
│   ├── main.server.ts # Ponto de entrada da aplicação no servidor
│   ├── main.ts # Ponto de entrada da aplicação no navegador
│   ├── server.ts # Configuração do servidor para SSR
│   └── styles.css # Estilos globais da aplicação
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json


```

<!-- ADICIONAR TABELA EXPLICATIVA DA DOCUMENTAÇÃO DO FRONTEND -->

## Repositórios relacionados

| Repositório                                                             | Função             |
| ----------------------------------------------------------------------- | ------------------ |
| [docs](https://github.com/gestao-SLA-prestadoras-de-servico/docs)       | Documentação geral |
| [backend](https://github.com/gestao-SLA-prestadoras-de-servico/backend) | Backend do projeto |

## Autores

|                                                                                                                         |                                                                                                                                |                                                                                                                                     |
| :---------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
|                <img src="https://github.com/genzo-dev.png" alt="Gabriel Enzo (genzo-dev)" width="160"/>                 |                        <img src="https://github.com/LuisF3L1P3dev.png" alt="Luis Felipe" width="160"/>                         |                                <img src="https://github.com/rangelro.png" alt="Rangel" width="160"/>                                |
|                                              **Gabriel Enzo (genzo-dev)**                                               |                                                        **Luis Felipe**                                                         |                                                             **Rangel**                                                              |
|                                           <sub>Fullstack web developer</sub>                                            |                                               <sub>Fullstack web developer</sub>                                               |                                                 <sub>Fullstack web developer</sub>                                                  |
| <a href="https://www.linkedin.com/in/genzo-dev/">💼 LinkedIn</a> · <a href="https://github.com/genzo-dev">🐙 GitHub</a> | <a href="https://www.linkedin.com/in/luisfelipe15/">💼 LinkedIn</a> · <a href="https://github.com/LuisF3L1P3dev">🐙 GitHub</a> | <a href="https://www.linkedin.com/in/rangel-rocha-779139228/">💼 LinkedIn</a> · <a href="https://github.com/rangelro">🐙 GitHub</a> |
