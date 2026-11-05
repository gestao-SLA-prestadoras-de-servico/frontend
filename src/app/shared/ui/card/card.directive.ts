import { Directive, HostBinding, input } from '@angular/core';

type CardVariant = 'benefit' | 'feature' | 'role';

const cardClasses: Record<CardVariant, string> = {
  benefit:
    'grid grid-cols-1 items-end gap-8 md:grid-cols-[1.3fr_1fr] md:gap-[5vw] lg:grid-cols-[1.4fr_1fr] lg:gap-[8vw]',
  feature: 'text-sm text-ink2 [&>strong]:block [&>strong]:text-navy',
  role: 'grid grid-cols-2 items-center gap-5 md:block md:nth-2:pt-9 md:nth-3:pt-[72px] lg:nth-2:pt-[72px] lg:nth-3:pt-[144px]',
};

@Directive({
  selector: '[appCard]',
  standalone: true,
})
export class Card {
  // Presentation only: retain the native semantics of each editorial block.
  readonly appCard = input<CardVariant | ''>('benefit');

  @HostBinding('class')
  protected get classes(): string {
    return cardClasses[this.appCard() || 'benefit'];
  }
}
