import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-action-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex min-w-0' },
  template: `<span class="relative block overflow-hidden"
    ><span
      class="block transition-transform duration-(--motion-label) ease-out motion-safe:group-hover/action:-translate-y-full motion-safe:group-focus-visible/action:-translate-y-full motion-reduce:transition-none"
      >{{ label() }}</span
    ><span
      class="absolute inset-x-0 top-full block transition-transform duration-(--motion-label) ease-out motion-safe:group-hover/action:-translate-y-full motion-safe:group-focus-visible/action:-translate-y-full motion-reduce:transition-none"
      aria-hidden="true"
      >{{ label() }}</span
    ></span
  >`,
})
export class ActionLabel {
  readonly label = input.required<string>();
}
