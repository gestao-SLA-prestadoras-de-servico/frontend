import { Card } from '../../../../shared/ui/card';
import { SectionHeading } from '../../../../shared/ui/section-heading';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductPreview } from '../product-preview/product-preview';
import { Reveal } from '../../reveal.directive';
import { ScrollMotion } from '../../scroll-motion.directive';

@Component({
  selector: 'app-platform-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, Card, ScrollMotion, ProductPreview, Reveal],
  templateUrl: './platform-overview.html',
  host: { class: 'block' },
})
export class PlatformOverview {
  protected readonly statuses = [
    {
      mark: 'Resposta',
      title: 'O primeiro retorno.',
      description: 'Primeiro posicionamento da prestadora ao cliente.',
      state: 'Cumprido',
    },
    {
      mark: 'Em campo',
      title: 'O serviço começa.',
      description: 'Início do atendimento técnico no local.',
      state: 'Cumprido',
    },
    {
      mark: 'Resolução',
      title: 'A solução em contexto.',
      description: 'A solução será apresentada com os registros do serviço.',
      state: 'Em andamento',
    },
  ];
}
