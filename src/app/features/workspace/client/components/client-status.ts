import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClientBadge, ClientBadgeTone } from './client-badge';
import { ClientStatus, CLIENT_STATUS_LABELS } from '../data/client-data';

@Component({
  selector: 'app-client-status',
  imports: [ClientBadge],
  template: `<span appClientBadge [tone]="tones[status()]">{{ labels[status()] }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientStatusBadge {
  readonly status = input.required<ClientStatus>();
  protected readonly labels = CLIENT_STATUS_LABELS;
  protected readonly tones: Record<ClientStatus, ClientBadgeTone> = {
    ABERTO: 'open',
    ATRIBUIDO: 'assigned',
    EM_ATENDIMENTO: 'progress',
    RESOLVIDO: 'validation',
    ENCERRADO: 'closed',
  };
}
