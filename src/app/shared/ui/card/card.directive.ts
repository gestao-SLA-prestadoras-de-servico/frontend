import { Directive, HostBinding, input } from '@angular/core';

type CardVariant = 'benefit' | 'feature' | 'role';

const cardClasses: Record<CardVariant, string> = {
  benefit: 'border-t border-line2 pt-[22px]',
  feature: 'border-t border-line pt-6 sm:pb-6 lg:first:border-t-0 lg:first:pt-0',
  role: 'border-t border-line2 pt-6',
};

@Directive({
  selector: 'article[appCard]',
  standalone: true,
})
export class Card {
  readonly appCard = input<CardVariant | ''>('benefit');

  @HostBinding('class')
  protected get classes(): string {
    return cardClasses[this.appCard() || 'benefit'];
  }
}
