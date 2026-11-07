import { Directive } from '@angular/core';
import { controlClasses } from './control-classes';

@Directive({
  selector: 'select[appSelect]',
  host: { class: `${controlClasses} min-h-[52px] py-2` },
})
export class Select {}
