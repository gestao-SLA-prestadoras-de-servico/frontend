import { Component } from '@angular/core';
import { Icon } from './icon';

@Component({
  selector: 'app-faq',
  imports: [Icon],
  template: `<section class="section" id="faq" tabindex="-1" aria-labelledby="faq-title">
    <div class="wrap faq-layout">
      <div>
        <h2 id="faq-title">Antes de começar,<br />vale saber.</h2>
        <p class="lead">As principais dúvidas sobre a proposta do FlowSLA.</p>
      </div>
      <div class="questions">
        @for (item of questions; track item.question) {
          <details>
            <summary>{{ item.question }}<app-icon name="plus" /></summary>
            <p>{{ item.answer }}</p>
          </details>
        }
      </div>
    </div>
  </section>`,
  styles: `
    :host {
      display: block;
    }
    .faq-layout {
      display: grid;
      grid-template-columns: 0.8fr 1.2fr;
      gap: 80px;
    }
    .lead {
      margin-top: 20px;
      max-width: 30ch;
    }
    details {
      border-bottom: 1px solid var(--line);
    }
    details:first-child {
      border-top: 1px solid var(--line);
    }
    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      min-height: 72px;
      padding: 20px 4px;
      list-style: none;
      color: var(--navy);
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.5;
      cursor: pointer;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary:hover {
      color: var(--pri-d);
    }
    summary app-icon {
      width: 18px;
      height: 18px;
      color: var(--pri);
      transition: transform var(--motion-state) var(--ease-out);
    }
    details[open] summary app-icon {
      transform: rotate(45deg);
    }
    details > p {
      max-width: 65ch;
      line-height: 1.65;
      color: var(--ink2);
      padding: 0 32px 24px 4px;
    }
    @media (max-width: 820px) {
      .faq-layout {
        gap: 36px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      summary app-icon {
        transition: none;
      }
    }
    @media (max-width: 600px) {
      .faq-layout {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Faq {
  protected readonly questions = [
    {
      question: 'Para quem é o FlowSLA?',
      answer:
        'Para prestadoras de serviços técnicos que precisam organizar chamados, acompanhar compromissos de prazo e documentar atendimentos. A plataforma prevê a participação de gestores, técnicos e clientes.',
    },
    {
      question: 'O que significa SLA?',
      answer:
        'SLA é a sigla para Service Level Agreement, ou acordo de nível de serviço. No FlowSLA, ele define os compromissos de prazo estabelecidos no contrato entre a prestadora e o cliente.',
    },
    {
      question: 'Quais são os três prazos acompanhados?',
      answer:
        'Resposta: o primeiro posicionamento da prestadora. Atendimento em campo: o início do atendimento técnico no local. Resolução: a apresentação da solução para o problema. Cada um será acompanhado conforme a política do contrato.',
    },
    {
      question: 'Como será feito o registro de evidências?',
      answer:
        'O técnico poderá enviar fotos vinculadas ao atendimento. Elas ficarão associadas ao chamado e ao histórico do serviço, para que as pessoas com permissão possam consultar o registro. As imagens desta página são apenas ilustrativas.',
    },
    {
      question: 'Poderei usar pelo navegador do celular?',
      answer:
        'Sim. A proposta prevê uma interface web responsiva, acessível pelo navegador do celular, com conexão à internet. Não é necessário um aplicativo nativo; o funcionamento offline não faz parte desta entrega.',
    },
    {
      question: 'O sistema já está disponível?',
      answer:
        'Ainda não. O FlowSLA está em desenvolvimento como parte do Projeto Integrador 2026.2. Esta página apresenta a proposta e exemplos ilustrativos; o acesso ao sistema ainda não está disponível.',
    },
  ];
}
