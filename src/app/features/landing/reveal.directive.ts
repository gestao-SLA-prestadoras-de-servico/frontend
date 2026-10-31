import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

/** Enhancement only: the server and browsers without WAAPI always show the content. */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  readonly appReveal = input(0, { transform: (value: unknown) => numberAttribute(value, 0) });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined' || typeof matchMedia === 'undefined') return;
      const element = this.element.nativeElement;
      if (typeof element.animate !== 'function') return;
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      if (motion.matches) return;
      let animation: Animation | undefined;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          if (motion.matches || element.contains(document.activeElement)) return;
          animation = element.animate(
            [
              { opacity: 0, transform: 'translateY(20px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            {
              duration: 700,
              delay: this.appReveal() * 70,
              easing: getComputedStyle(element).getPropertyValue('--ease-out').trim() || 'ease-out',
              fill: 'backwards',
            },
          );
        },
        { threshold: 0.08 },
      );
      const finish = () => {
        animation?.cancel();
        observer.disconnect();
      };
      const focus = () => animation?.cancel();
      motion.addEventListener('change', finish);
      element.addEventListener('focusin', focus);
      observer.observe(element);
      this.destroyRef.onDestroy(() => {
        finish();
        motion.removeEventListener('change', finish);
        element.removeEventListener('focusin', focus);
      });
    });
  }
}
