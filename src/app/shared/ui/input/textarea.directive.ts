import { Directive } from '@angular/core';
import { controlClasses } from './control-classes';

@Directive({
  selector: 'textarea[appTextarea]',
  host: { class: `${controlClasses} min-h-28 resize-y py-3` },
})
export class Textarea {}
