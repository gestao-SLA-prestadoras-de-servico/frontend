import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';

@Component({
  selector: 'app-manager-page-header',
  imports: [PageHeading, LucideDynamicIcon],
  template: `
    <div class="flex flex-wrap items-start justify-between gap-5">
      <div class="min-w-0 max-w-[65ch]">
        <div class="mb-3 empty:hidden"><ng-content select="[managerHeaderContext]" /></div>
        <h1
          appPageHeading
          class="text-[26px] leading-[1.25] font-semibold tracking-[-.03em] sm:text-[28px]"
        >
          {{ title() }}
        </h1>
        @if (description()) {
          <p class="mt-2 text-sm leading-[1.7] text-ink2">{{ description() }}</p>
        }
      </div>
      <ng-content select="[managerHeaderActions]" />
    </div>
    @if (demo()) {
      <p class="mt-3 flex items-start gap-2 text-xs leading-[1.7] text-ink3">
        <svg class="mt-0.5 size-4 shrink-0" [lucideIcon]="icons.info" aria-hidden="true"></svg
        >{{ demo() }}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerPageHeader {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly demo = input('');
  protected readonly icons = WORKSPACE_ICONS;
}
