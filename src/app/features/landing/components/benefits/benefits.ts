import { Card } from '../../../../shared/ui/card';
import { SectionHeading } from '../../../../shared/ui/section-heading';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../reveal.directive';
@Component({
  selector: 'app-benefits',
  host: { class: 'block' },
  imports: [SectionHeading, Card, Reveal],
  templateUrl: './benefits.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Benefits {}
