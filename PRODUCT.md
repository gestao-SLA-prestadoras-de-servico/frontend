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

A entrega atual é uma landing pública na rota `/` do Angular existente, com prerenderização e hidratação com repetição de eventos. A composição aprovada A — Fluxo de luz apresenta doze capítulos: hero, benefícios, três prazos, contratos, fluxo, plataforma, evidências, histórico, perfis, uso pelo celular, seis perguntas frequentes e disponibilidade. Inclui navegação responsiva, menu móvel, demonstrações locais dos três perfis e diálogo de disponibilidade. Não inclui autenticação, API de produto, coleta de contatos ou telas internas operacionais. Os botões de disponibilidade informam que o acesso ao sistema ainda não está disponível.

O uso da futura plataforma pelo navegador do celular está previsto; esta entrega não oferece aplicativo nativo ou funcionamento offline. Os dados, estados, horários e imagens do chamado #1042 são ilustrativos. As simulações de distribuição, registro de evidência e validação alteram apenas a demonstração local; não enviam informações, não enviam arquivos e não persistem dados de produto. O cenário de validação do cliente é independente do chamado principal, cuja resolução permanece em andamento.

## Brand Commitments

Nome Nivelo, em substituição a FlowSLA na apresentação atual. Português brasileiro, linguagem direta e concreta. Preservar a identidade estabelecida na opção C — Faixa de luz: Manrope, azul-noite, azul corporativo, verde operacional, turquesa do símbolo e superfícies claras. A opção A — Fluxo de luz, aprovada em 30/10/2026, amplia a composição da landing dentro dessa identidade. A navbar preserva os links, a aparência e o comportamento existentes. `DESIGN.md` é a fonte da verdade visual implementada, com tokens extraídos do código; `docs/NIVELO_BRAND.md` registra a relação entre os ativos e a prancha.

O símbolo obrigatório é o check em camadas da primeira imagem fornecida pelo usuário, preservado em `public/images/nivelo-symbol.svg`. A prancha orienta tipografia e paleta; o símbolo diferente nela não substitui o primeiro. Identificar o Projeto Integrador 2026.2 no rodapé.

## Evidence on Hand

O plano confirmado e `docs/Prosposta-Integrador(2).md` descrevem o produto previsto. `docs/DESIGN_SYSTEM.md` preserva a especificação histórica do protótipo de telas internas ainda não implementadas. A composição A aprovada está arquivada, sem alterações, em `docs/references/nivelo-opcao-a-fluxo-de-luz.png`, com origem em seu sidecar. O briefing em `.impeccable/surfaces/src-app-app-html.md` e `docs/LANDING_FLUXO_DE_LUZ.md` registram a composição atual, seus limites e a verificação. O comp é uma referência visual, não uma fonte de fatos comerciais ou uma interface operacional.

A foto complementar de manutenção em `public/images/manutencao-ilustrativa.png` foi gerada com `image_gen` e está identificada como ilustrativa junto à imagem. Seu prompt exato e sua origem estão preservados em `docs/references/manutencao-ilustrativa.prompt.txt` e no sidecar da imagem. Ela não representa equipe, cliente ou atendimento real.

Não há depoimentos, clientes, certificações, resultados quantitativos, preços ou condições comerciais confirmados para publicação. A apresentação não deve tratar números do comp ou exemplos fictícios como prova de operação real.

## Product Principles

- Relacionar cada problema a uma capacidade concreta.
- Distinguir funcionalidades previstas de disponibilidade atual.
- Mostrar os três compromissos de prazo de forma compreensível.
- Associar evidências e histórico ao atendimento.
- Preservar os avisos de desenvolvimento e a identificação dos exemplos.

## Accessibility & Inclusion

Navegação por teclado, foco visível, interface responsiva, conteúdo textual acessível, contraste legível e respeito à preferência por redução de movimento. O diálogo de disponibilidade e o menu móvel devem conter o foco, fechar por Escape e devolver o foco ao acionador. As abas de perfil oferecem navegação por setas, Home e End e comunicam o resultado das simulações. O poster estático mantém a composição quando o vídeo de fundo não pode tocar ou há preferência por movimento reduzido; conteúdo e ações permanecem disponíveis. A cena dos três prazos usa apresentação estática em telas estreitas, baixas ou com movimento reduzido; as entradas de seção são um aprimoramento após a hidratação, sem ocultar o HTML inicial.
