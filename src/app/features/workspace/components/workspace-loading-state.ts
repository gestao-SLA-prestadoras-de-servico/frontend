import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideLoaderCircle } from '@lucide/angular';

@Component({
  selector: 'app-workspace-loading-state',
  imports: [LucideLoaderCircle],
  template: `
    <div class="px-5 py-8" aria-busy="true">
      <p
        class="flex items-center justify-center gap-3 text-sm leading-relaxed text-ink2"
        role="status"
      >
        <svg
          lucideLoaderCircle
          class="size-5 shrink-0 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        ></svg>
        {{ label() }}
      </p>
      @if (skeleton()) {
        <div class="mt-6 space-y-4" aria-hidden="true">
          @for (line of [1, 2, 3]; track line) {
            <div class="h-3 rounded-sm bg-bg" [class]="line === 2 ? 'w-3/4' : 'w-full'"></div>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class WorkspaceLoadingState {
  readonly label = input('Carregando exemplos…');
  readonly skeleton = input(true);
}
