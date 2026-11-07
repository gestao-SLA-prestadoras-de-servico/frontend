import { Directive } from '@angular/core';
import { controlClasses } from './control-classes';

@Directive({
  selector: 'input[appInput]',
  host: {
    class: `${controlClasses} h-[52px]`,
  },
})
export class Input {}
