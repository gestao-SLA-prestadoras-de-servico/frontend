import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DemoTicket, ProfileKey } from '../../data/workspace-data';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TicketList {
  readonly tickets = input.required<readonly DemoTicket[]>();
  readonly profile = input.required<ProfileKey>();
  readonly heading = input('Chamados de exemplo');
  protected readonly statusClasses: Record<DemoTicket['status'], string> = {
    ABERTO: 'bg-bg text-ink2',
    ATRIBUIDO: 'bg-cyan/30 text-ink',
    EM_ATENDIMENTO: 'bg-bg text-ink2',
    RESOLVIDO: 'bg-grn-bg text-grn-t',
  };
}
