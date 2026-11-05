import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClientStatus, CLIENT_STATUS_LABELS } from '../data/client-data';

@Component({
  selector: 'app-client-status',
  template: `<span
    class="inline-flex max-w-full rounded-status px-2.5 py-1 text-xs font-medium"
    [class]="
      status() === 'RESOLVIDO'
        ? 'bg-pri-bg text-pri-d'
        : status() === 'ENCERRADO'
          ? 'bg-grn-bg text-grn-t'
          : 'bg-bg text-ink2'
    "
    >{{ labels[status()] }}</span
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientStatusBadge {
  readonly status = input.required<ClientStatus>();
  protected readonly labels = CLIENT_STATUS_LABELS;
}
