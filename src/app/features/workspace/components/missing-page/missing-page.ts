import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';

@Component({
  selector: 'app-missing-page',
  imports: [RouterLink, ButtonPrimary, PageHeading, LucideDynamicIcon],
  template: ` <section
    class="mx-auto flex min-h-[440px] max-w-[480px] flex-col items-start justify-center py-10"
    aria-labelledby="missing-page-heading"
  >
    <svg class="mb-6 size-9 text-ink3" [lucideIcon]="icons.help" aria-hidden="true"></svg>
    <h1
      appPageHeading
      id="missing-page-heading"
      class="text-[28px] leading-[1.25] font-semibold tracking-[-.03em]"
    >
      Página não encontrada
    </h1>
    <p class="mt-4 text-base text-ink2">
      Não encontramos esta página. O endereço pode ter mudado ou não fazer parte da demonstração.
    </p>
    <a [routerLink]="home()" appButtonPrimary class="mt-7 min-h-12 px-5 py-3"
      >{{ label() }}<svg class="size-4" [lucideIcon]="icons.arrow" aria-hidden="true"></svg
    ></a>
    <p class="mt-6 text-sm text-ink3">Este aviso não representa uma restrição de acesso.</p>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class MissingPage {
  readonly home = input('/app/gestor');
  readonly label = input('Voltar à demonstração');
  protected readonly icons = WORKSPACE_ICONS;
}
