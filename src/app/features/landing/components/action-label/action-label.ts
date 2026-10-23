import { Component, input } from '@angular/core';

@Component({
  selector: 'app-action-label',
  template: `<span class="label-window"
    ><span class="label-text">{{ label() }}</span
    ><span class="label-text label-copy" aria-hidden="true">{{ label() }}</span></span
  >`,
})
export class ActionLabel {
  readonly label = input.required<string>();
}
