import { EventPhase } from '@angular/core/primitives/event-dispatch';

/** Native defaults cannot be cancelled after Angular replays an event captured during hydration. */
export function preventDefaultUnlessReplayed(event: Event): void {
  if (event.eventPhase !== EventPhase.REPLAY) event.preventDefault();
}
