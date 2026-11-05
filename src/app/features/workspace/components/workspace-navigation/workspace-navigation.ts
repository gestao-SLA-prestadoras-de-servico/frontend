import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { WorkspaceProfile } from '../../data/workspace-data';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';

@Component({
  selector: 'app-workspace-navigation',
  imports: [RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './workspace-navigation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class WorkspaceNavigation {
  readonly profile = input.required<WorkspaceProfile>();
  readonly navigate = output<void>();
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly groups = computed(() => [
    ...new Set(this.profile().pages.map((page) => page.group)),
  ]);
}
