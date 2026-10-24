import { Component } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-faq',
  imports: [Icon],
  templateUrl: './faq.html',
  host: { class: 'block' },
})
export class Faq {
  protected readonly questions = [
    {
      question: 'Para quem é a Nivelo?',
      answer:
        'Para prestadoras de serviços técnicos que precisam organizar chamados, acompanhar compromissos de prazo e documentar atendimentos. A plataforma prevê a participação de gestores, técnicos e clientes.',
    },
    {
      question: 'O que significa SLA?',
      answer:
        'SLA é a sigla para Service Level Agreement, ou acordo de nível de serviço. Na Nivelo, ele define os compromissos de prazo estabelecidos no contrato entre a prestadora e o cliente.',
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
        'Ainda não. A Nivelo está em desenvolvimento como parte do Projeto Integrador 2026.2. Esta página apresenta a proposta e exemplos ilustrativos; o acesso ao sistema ainda não está disponível.',
    },
  ];
}
