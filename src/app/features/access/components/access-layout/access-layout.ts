import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideDynamicIcon } from '@lucide/angular';
import { Brand } from '@app/shared/ui/brand/brand';

@Component({
  selector: 'app-access-layout',
  imports: [Brand, RouterLink, LucideDynamicIcon],
  templateUrl: './access-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class AccessLayout {
  readonly centerBrand = input(false);
  protected readonly arrowLeft = LucideArrowLeft;
}
