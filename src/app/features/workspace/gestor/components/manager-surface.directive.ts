import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appManagerPanel]',
  host: {
    class: 'min-w-0 rounded-deadline border border-line bg-sf',
    '[class]': 'padding[appManagerPanel()]',
  },
})
export class ManagerPanel {
  readonly appManagerPanel = input<'' | 'compact' | 'flush'>('');
  protected readonly padding = { '': 'p-4 sm:p-5', compact: 'p-3 sm:p-4', flush: '' };
}

@Directive({
  selector: '[appManagerCollection]',
  host: { class: 'relative rounded-deadline border border-line bg-sf' },
})
export class ManagerCollection {}

@Directive({
  selector: 'dialog[appManagerDialog]',
  host: {
    class:
      'm-auto max-h-[calc(100dvh-24px)] overflow-y-auto rounded-deadline border border-line bg-sf p-0 text-ink shadow-dialog backdrop:bg-navy/45',
  },
})
export class ManagerDialog {}

@Directive({
  selector: '[appManagerSectionHeading]',
  host: { class: 'text-base leading-[1.5] font-semibold tracking-normal' },
})
export class ManagerSectionHeading {}

@Directive({ selector: 'label[appManagerLabel]', host: { class: 'block text-sm font-semibold' } })
export class ManagerLabel {}

@Directive({
  selector: '[appManagerTextAction]',
  host: {
    class:
      'inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm font-semibold underline underline-offset-4 disabled:cursor-not-allowed disabled:text-ink3',
    '[class]':
      "appManagerTextAction() === 'danger' ? 'text-danger enabled:hover:opacity-80' : 'text-pri-d hover:text-pri'",
  },
})
export class ManagerTextAction {
  readonly appManagerTextAction = input<'' | 'danger'>('');
}
