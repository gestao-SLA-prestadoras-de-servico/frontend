import { Directive, HostBinding, input } from '@angular/core';

type SectionHeadingVariant = 'responsive' | 'statement' | 'history';

const sectionHeadingBaseClasses = 'leading-[1.02] font-[550] tracking-[-.035em]';

const sectionHeadingClasses: Record<SectionHeadingVariant, string> = {
  responsive: 'text-[clamp(2.1rem,8.5vw,3.1rem)] md:text-[clamp(2.2rem,4.5vw,4.4rem)]',
  statement:
    'max-w-[17ch] text-[clamp(2.4rem,10vw,3.8rem)] text-white md:text-[clamp(2.6rem,5.6vw,5.4rem)]',
  history: 'text-[clamp(2.2rem,3.6vw,3.5rem)]',
};

@Directive({
  selector: 'h2[appSectionHeading]',
  standalone: true,
})
export class SectionHeading {
  readonly appSectionHeading = input<SectionHeadingVariant | ''>('responsive');

  @HostBinding('class')
  protected get classes(): string {
    return `${sectionHeadingBaseClasses} ${sectionHeadingClasses[this.appSectionHeading() || 'responsive']}`;
  }
}
