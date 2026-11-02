# Estrutura de Pastas — FlowSLA

Este documento apresenta a estrutura de pastas do frontend do FlowSLA, com o objetivo de orientar novos desenvolvedores sobre a organização do projeto e facilitar a localização dos arquivos durante o desenvolvimento.

A estrutura foi definida para separar as responsabilidades da aplicação, facilitar a manutenção do código e permitir que novas funcionalidades sejam adicionadas sem comprometer a organização existente.

A organização utiliza três conceitos principais:

- `core`: elementos fundamentais para a infraestrutura e o funcionamento global da aplicação.
- `features`: funcionalidades de negócio que compõem a aplicação.
- `shared`: elementos reutilizáveis que podem ser compartilhados entre diferentes funcionalidades.

Esses conceitos representam uma convenção arquitetural adotada pelo projeto, e não uma exigência do Angular. O objetivo é estabelecer um padrão consistente para toda a equipe.

## 1. Estrutura de Pastas

### 1.1 Raiz do Projeto

A raiz contém os arquivos de configuração, documentação, dependências e ferramentas de desenvolvimento do frontend.

```bash
.
├── angular.json
├── docs
├── e2e
├── eslint.config.js
├── package.json
├── package-lock.json
├── playwright.config.ts
├── playwright-report
├── public
├── README.md
├── src
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.json
└── ...
```

Além desses arquivos e diretórios, algumas pastas são geradas durante o desenvolvimento e a execução dos testes, como `node_modules/`, `dist/`, `playwright-report/` e `test-results/`. Elas não representam necessariamente código-fonte mantido pelos desenvolvedores e não devem ser versionados.

#### Principais arquivos e diretórios

| Arquivo ou diretório   | Responsabilidade                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `angular.json`         | Configura os projetos e as opções de build, serve, testes e outras tarefas executadas pelo Angular CLI.                     |
| `docs/`                | Reúne a documentação específica do frontend.                                                                                |
| `e2e/`                 | Contém os testes end-to-end, responsáveis por verificar fluxos completos da aplicação com Playwright.                       |
| `eslint.config.js`     | Define as regras de análise estática e padronização do código.                                                              |
| `package.json`         | Declara as dependências e os scripts disponíveis para executar tarefas do projeto.                                          |
| `package-lock.json`    | Registra a árvore de dependências resolvida para instalações consistentes com o npm.                                        |
| `playwright.config.ts` | Define a configuração dos testes end-to-end, incluindo navegadores, diretórios e opções de execução.                        |
| `public/`              | Armazena arquivos estáticos públicos, como imagens, ícones e outros recursos que precisam ser disponibilizados diretamente. |
| `README.md`            | Apresenta o projeto e as principais instruções para instalação, configuração e execução.                                    |
| `src/`                 | Contém o código-fonte da aplicação Angular.                                                                                 |
| `tsconfig.json`        | Define as configurações-base do TypeScript.                                                                                 |
| `tsconfig.app.json`    | Define as configurações do TypeScript utilizadas na aplicação.                                                              |
| `tsconfig.spec.json`   | Define as configurações do TypeScript utilizadas nos testes de unidade.                                                     |

> [!NOTE]
>
> Os demais arquivos de documentação, como DESIGN.md, PRODUCT.md e REFACTOR_LANDING.md, devem ser mantidos enquanto forem úteis para registrar decisões de design, requisitos e planos de refatoração.
>
> Após cumprirem sua função, devem ser excluídos.

### 1.2 Diretório `/src`

O diretório src/ contém o código-fonte da aplicação Angular e seus principais pontos de entrada.

```bash
src/
├── app/
├── index.html
├── main.server.ts
├── main.ts
├── server.ts
└── styles.css
```

#### Principais arquivos e diretórios

| Arquivo ou diretório | Responsabilidade                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `app/`               | Contém o componente raiz, as configurações da aplicação, as rotas e as funcionalidades organizadas por responsabilidade.           |
| `index.html`         | Documento HTML inicial que serve de base para a aplicação. O Angular adiciona os recursos necessários durante o processo de build. |
| `main.ts`            | Ponto de entrada que inicializa a aplicação Angular no navegador.                                                                  |
| `main.server.ts`     | Ponto de entrada utilizado na inicialização da aplicação durante a renderização no servidor (SSR).                                 |
| `server.ts`          | Implementa a infraestrutura do servidor utilizada para atender a aplicação com renderização no servidor.                           |
| `styles.css`         | Define estilos globais, importa o Tailwind CSS e reúne estilos compartilhados que precisam estar disponíveis globalmente.          |

Esses arquivos fazem parte da infraestrutura de execução e não devem ser confundidos com as funcionalidades de negócio organizadas dentro de `app/`.

> Obs.: O FlowSLA utiliza recursos de Server-Side Rendering (SSR). Por isso, existem arquivos específicos para a inicialização e a renderização da aplicação no servidor.

### 1.3 Diretório `/src/app`

O diretório `app/` concentra a estrutura principal da aplicação.

```bash
app/
├── app.config.server.ts
├── app.config.ts
├── app.css
├── app.html
├── app.routes.server.ts
├── app.routes.ts
├── app.spec.ts
├── app.ts
├── core/
├── features/
└── shared/
```

Os arquivos diretamente dentro de `app/` são responsáveis pela inicialização, configuração e composição da aplicação.

#### Principais arquivos de configuração

| Arquivo                | Responsabilidade                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `app.config.ts`        | Define os provedores e as configurações utilizadas na inicialização da aplicação Angular no cliente.  |
| `app.config.server.ts` | Define configurações e provedores específicos ou adicionais para a execução no servidor.              |
| `app.routes.ts`        | Declara as rotas principais e direciona o usuário para as funcionalidades correspondentes.            |
| `app.routes.server.ts` | Define configurações de roteamento específicas para o contexto de renderização no servidor.           |
| `app.ts`               | Implementa o componente raiz da aplicação, responsável por compor a estrutura principal da interface. |
| `app.html`             | Define o template HTML do componente raiz.                                                            |
| `app.css`              | Define os estilos específicos do componente raiz.                                                     |
| `app.spec.ts`          | Contém os testes de unidade relacionados ao componente raiz.                                          |

Os arquivos de configuração devem permanecer enxutos e concentrados em suas respectivas responsabilidades.

A seguir, veremos com mais detalhes como organizar os três diretórios principais.

## 2. `/app/core` — Núcleo da aplicação

O diretório `core/` reúne os elementos necessários ao funcionamento global da aplicação, especialmente aqueles relacionados à infraestrutura e aos comportamentos compartilhados por diferentes funcionalidades.

Sua responsabilidade é centralizar recursos que fazem sentido no contexto da aplicação como um todo, evitando duplicação de implementações e mantendo as funcionalidades desacopladas da infraestrutura global.

A estrutura inicial do FlowSLA é:

```bash
core/
├── components/
│   ├── footer/
│   └── header/
├── guards/
├── interceptors/
└── services/
```

> **Atenção**: um arquivo não deve pertencer ao core/ simplesmente porque é utilizado em mais de uma funcionalidade. É necessário avaliar se ele realmente faz parte da infraestrutura global ou se sua responsabilidade pertence a `features/` ou ao `shared/`.

### 2.1 `/core/components`

Armazena componentes responsáveis pela estrutura visual global da aplicação, especialmente elementos que aparecem de maneira recorrente no layout.

No FlowSLA, temos como exemplos:

- `header/:` cabeçalho global da aplicação.
- `footer/`: rodapé global da aplicação.

Esses componentes são diferentes dos componentes específicos de uma funcionalidade.

> [!NOTE]
>
> Vamos exemplificar: um cabeçalho (_header_) global, como aquele que colocamos a Navbar, pode pertender ao `core/`. Enquanto isso, um cabeçalho de uma tabela de usários, por exemplo, deve ficar junto à funcionalidade (`features/`) responsável por aquela tabela.

### 2.2 `core/guards`

Armazena os _route guards_, responsáveis por avaliar se a navegação para determinada rota deve ser permitida.

Os guards podem verificar condições como:

- Se o usuário está autenticado.
- Se o usuário possui uma permissão necessária.
- Se determinada condição precisa ser satisfeita antes de acessar uma página.

Imagine que o FlowSLA possua uma página administrativa que só pode ser acessada por usuários autenticados com as permissões adequadas. Nesse cenário, um guard pode verificar as condições necessárias antes de permitir a navegação. Caso elas não sejam atendidas, pode redirecionar o usuário para outra rota.

> [!IMPORTANT]
>
> Guards controlam a navegação no frontend, mas não substituem a autorização no backend. As APIs precisam validar as permissões independentemente do comportamento da interface, pois as verificações executadas no navegador podem ser contornadas.

### 2.3 `/core/interceptors`

Armazena os interceptadores HTTP utilizados para aplicar comportamentos transversais às requisições ou às respostas da aplicação. Os interceptadores permitem executar operações comuns sem precisar repetir a mesma lógica em cada serviço que realiza chamadas HTTP.

Entre suas possíveis responsabilidades estão:

- Adicionar cabeçalhos necessários às requisições.
- Aplicar estratégias comuns de tratamento de erros.
- Registrar informações úteis para diagnóstico.
- Integrar comportamentos relacionados à autenticação.

Por exemplo, um interceptador pode adicionar um cabeçalho de autenticação às requisições que precisam dele, desde que essa estratégia seja compatível com o mecanismo de autenticação adotado pelo projeto.

### 2.4 /core/services

Armazena serviços relacionados à infraestrutura global da aplicação e a responsabilidades que precisam ser compartilhadas em diferentes partes do sistema.

Um serviço Angular é uma unidade de código que pode encapsular responsabilidades específicas, como comunicação com APIs, gerenciamento de estado ou execução de regras de negócio. Entretanto, isso não significa que todos os serviços devam ficar no `core/`.

A localização deve considerar a responsabilidade do serviço:

- Serviço global: pode pertencer ao `core/`.
- Serviço específico de uma funcionalidade: deve ficar dentro da respectiva feature.
- Serviço genérico reutilizável: pode ficar no `shared/`, quando fizer sentido.

> [!TIP]
>
> Um serviço responsável por fornecer informações globais sobre a sessão do usuário pode pertencer ao `core/`. Já um serviço que realiza operações específicas sobre uma funcionalidade de gerenciamento de usuários deve, preferencialmente, ficar dentro dessa feature.

### 2.5 Outras responsabilidades possíveis do /core

À medida que o FlowSLA evoluir, outras responsabilidades poderão ser incorporadas ao núcleo da aplicação, desde que tenham um caráter realmente global.

Exemplos:

- **Configuração**: gerenciamento de configurações globais da aplicação.
- **Autenticação**: serviços e mecanismos compartilhados relacionados à sessão do usuário.
- **Tratamento de erros**: infraestrutura global para captura e tratamento de erros.
- **Logging**: registro de eventos relevantes para diagnóstico.
- **Monitoramento**: integração com ferramentas de observabilidade, caso sejam adotadas.

> [!IMPORTANT]
>
> Esses exemplos não representam uma obrigação de criar todas essas pastas antecipadamente. Novas estruturas devem ser adicionadas conforme as necessidades reais do projeto.

## 3. `/app/features` — Funcionalidades da aplicação

O diretório `features/` reúne as funcionalidades de negócio que compõem o FlowSLA. Inclusie, é aqui onde ficaram as páginas da aplicação.

Cada feature representa uma área funcional do sistema, concentrando os componentes, serviços, modelos, regras e configurações necessários à sua implementação. Essa organização permite que cada funcionalidade tenha uma estrutura própria, facilitando a manutenção e reduzindo a dependência entre diferentes partes da aplicação.

Atualmente, o FlowSLA possui a seguinte estrutura:

```bash
features/
└── landing/
    ├── components/
    │   ├── action-label/
    │   │   └── action-label.ts
    │   ├── availability-dialog/
    │   │   ├── availability-dialog.css
    │   │   ├── availability-dialog.html
    │   │   └── availability-dialog.ts
    │   ├── faq/
    │   │   ├── faq.html
    │   │   └── faq.ts
    │   ├── hero-background/
    │   │   ├── hero-background.css
    │   │   ├── hero-background.html
    │   │   ├── hero-background.spec.ts
    │   │   └── hero-background.ts
    │   ├── icon/
    │   │   └── icon.ts
    │   ├── platform-overview/
    │   │   ├── platform-overview.html
    │   │   └── platform-overview.ts
    │   └── product-preview/
    │       ├── product-preview.html
    │       └── product-preview.ts
    ├── landing.html
    ├── landing.spec.ts
    └── landing.ts
```

Os componentes utilizados pela landing ficam agrupados em `components/`, mantendo os arquivos da página no nível principal da feature.

Na landing, `src/styles.css` expõe os tokens Tailwind 4 em `@theme` e os padrões de documento em `@layer base`. Layout, responsividade, estados e tipografia ficam nos utilitários dos templates e hosts. Apenas `hero-background.css` (gradientes) e `availability-dialog.css` (transições nativas de abertura/fechamento) permanecem como estilos específicos; não é necessário criar CSS para cada componente. Navegação desktop e composições amplas usam `lg` (1024 px), em conjunto com os breakpoints padrão do Tailwind.

### 3.1 O que pertence a uma feature?

Uma feature deve concentrar os arquivos relacionados à sua responsabilidade. Dependendo da funcionalidade, isso pode incluir:

- Componentes de interface.
- Serviços de comunicação com APIs.
- Regras de negócio específicas.
- Tipos e interfaces utilizados exclusivamente pela funcionalidade.
- Pipes e diretivas específicos.
- Arquivos de rotas.
- Testes de unidade.

Por exemplo, se o FlowSLA possuir uma funcionalidade de gerenciamento de usuários, poderemos organizá-la da seguinte forma:

```bash
features/
└── users/
    ├── users.ts
    ├── users.html
    ├── users.css
    ├── user-api.ts
    └── users.spec.ts
```

Nesse exemplo:

- `users.ts`, `users.html` e `users.css` implementam a interface da funcionalidade.
- `user-api.ts` concentra as operações de comunicação com a API de usuários.
- `users.spec.ts` contém os testes de unidade correspondentes.

### 3.2 Como organizar os componentes de uma feature?

Uma feature pode começar com poucos arquivos em um único diretório. Conforme sua complexidade aumenta, é possível criar subdiretórios para agrupar componentes e responsabilidades relacionadas.

Por exemplo:

```bash
features/
└── users/
    ├── components/
    │   ├── user-form/
    │   │   ├── user-form.ts
    │   │   ├── user-form.html
    │   │   └── user-form.spec.ts
    │   └── user-table/
    │       ├── user-table.ts
    │       ├── user-table.html
    │       ├── user-table.css
    │       └── user-table.spec.ts
    ├── users.ts
    ├── users.html
    ├── users.css
    ├── users.routes.ts
    ├── user-api.ts
    └── user.model.ts
```

Nesse caso, `components/ `agrupa componentes que pertencem à própria feature. Eles não precisam ser transferidos para o `shared/` apenas porque são utilizados por mais de um componente dentro da mesma funcionalidade. A ideia é manter os arquivos próximos de quem os utiliza e criar novas pastas quando isso melhorar a organização.

> [!NOTE]
>
> Perceba que `users/components/user-form/` não possui um arquivo `.css`, isso ocorre para exemplificar que ele não precisa de um. Não é obrigado criar e utilizar todos os arquivos gerados pelo Angular CLI.
>
> Além disso, como o projeto utiliza TailwindCSS global, muitos arquivos não precisarão de um `.css` específico pra ele, desde que possa ser resolvido por classes Tailwind.

### 3.3. Organização das rotas e lazy loading

Cada feature poderá possuir seu próprio arquivo de rotas, permitindo que a navegação relacionada a uma funcionalidade seja organizada de maneira independente.

O arquivo principal, `app.routes.ts`, será responsável por definir as rotas globais da aplicação e direcionar o usuário para as funcionalidades correspondentes. Já o arquivo de rotas de cada feature será responsável por definir os caminhos internos daquela funcionalidade.

Para entender melhor, imagine que o **FlowSLA** possua uma funcionalidade de gerenciamento de usuários, organizada em `features/users/`.

**`app.routes.ts`:**

```js
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users.routes')
        .then((m) => m.routes),
  },
];
```

Nesse caso, estamos informando ao roteador principal que existe uma funcionalidade associada ao caminho `/users` e que suas rotas estão definidas no arquivo localizaro em `features/users/users.routes`.

A partir desse ponto, o Angular poderá carregar a configuração de rotas da feature quando ela for necessária.

**`features/users/users.routes.ts`:**

```js
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./users').then((m) => m.Users),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./user-profile').then((m) => m.UserProfile),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./user-search').then((m) => m.UserSearch),
  },
];
```

Observe que, nesse segundo arquivo, o caminho `''` representa a raiz da própria feature. Como a feature está associada ao caminho `/users` no arquivo principal, essa rota corresponde a `/users`.

Da mesma forma, os caminhos _profile_ e _search_ são relativos à rota principal da feature, resultando em `/users/profile` e `/users/search`, respectivamente.

Seria algo assim:

| Arquivo           | Caminho definido | URL resultante   |
| ----------------- | ---------------- | ---------------- |
| `app.routes.ts`   | `users`          | `/users`         |
| `users.routes.ts` | `''`             | `/users`         |
| `users.routes.ts` | `profile`        | `/users/profile` |
| `users.routes.ts` | `search`         | `/users/search`  |

#### Mas como isso ajuda no desempenho?

É aqui que entra o conceito de _lazy loading_.

Ao utilizar `loadChildren`, o Angular pode carregar a configuração de rotas da feature sob demanda, em vez de incluí-la obrigatoriamente no carregamento inicial da aplicação. Além disso, ao utilizar `loadComponent`, os componentes associados a essas rotas também podem ser carregados sob demanda.

Isso significa que, se o usuário acessar inicialmente uma página que não utiliza a funcionalidade de usuários, o código exclusivo dessa feature poderá deixar de fazer parte do carregamento inicial. Quando o usuário navegar até /users, o Angular poderá carregar os recursos necessários para atender àquela navegação.

> [!NOTE]
>
> O _lazy loading_ não significa que o código nunca será carregado ou que cada navegação necessariamente fará um novo download. Os recursos são carregados quando necessários e podem permanecer disponíveis durante a execução da aplicação.

## 4. `/app/shared` — Recursos compartilhados

O diretório `shared/` é destinado a recursos genéricos que podem ser reutilizados por diferentes funcionalidades da aplicação. Diferentemente do `core/`, que concentra elementos da infraestrutura global, o `shared/` reúne recursos que não pertencem exclusivamente a uma feature e que podem ser utilizados em diferentes contextos.

A estrutura inicial do **FlowSLA** prevê:

```bash
shared/
├── pipes/
├── components/
└── schemas/
```

### 4.1 Componentees Compartilhados

Embora a estrutura inicial ainda não possua um diretório para eles, componentes reutilizáveis poderão ser organizados em `shared/components/`. Esses componentes devem ter uma finalidade suficientemente genérica para serem utilizados em diferentes funcionalidades.

Exemplos:

- **Botão**: componente com estilos e comportamentos padronizados para diferentes ações.
- **Card**: componente genérico para apresentar informações em um formato visual consistente.
- **Modal**: estrutura reutilizável para exibir conteúdos em uma janela sobreposta.
- **Campo de formulário**: componente compartilhado para padronizar a apresentação e a interação de campos de entrada

### 4.2 `/shared/pipes`

Armazena pipes reutilizáveis que transformam ou formatam dados para apresentação nos templates. Os pipes permitem aplicar transformações de maneira declarativa, evitando a repetição de operações de formatação em diferentes componentes.

Exemplos:

- **Formatação de datas**: apresentação de datas em um formato padronizado.
- **Formatação de textos**: transformação de textos para atender a um padrão de exibição.
- **Formatação de valores**: apresentação de números ou outros valores conforme uma convenção específica.

Antes de criar um pipe, devemos verificar se o Angular já oferece um recurso adequado para a necessidade. Não é necessário implementar uma solução própria quando uma funcionalidade nativa atende ao caso.

> [!IMPORTANT]
>
> Pipes que atendam exclusivamente a uma feature devem permanecer dentro dela.

### 4.3 `/shared/schemas`

O diretório `schemas/` poderá armazenar esquemas reutilizáveis para validar ou descrever estruturas de dados, conforme as tecnologias adotadas pelo projeto. O **FLowSLA** utiliza uma biblioteca de validação baseada em _schemas_ chamada Zod, esse diretório deverar conecentrar os esquemas utilizados em diferentes funcionalidades.

A estrutura dentro dessa pasta deve seguir a seguinte estrutura:

```bash
schemas/
├── auth/
│   ├── update-password.schema.ts
│   ├── login.schema.ts
│   └── forgot-password.schema.ts
├── user/
│   ├── update-user.schema.ts
│   ├── public-user.schema.ts
│   └── create-user.schema.ts
├── components/
└── schemas/
```

Utilizaremos esses _schemas_ como uma espécie de DTO, realizando o contrato com o backend. Logo, cada esquema terá sua própria responsabilidade, tornando o desenvolvimento e a aplicação deles mais seguras relacionadas ao contexto de cada um.

> [!IMPORTANT]
>
> Embora esses arquivos sejam utilizados como contratos de dados, isso não significa que sejam automaticamente equivalentes aos DTOs do backend. As definições do frontend servem para orientar o desenvolvimento e a verificação dos dados no cliente antes de chegarem ao backend, mas não substituem a validação e a autorização realizadas pelo servidor.
>
> A fonte da verdade continua sendo o backend!

### 4.4 Outras estruturas possíveis

Conforme a aplicação evoluir, poderemos acrescentar outros diretórios ao `shared/`

Exemplos:

```bash
shared/
├── components/
├── directives/
├── pipes/
├── schemas/
└── utils/
```

- **components/**: componentes genéricos reutilizáveis em diferentes funcionalidades.
- **directives/**: diretivas reutilizáveis para adicionar comportamentos a elementos da interface.
- **pipes/**: pipes reutilizáveis para transformação e formatação de dados.
- **schemas/**: esquemas de validação compartilhados.
- **utils/**: funções utilitárias genéricas que não se encaixam melhor em uma responsabilidade específica.

Não é necessário criar todos esses diretórios antecipadamente. Eles devem ser adicionados quando houver código que justifique sua existência.

## 5. Como decidir onde um arquivo deve ficar?

Durante o desenvolvimento, é comum surgir a dúvida sobre o diretório mais adequado para determinado componente, serviço ou função.

Para manter a organização consistente, adotaremos os seguintes critérios:

| Situação                                                                               | Diretório recomendado                              |
| -------------------------------------------------------------------------------------- | -------------------------------------------------- |
| O arquivo implementa uma funcionalidade específica.                                    | `features/nome-da-feature/`                        |
| O arquivo é um componente exclusivo de uma funcionalidade.                             | Diretório da própria feature.                      |
| O arquivo implementa um serviço específico de uma funcionalidade.                      | Diretório da própria feature.                      |
| O arquivo é utilizado por diferentes funcionalidades e possui uma finalidade genérica. | `shared/`                                          |
| O arquivo implementa um componente genérico de interface reutilizável.                 | `shared/components/`                               |
| O arquivo é responsável por um comportamento global da infraestrutura.                 | `core/`                                            |
| O arquivo implementa um guard utilizado na navegação global.                           | `core/guards/`                                     |
| O arquivo implementa um interceptador HTTP global.                                     | `core/interceptors/`                               |
| O arquivo define configurações globais da aplicação.                                   | `app/` ou `core/`, dependendo da responsabilidade. |

> [!NOTE]
>
> Esses critérios são orientações, não regras absolutas. O mais importante é considerar a responsabilidade do arquivo, seu contexto de utilização e suas dependências.
