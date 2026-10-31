import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../icon/icon';
import { Reveal } from '../../reveal.directive';
import { ScrollMotion } from '../../scroll-motion.directive';

@Component({
  selector: 'app-service-record',
  imports: [ScrollMotion, Icon, Reveal],
  templateUrl: './service-record.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceRecord {
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
