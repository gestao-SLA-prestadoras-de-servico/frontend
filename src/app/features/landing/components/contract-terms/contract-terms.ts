import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../reveal.directive';
@Component({
  selector: 'app-contract-terms',
  imports: [Reveal],
  templateUrl: './contract-terms.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractTerms {}
