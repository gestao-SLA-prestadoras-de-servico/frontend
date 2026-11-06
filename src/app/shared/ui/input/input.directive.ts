import { Directive } from '@angular/core';

@Directive({
  selector: 'input[appInput]',
  host: {
    class:
      'block h-[52px] w-full min-w-0 rounded-[10px] border border-ink3/80 bg-sf px-3.5 text-base text-ink placeholder:text-ink3 transition-[border-color,background-color] duration-150 enabled:hover:border-ink2 focus-visible:border-pri focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-pri aria-invalid:border-danger aria-invalid:focus-visible:outline-danger disabled:cursor-wait disabled:bg-bg disabled:text-ink2 motion-reduce:transition-none',
  },
})
export class Input {}
