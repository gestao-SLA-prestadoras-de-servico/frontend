import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClientBadge, ClientBadgeTone } from './client-badge';
import { ClientPriority } from '../data/client-data';

@Component({
  selector: 'app-client-priority',
  imports: [ClientBadge],
  template: `<app-client-badge [label]="priority()" [tone]="tones[priority()]" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPriorityBadge {
  readonly priority = input.required<ClientPriority>();
  protected readonly tones: Record<ClientPriority, ClientBadgeTone> = {
    Baixa: 'low',
    Normal: 'normal',
    Alta: 'high',
    Crítica: 'critical',
  };
}
