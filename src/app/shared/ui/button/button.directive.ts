import { Directive, HostBinding, input } from '@angular/core';

const buttonBaseClasses =
  'group/action inline-flex items-center justify-center gap-2.5 rounded-control border text-center text-sm leading-[1.4] font-semibold no-underline transition-colors duration-(--motion-feedback) ease-out';

@Directive({
  selector: '[appButton]',
  standalone: true,
  host: { class: buttonBaseClasses },
})
export class Button {}

@Directive({
  selector: '[appButtonPrimary]',
  standalone: true,
  host: { class: `${buttonBaseClasses} border-transparent bg-pri text-white hover:bg-pri-d` },
})
export class ButtonPrimary {}

type SecondaryTone = '' | 'default' | 'inverse';

@Directive({
  selector: '[appButtonSecondary]',
  standalone: true,
})
export class ButtonSecondary {
  readonly appButtonSecondary = input<SecondaryTone>('default');

  @HostBinding('class')
  protected get classes(): string {
    const secondaryClasses =
      this.appButtonSecondary() === 'inverse'
        ? 'border-[#b0c3dc] bg-transparent text-white hover:border-pri hover:bg-white/10'
        : 'border-line2 bg-transparent text-navy hover:border-pri hover:bg-pri-bg';

    return `${buttonBaseClasses} ${secondaryClasses}`;
  }
}
