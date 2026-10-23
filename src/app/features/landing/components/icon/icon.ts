import { Component, input } from '@angular/core';
import {
  LucideDynamicIcon,
  LucideClock3,
  LucideCheck,
  LucideArrowUpRight,
  LucideFileText,
  LucideCamera,
  LucideHistory,
  LucideUsers,
  LucideMenu,
  LucideX,
  LucidePlus,
  LucidePaperclip,
  LucideShieldCheck,
  LucideTruck,
} from '@lucide/angular';

const icons = {
  clock: LucideClock3,
  check: LucideCheck,
  arrow: LucideArrowUpRight,
  file: LucideFileText,
  camera: LucideCamera,
  history: LucideHistory,
  users: LucideUsers,
  menu: LucideMenu,
  close: LucideX,
  plus: LucidePlus,
  paperclip: LucidePaperclip,
  shield: LucideShieldCheck,
  truck: LucideTruck,
} as const;
export type IconName = keyof typeof icons;

@Component({
  selector: 'app-icon',
  imports: [LucideDynamicIcon],
  template: `<svg
    [lucideIcon]="icons[name()]"
    [strokeWidth]="1.7"
    aria-hidden="true"
    focusable="false"
  ></svg>`,
  styles: `
    :host {
      display: inline-flex;
      width: 22px;
      height: 22px;
      flex: 0 0 auto;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly icons = icons;
}
