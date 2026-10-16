import { Component, input } from '@angular/core';

const paths = {
  clock: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', 'M12 6v6l4 3'],
  check: ['m5 12 4 4L19 6'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  file: [
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    'M14 2v6h6',
    'M8 13h8M8 17h5',
  ],
  camera: [
    'M14 4h-4L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z',
    'M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  ],
  history: ['M3 11a9 9 0 1 1 2.4 7', 'M3 4v7h7', 'M12 7v5l3 2'],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  close: ['m6 6 12 12M6 18 18 6'],
  plus: ['M12 5v14M5 12h14'],
  paperclip: ['m21 11-8 8a6 6 0 0 1-8.5-8.5l8-8a4 4 0 0 1 5.7 5.7l-8 8a2 2 0 0 1-2.9-2.9L15 6'],
  shield: ['M12 22s9-4 9-11V5l-9-3-9 3v6c0 7 9 11 9 11', 'm8 12 3 3 5-6'],
} as const;
export type IconName = keyof typeof paths;

@Component({
  selector: 'app-icon',
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    @for (path of paths[name()]; track $index) {
      <path [attr.d]="path" />
    }
  </svg>`,
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
  protected readonly paths = paths;
}
