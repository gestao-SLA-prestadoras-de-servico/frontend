import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { LucideArrowRight, LucideDynamicIcon, LucideLoaderCircle } from '@lucide/angular';
import { AuthService } from '@app/core/services/auth.service';
import { ButtonPrimary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { AccessLayout } from '../../components/access-layout/access-layout';

/** As credenciais são digitadas no Keycloak; aqui só iniciamos o fluxo. */
@Component({
  selector: 'app-login',
  imports: [AccessLayout, ButtonPrimary, PageHeading, LucideDynamicIcon],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly returnState = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('estado'))),
    { initialValue: this.route.snapshot.queryParamMap.get('estado') },
  );
  protected readonly icons = { arrow: LucideArrowRight, loading: LucideLoaderCircle };
  protected readonly busy = signal(false);
  protected readonly ready = signal(false);

  constructor() {
    afterNextRender(() => {
      const perfil = this.auth.perfil();
      if (perfil) void this.router.navigateByUrl(`/app/${perfil}`);
      else this.ready.set(true);
    });
  }

  protected entrar(): void {
    if (!this.ready() || this.busy()) return;
    this.busy.set(true);
    this.auth.login();
  }
}
