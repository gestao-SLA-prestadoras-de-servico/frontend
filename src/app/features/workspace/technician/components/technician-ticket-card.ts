import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideClock3, LucideMapPin } from '@lucide/angular';
import { ButtonPrimary } from '@app/shared/ui/button';
import { TechnicianTicketBadges } from './technician-ticket-badges';
import { TechnicianTicket } from '../technician-data';

@Component({
  selector: 'app-technician-ticket-card',
  imports: [
    RouterLink,
    LucideArrowRight,
    LucideClock3,
    LucideMapPin,
    ButtonPrimary,
    TechnicianTicketBadges,
  ],
  templateUrl: './technician-ticket-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TechnicianTicketCard {
  readonly ticket = input.required<TechnicianTicket>();
}
