import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: 'h1[appPageHeading]',
  host: { tabindex: '-1', class: 'focus:outline-none' },
})
export class PageHeading {
  private readonly element = inject<ElementRef<HTMLHeadingElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const view = this.element.nativeElement.ownerDocument.defaultView;
      if (view && (view.scrollX !== 0 || view.scrollY !== 0)) {
        view.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      this.element.nativeElement.focus({ preventScroll: true });
    });
  }
}
