import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-manager-empty-state',
  template: `
    <div
      class="rounded-deadline border border-dashed border-ink3 bg-sf p-6 text-center sm:p-8"
      role="status"
    >
      <h3 class="text-base font-semibold">{{ title() }}</h3>
      <p class="mx-auto mt-2 max-w-[60ch] text-sm leading-[1.7] text-ink2">{{ description() }}</p>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerEmptyState {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
