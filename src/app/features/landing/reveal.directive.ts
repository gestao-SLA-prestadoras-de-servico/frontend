import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { motionMilliseconds } from './motion-timing';

/** Enhancement only: the server and browsers without WAAPI always show the content. */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  readonly appReveal = input(0, { transform: (value: unknown) => numberAttribute(value, 0) });
  readonly revealEffect = input<'group' | 'lines' | 'fade' | 'wipe' | 'left' | 'right'>('group');
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined' || typeof matchMedia === 'undefined') return;
      const element = this.element.nativeElement;
      if (typeof element.animate !== 'function') return;
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      if (motion.matches) return;
      const animations: Animation[] = [];
      const section = element.closest('section') ?? element;
      const css = getComputedStyle(element);
      const ease = css.getPropertyValue('--ease-out').trim() || 'ease-out';
      const milliseconds = (name: string, fallback: number) =>
        motionMilliseconds(css.getPropertyValue(name), fallback);
      const parts = (target: HTMLElement): HTMLElement[] => {
        const lines = [...target.querySelectorAll<HTMLElement>(':scope > .motion-line > span')];
        if (lines.length) return lines;
        return [...target.children].flatMap((child) => {
          const node = child as HTMLElement;
          if (node.getAttribute('aria-hidden') === 'true') return [];
          if (node.querySelector(':scope > h1, :scope > h2')) return parts(node);
          const headingLines = [
            ...node.querySelectorAll<HTMLElement>(':scope > .motion-line > span'),
          ];
          return headingLines.length ? headingLines : [node];
        });
      };
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          if (motion.matches || section.contains(document.activeElement)) return;
          const effect = this.revealEffect();
          const targets = effect === 'group' || effect === 'lines' ? parts(element) : [element];
          if (!targets.length) targets.push(element);
          try {
            targets.forEach((target, index) => {
              const line = target.parentElement?.classList.contains('motion-line');
              const frames: Keyframe[] =
                effect === 'wipe'
                  ? [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }]
                  : [
                      {
                        opacity: 0,
                        transform: line
                          ? 'translateY(105%)'
                          : effect === 'left'
                            ? 'translateX(-28px)'
                            : effect === 'right'
                              ? 'translateX(28px)'
                              : effect === 'fade'
                                ? 'none'
                                : 'translateY(24px)',
                      },
                      { opacity: 1, transform: 'none' },
                    ];
              animations.push(
                target.animate(frames, {
                  duration: milliseconds(
                    effect === 'wipe'
                      ? '--motion-image'
                      : line
                        ? '--motion-line'
                        : '--motion-reveal',
                    effect === 'wipe' ? 1100 : line ? 900 : 800,
                  ),
                  delay: Math.min(
                    280,
                    this.appReveal() * 70 + index * milliseconds('--motion-stagger', 70),
                  ),
                  easing:
                    effect === 'wipe' ? css.getPropertyValue('--ease-in-out').trim() || ease : ease,
                  fill: 'backwards',
                }),
              );
            });
          } catch {
            // Any unsupported animation leaves the original HTML fully visible.
            animations.forEach((animation) => animation.cancel());
          }
        },
        { threshold: 0, rootMargin: '0px 0px -10% 0px' },
      );
      const finish = () => {
        animations.forEach((animation) => animation.cancel());
        observer.disconnect();
      };
      const focus = () => finish();
      motion.addEventListener('change', finish);
      section.addEventListener('focusin', focus);
      observer.observe(element);
      this.destroyRef.onDestroy(() => {
        finish();
        motion.removeEventListener('change', finish);
        section.removeEventListener('focusin', focus);
      });
    });
  }
}
