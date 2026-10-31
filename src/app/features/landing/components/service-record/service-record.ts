import { Contour } from '../contour/contour';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../reveal.directive';
import { ScrollMotion } from '../../scroll-motion.directive';

@Component({
  selector: 'app-service-record',
  imports: [Contour, ScrollMotion, Reveal],
  templateUrl: './service-record.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceRecord {
  protected readonly records = [
    {
      title: 'A solicitação',
      label: 'Cliente',
      text: 'O pedido dá início ao chamado. O cliente acompanha as informações disponíveis para o seu perfil.',
      image: 'nivelo-cliente-ilustrativo.webp',
      person: true,
    },
    {
      title: 'O acompanhamento',
      label: 'Gestor',
      text: 'Contrato, equipe e compromissos de prazo orientam a distribuição e o acompanhamento do atendimento.',
      image: 'nivelo-gestor-ilustrativo.webp',
      person: true,
    },
    {
      title: 'O atendimento em campo',
      label: 'Técnico',
      text: 'O serviço acontece no local. O técnico registra o atendimento e documenta o que foi realizado.',
      image: 'manutencao-ilustrativa.png',
      person: false,
    },
    {
      title: 'O registro que fica',
      label: 'Evidências',
      text: 'Fotografias associadas ao chamado dão contexto ao serviço e permanecem junto do histórico.',
      image: 'evidencias-ilustrativas.webp',
      person: false,
    },
  ];
  protected readonly events = [
    {
      time: '08:10',
      action: 'Chamado aberto',
      person: 'Marina',
      role: 'Cliente',
      description: 'Solicitação de manutenção de climatização.',
    },
    {
      time: '08:25',
      action: 'Resposta enviada',
      person: 'Rafael',
      role: 'Gestor',
      description: 'Primeiro posicionamento e atribuição do técnico.',
    },
    {
      time: '09:40',
      action: 'Atendimento iniciado',
      person: 'João',
      role: 'Técnico',
      description: 'Início do serviço no local do atendimento.',
    },
    {
      time: '10:15',
      action: 'Evidências registradas',
      person: 'João',
      role: 'Técnico',
      description: 'Fotos associadas ao chamado. Resolução em andamento.',
    },
  ];
}
