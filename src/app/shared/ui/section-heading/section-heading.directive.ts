import { Directive, HostBinding, input } from '@angular/core';

type SectionHeadingVariant = 'responsive' | 'inverse' | 'prominent';

const sectionHeadingClasses: Record<SectionHeadingVariant, string> = {
  responsive:
    'text-[1.85rem] sm:text-[clamp(2rem,5.4vw,3.375rem)] lg:text-[clamp(2rem,3.45vw,3.375rem)]',
  inverse: 'text-white',
  prominent: 'text-[clamp(1.875rem,3vw,2.875rem)]',
};

@Directive({
  selector: 'h2[appSectionHeading]',
  standalone: true,
})
export class SectionHeading {
  readonly appSectionHeading = input<SectionHeadingVariant | ''>('responsive');

  @HostBinding('class')
  protected get classes(): string {
    return sectionHeadingClasses[this.appSectionHeading() || 'responsive'];
  }
}
