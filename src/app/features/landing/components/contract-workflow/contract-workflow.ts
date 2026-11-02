import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconName } from '../icon/icon';
import { Reveal } from '../../reveal.directive';
import { ScrollMotion } from '../../scroll-motion.directive';

@Component({
  selector: 'app-contract-workflow',
  host: { class: 'block' },
  imports: [ScrollMotion, Reveal],
  templateUrl: './contract-workflow.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractWorkflow {
  protected readonly labels = ['Contrato', 'Equipe', 'Evidências', 'Cliente'];
  protected readonly bands = Array.from({ length: 12 }, (_, i) => i);
  protected readonly steps: { icon: IconName; title: string; description: string }[] = [
    {
      icon: 'file',
      title: 'Configure',
      description: 'Defina contratos e seus três compromissos de prazo.',
    },
    {
      icon: 'users',
      title: 'Distribua',
      description: 'Registre a demanda e atribua o técnico responsável.',
    },
    {
      icon: 'camera',
      title: 'Registre',
      description: 'Documente o atendimento em campo com fotos e informações.',
    },
    {
      icon: 'check',
      title: 'Valide',
      description: 'O cliente valida a solução; a gestão acompanha o histórico.',
    },
  ];
}
