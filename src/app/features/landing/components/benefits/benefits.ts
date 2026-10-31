import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon, IconName } from '../icon/icon';
import { Reveal } from '../../reveal.directive';

@Component({
  selector: 'app-benefits',
  imports: [Icon, Reveal],
  templateUrl: './benefits.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Benefits {
  protected readonly benefits: { icon: IconName; title: string; description: string }[] = [
    {
      icon: 'file',
      title: 'Informação conectada',
      description: 'Contratos, chamados, prazos e evidências no mesmo lugar.',
    },
    {
      icon: 'clock',
      title: 'Acompanhamento com contexto',
      description: 'Cada compromisso de prazo e o próximo passo do atendimento à vista.',
    },
    {
      icon: 'check',
      title: 'Um serviço que deixa registro',
      description: 'Fotos, ações e responsáveis reunidos no histórico de cada chamado.',
    },
  ];
}
