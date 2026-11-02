import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../reveal.directive';
@Component({
  selector: 'app-benefits',
  host: { class: 'block' },
  imports: [Reveal],
  templateUrl: './benefits.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Benefits {}
