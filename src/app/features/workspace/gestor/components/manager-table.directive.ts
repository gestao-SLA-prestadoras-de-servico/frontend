import { Directive } from '@angular/core';

@Directive({
  selector: 'table[appManagerTable]',
  host: { class: 'w-full border-collapse text-left text-sm' },
})
export class ManagerTable {}

@Directive({
  selector: 'thead[appManagerTableHead]',
  host: { class: 'bg-bg text-xs font-semibold text-ink2' },
})
export class ManagerTableHead {}

@Directive({ selector: 'tbody[appManagerTableBody]', host: { class: 'divide-y divide-line' } })
export class ManagerTableBody {}
