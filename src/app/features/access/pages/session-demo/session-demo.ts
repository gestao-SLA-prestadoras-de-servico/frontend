import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideArrowRight, LucideDynamicIcon } from '@lucide/angular';
import { Brand } from '@app/shared/ui/brand/brand';
import { ButtonPrimary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { UserMenu } from '@app/shared/ui/user-menu/user-menu';
import { ACCESS_DEMO } from '../../data/access-demo';

@Component({
  selector: 'app-session-demo',
  imports: [Brand, UserMenu, RouterLink, ButtonPrimary, PageHeading, LucideDynamicIcon],
  templateUrl: './session-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class SessionDemo {
  protected readonly demo = ACCESS_DEMO;
  protected readonly icons = { back: LucideArrowLeft, arrow: LucideArrowRight };
  private readonly router = inject(Router);

  protected signOut(): void {
    void this.router.navigate(['/login'], { queryParams: { estado: 'saida' } });
  }

  protected expireSession(): void {
    void this.router.navigateByUrl('/sessao-expirada');
  }
}
