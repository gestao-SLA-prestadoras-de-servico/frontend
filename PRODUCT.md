# Nivelo

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Gestores de prestadoras de serviços técnicos são o público principal da apresentação. A plataforma prevê os perfis de gestor, técnico e cliente.

## Product Purpose

Organizar chamados, acompanhar os prazos contratuais e reunir evidências dos atendimentos em um só lugar.

## Capabilities and Constraints

O projeto está em desenvolvimento. O escopo previsto inclui contratos, chamados, três prazos de SLA (resposta, atendimento em campo e resolução), evidências fotográficas, notificações, relatórios e histórico de ações e responsáveis.

A entrega atual é uma landing pública na rota `/` do Angular existente, com prerenderização e hidratação com repetição de eventos. Em 31/10/2026, o usuário aprovou a substituição de A — Fluxo de luz pela composição e pelo movimento da referência Isoline, da 8B, adaptados à Nivelo. Os doze capítulos seguem esta ordem: abertura, benefícios, três prazos, histórico, evidências, fluxo, perfis, plataforma, contratos, uso pelo celular, seis perguntas frequentes e disponibilidade. Contornos em camadas, cartazes suspensos, mostrador, fotografias em degraus e faixas coloridas apresentam o conteúdo. Inclui navegação responsiva, menu móvel, demonstrações locais dos três perfis e diálogo de disponibilidade. Não inclui autenticação, API de produto, coleta de contatos ou telas internas operacionais. Os botões de disponibilidade informam que o acesso ao sistema ainda não está disponível.

O uso da futura plataforma pelo navegador do celular está previsto; esta entrega não oferece aplicativo nativo ou funcionamento offline. Os dados, estados, horários e imagens do chamado #1042 são ilustrativos. As simulações de distribuição, registro de evidência e validação alteram apenas a demonstração local; não enviam informações, não enviam arquivos e não persistem dados de produto. O cenário de validação do cliente é independente do chamado principal, cuja resolução permanece em andamento.

A entrega FRONTEND 05 acrescenta as rotas `/login`, `/sessao-demo` e `/sessao-expirada`, preservando a landing. Elas demonstram entrada com campos obrigatórios, carregamento, navegação local usando qualquer e-mail válido e senha preenchida, saída e expiração com um perfil fictício. Não autenticam usuários, não protegem rotas, não armazenam credenciais e não se integram ao Keycloak. O perfil ilustrativo e o roteiro estão em `docs/FRONTEND_05_ACCESS.md`.

A entrega FRONTEND 04 acrescenta um shell de demonstração para Gestor, Técnico e Cliente em `/app`, com navegação lateral, cabeçalho, breadcrumbs, seletor de perfil fictício, menu móvel e páginas não encontradas. As páginas apresentam exemplos locais e prévias das áreas futuras, sem operações de negócio, APIs ou autorização real. Os dados e limites estão em `docs/FRONTEND_04_LAYOUT.md`.

## Brand Commitments

Nome Nivelo, em substituição a FlowSLA na apresentação atual. Português brasileiro, linguagem direta e concreta. Preservar a identidade estabelecida na opção C — Faixa de luz: Manrope, azul-noite, azul corporativo, verde operacional, turquesa do símbolo e superfícies claras. A referência Isoline substitui a composição da landing, preservando essa identidade, o símbolo original e os links, a aparência e o comportamento da navbar. O vídeo de luz e seu poster continuam em uma pequena janela da abertura. `DESIGN.md` é a fonte da verdade visual implementada, com valores extraídos do código; `docs/NIVELO_BRAND.md` registra a relação entre os ativos e a prancha.

O símbolo obrigatório é o check em camadas da primeira imagem fornecida pelo usuário, preservado em `public/images/nivelo-symbol.svg`. A prancha orienta tipografia e paleta; o símbolo diferente nela não substitui o primeiro. Identificar o Projeto Integrador 2026.2 no rodapé.

## Evidence on Hand

O plano confirmado e `docs/Prosposta-Integrador(2).md` descrevem o produto previsto. `docs/DESIGN_SYSTEM.md` preserva a especificação histórica do protótipo de telas internas ainda não implementadas. A composição A anterior está arquivada, sem alterações, em `docs/references/nivelo-opcao-a-fluxo-de-luz.png`, com origem em seu sidecar. O briefing em `.impeccable/surfaces/src-app-app-html.md` e `docs/ISOLINE_REFERENCE.md` registram a composição atual, seus limites, atribuições e verificação. `docs/LANDING_FLUXO_DE_LUZ.md` e `docs/LANDING_SCROLL_MOTION.md` conservam o histórico anterior. A página pública de Isoline e a gravação de 30,47 s fornecida pelo usuário orientam a reprodução visual e de movimento; nenhuma referência visual estabelece fatos comerciais ou uma interface operacional.

A foto complementar de manutenção em `public/images/manutencao-ilustrativa.png` foi gerada com `image_gen` e está identificada como ilustrativa junto à imagem. Seu prompt exato e sua origem estão preservados em `docs/references/manutencao-ilustrativa.prompt.txt` e no sidecar da imagem. Ela não representa equipe, cliente ou atendimento real.

Os recortes de Gestor, Técnico e Cliente em `public/images/nivelo-*-ilustrativo.webp` foram gerados com `image_gen`, preservam transparência e estão identificados como ilustrativos na página. Prompts exatos estão em `docs/references/isoline-figures-prompts.json` e nos sidecars adjacentes. As geometrias dos contornos vêm da referência Isoline sob licença MIT, preservada em `docs/references` e `public/licenses`.

Não há depoimentos, clientes, certificações, resultados quantitativos, preços ou condições comerciais confirmados para publicação. A apresentação não deve tratar números do comp ou exemplos fictícios como prova de operação real.

## Product Principles

- Relacionar cada problema a uma capacidade concreta.
- Distinguir funcionalidades previstas de disponibilidade atual.
- Mostrar os três compromissos de prazo de forma compreensível.
- Associar evidências e histórico ao atendimento.
- Preservar os avisos de desenvolvimento e a identificação dos exemplos.

## Accessibility & Inclusion

Navegação por teclado, foco visível, interface responsiva, conteúdo textual acessível, contraste legível e respeito à preferência por redução de movimento. O diálogo de disponibilidade e o menu móvel devem conter o foco, fechar por Escape e devolver o foco ao acionador. As abas de perfil oferecem navegação por setas, Home e End e comunicam o resultado das simulações. O poster mantém a pequena janela de vídeo quando a mídia não pode tocar ou há preferência por movimento reduzido; conteúdo e ações permanecem disponíveis. Os cartazes dos três prazos ficam em sequência no celular. Movimento reduzido apresenta contornos e cartazes estáticos; sem as APIs de animação, o HTML permanece legível. As entradas são um aprimoramento após a hidratação, e os efeitos contínuos acompanham a rolagem nativa de ida e volta.
