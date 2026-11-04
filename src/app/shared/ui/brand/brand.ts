import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <a
      routerLink="/"
      class="inline-flex min-h-11 items-center gap-2.5 rounded-sm no-underline"
      aria-label="NIVELO, voltar ao site"
    >
      <img src="/images/nivelo-symbol.svg" alt="" width="35" height="28" />
      <span
        class="text-[22px] leading-none font-extrabold tracking-[-.035em]"
        [class.text-white]="light()"
        [class.text-navy]="!light()"
        >NIVELO</span
      >
    </a>
  `,
})
export class Brand {
  readonly light = input(false);
}
