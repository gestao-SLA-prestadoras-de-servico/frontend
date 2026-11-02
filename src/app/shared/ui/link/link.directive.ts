import { Directive, HostBinding, input } from '@angular/core';

type LinkVariant = 'navigation' | 'menu' | 'footer';

const linkClasses: Record<LinkVariant, string> = {
  navigation:
    'inline-flex min-h-11 items-center text-xs font-medium whitespace-nowrap no-underline hover:underline hover:decoration-pri',
  menu: 'flex min-h-14 items-center justify-between border-t border-line py-4 text-lg no-underline',
  footer:
    'inline-flex min-h-11 items-center gap-[18px] text-[0.8125rem] no-underline hover:text-white hover:underline',
};

@Directive({
  selector: 'a[appLink]',
  standalone: true,
})
export class Link {
  readonly appLink = input<LinkVariant | ''>('');

  @HostBinding('class')
  protected get classes(): string {
    return linkClasses[this.appLink() || 'navigation'];
  }
}
