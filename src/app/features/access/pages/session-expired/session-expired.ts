import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideClock3, LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { AccessLayout } from '../../components/access-layout/access-layout';

@Component({
  selector: 'app-session-expired',
  imports: [AccessLayout, RouterLink, ButtonPrimary, PageHeading, LucideDynamicIcon],
  templateUrl: './session-expired.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class SessionExpired {
  protected readonly icons = { clock: LucideClock3, arrow: LucideArrowRight };
}
