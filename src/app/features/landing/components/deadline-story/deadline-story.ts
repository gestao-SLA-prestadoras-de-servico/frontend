import { SectionHeading } from '../../../../shared/ui/section-heading';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../reveal.directive';
import { ScrollMotion } from '../../scroll-motion.directive';
import { Contour } from '../contour/contour';
@Component({
  selector: 'app-deadline-story',
  host: { class: 'block' },
  imports: [SectionHeading, Reveal, ScrollMotion, Contour],
  templateUrl: './deadline-story.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeadlineStory {
  protected readonly steps = [
    {
      title: 'Resposta',
      subtitle: 'O primeiro retorno',
      description: 'O chamado é recebido e a prestadora dá seu primeiro posicionamento ao cliente.',
      image: 'gestor',
    },
    {
      title: 'Atendimento em campo',
      subtitle: 'O início do serviço',
      description: 'O técnico inicia o atendimento no local, conforme os compromissos do contrato.',
      image: 'tecnico',
    },
    {
      title: 'Resolução',
      subtitle: 'A solução apresentada',
      description: 'A solução é registrada com as evidências do serviço e segue para validação.',
      image: 'cliente',
    },
  ];
}
