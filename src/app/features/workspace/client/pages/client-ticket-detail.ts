import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { MissingPage } from '../../components/missing-page/missing-page';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ClientDeadlines } from '../components/client-deadlines';
import { ClientNotice } from '../components/client-notice';
import { ClientReview } from '../components/client-review';
import { ClientStatusBadge } from '../components/client-status';
import { ClientPriorityBadge } from '../components/client-priority';
import { clientTicketById } from '../data/client-data';

@Component({
  selector: 'app-client-ticket-detail',
  imports: [
    DatePipe,
    RouterLink,
    PageHeading,
    LucideDynamicIcon,
    ClientNotice,
    ClientStatusBadge,
    ClientPriorityBadge,
    ClientDeadlines,
    ClientReview,
    MissingPage,
  ],
  templateUrl: './client-ticket-detail.html',
  styleUrl: '../client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTicketDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly ticket = computed(() => clientTicketById(this.params().get('id')));
  protected readonly icons = WORKSPACE_ICONS;
}
