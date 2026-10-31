import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductPreview } from '../product-preview/product-preview';
import { Reveal } from '../../reveal.directive';
import { ScrollMotion } from '../../scroll-motion.directive';

@Component({
  selector: 'app-platform-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollMotion, ProductPreview, Reveal],
  templateUrl: './platform-overview.html',
  host: { class: 'block' },
})
export class PlatformOverview {}
