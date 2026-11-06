import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { MissingPage } from '../components/missing-page/missing-page';
import { TicketList } from '../components/ticket-list/ticket-list';
import { profileByKey, ticketsFor } from '../data/workspace-data';
import { WORKSPACE_ICONS } from '../data/workspace-icons';

@Component({
  selector: 'app-workspace-page',
  imports: [
    RouterLink,
    LucideDynamicIcon,
    ButtonPrimary,
    ButtonSecondary,
    PageHeading,
    TicketList,
    MissingPage,
  ],
  templateUrl: './workspace-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class WorkspacePage {
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  protected readonly profile = computed(() => profileByKey(this.data()['profile']));
  protected readonly page = computed(() =>
    this.profile().pages.find((page) => page.key === this.data()['page']),
  );
  protected readonly tickets = computed(() => ticketsFor(this.profile().key));
  protected readonly open = computed(
    () => this.tickets().filter((ticket) => ticket.status === 'ABERTO').length,
  );
  protected readonly field = computed(
    () => this.tickets().filter((ticket) => ticket.status === 'EM_ATENDIMENTO').length,
  );
  protected readonly icons = WORKSPACE_ICONS;
}
