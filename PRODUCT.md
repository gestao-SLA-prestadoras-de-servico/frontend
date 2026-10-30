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

A entrega atual é uma landing pública na rota `/` do Angular existente, com prerenderização e hidratação com repetição de eventos. Inclui navegação responsiva, menu móvel, seis perguntas frequentes e diálogo de disponibilidade. Não inclui autenticação, API de produto, coleta de contatos ou telas internas operacionais. Os botões de disponibilidade informam que o acesso ao sistema ainda não está disponível.

O uso da futura plataforma pelo navegador do celular está previsto; esta entrega não oferece aplicativo nativo ou funcionamento offline. Os dados, estados, horários e imagens do exemplo de chamado são ilustrativos.

## Brand Commitments

Nome Nivelo, em substituição a FlowSLA na apresentação atual. Português brasileiro, linguagem direta e concreta. Usar a identidade aprovada na opção C — Faixa de luz: Manrope, azul-noite, azul corporativo, verde operacional, turquesa do símbolo e superfícies claras. `DESIGN.md` é a fonte da verdade visual implementada, com tokens extraídos do código; `docs/NIVELO_BRAND.md` registra a relação entre os ativos e a prancha.

O símbolo obrigatório é o check em camadas da primeira imagem fornecida pelo usuário, preservado em `public/images/nivelo-symbol.svg`. A prancha orienta tipografia e paleta; o símbolo diferente nela não substitui o primeiro. Identificar o Projeto Integrador 2026.2 no rodapé.

## Evidence on Hand

O plano confirmado e `docs/Prosposta-Integrador(2).md` descrevem o produto previsto. `docs/DESIGN_SYSTEM.md` preserva a especificação histórica do protótipo de telas internas ainda não implementadas. A escolha C aprovada e o briefing em `.impeccable/surfaces/src-app-app-html.md` orientam a landing atual.

Não há depoimentos, clientes, certificações, resultados quantitativos, preços ou condições comerciais confirmados para publicação. A apresentação não deve tratar números do comp ou exemplos fictícios como prova de operação real.

## Product Principles

- Relacionar cada problema a uma capacidade concreta.
- Distinguir funcionalidades previstas de disponibilidade atual.
- Mostrar os três compromissos de prazo de forma compreensível.
- Associar evidências e histórico ao atendimento.
- Preservar os avisos de desenvolvimento e a identificação dos exemplos.

## Accessibility & Inclusion

Navegação por teclado, foco visível, interface responsiva, conteúdo textual acessível, contraste legível e respeito à preferência por redução de movimento. O diálogo de disponibilidade e o menu móvel devem conter o foco, fechar por Escape e devolver o foco ao acionador. O poster estático mantém a composição quando o vídeo de fundo não pode tocar ou há preferência por movimento reduzido; conteúdo e ações permanecem disponíveis.
