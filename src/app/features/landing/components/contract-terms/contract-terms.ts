import { SectionHeading } from '../../../../shared/ui/section-heading';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../reveal.directive';
@Component({
  selector: 'app-contract-terms',
  imports: [SectionHeading, Reveal],
  templateUrl: './contract-terms.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractTerms {}
