import { Directive, input } from '@angular/core';

export type ClientBadgeTone =
  | 'open'
  | 'assigned'
  | 'progress'
  | 'validation'
  | 'closed'
  | 'low'
  | 'normal'
  | 'high'
  | 'critical';

@Directive({
  selector: 'span[appClientBadge]',
  host: {
    class: 'client-badge',
    '[class.client-status--open]': "tone() === 'open'",
    '[class.client-status--assigned]': "tone() === 'assigned'",
    '[class.client-status--progress]': "tone() === 'progress'",
    '[class.client-status--validation]': "tone() === 'validation'",
    '[class.client-status--closed]': "tone() === 'closed'",
    '[class.client-priority--low]': "tone() === 'low'",
    '[class.client-priority--normal]': "tone() === 'normal'",
    '[class.client-priority--high]': "tone() === 'high'",
    '[class.client-priority--critical]': "tone() === 'critical'",
  },
})
export class ClientBadge {
  readonly tone = input.required<ClientBadgeTone>();
}
