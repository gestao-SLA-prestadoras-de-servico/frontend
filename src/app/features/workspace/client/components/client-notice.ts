import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CLIENT_SNAPSHOT } from '../data/client-data';

@Component({
  selector: 'app-client-notice',
  template: `<p class="text-xs leading-[1.7] text-ink3">
    Demonstração com dados fictícios · {{ snapshot }}. As ações não enviam nem salvam informações.
  </p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ClientNotice {
  protected readonly snapshot = CLIENT_SNAPSHOT;
}
