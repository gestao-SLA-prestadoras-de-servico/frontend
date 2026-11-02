import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../icon/icon';
import { Reveal } from '../../reveal.directive';
import { ScrollMotion } from '../../scroll-motion.directive';

@Component({
  selector: 'app-mobile-access',
  host: { class: 'block' },
  imports: [ScrollMotion, Icon, Reveal],
  templateUrl: './mobile-access.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileAccess {}
