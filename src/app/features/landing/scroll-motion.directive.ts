import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injectable,
  input,
  NgZone,
} from '@angular/core';

export type ScrollEffect =
  | 'none'
  | 'hero'
  | 'photo'
  | 'contract'
  | 'platform'
  | 'phone'
  | 'history'
  | 'opening-band'
  | 'opening-figure'
  | 'opening-copy'
  | 'hang'
  | 'dial'
  | 'rings'
  | 'strata-left'
  | 'strata-right'
  | 'color-row'
  | 'date';

interface ScrollActor {
  element: HTMLElement;
  trigger: HTMLElement;
  effect: ScrollEffect;
  index: number;
  animation?: Animation;
  top: number;
  height: number;
  visible: boolean;
  lastTime?: number;
}

/** One passive scroll listener and one read/write batch for the visible actors. */
@Injectable({ providedIn: 'root' })
export class ScrollMotionDriver {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly actors = new Set<ScrollActor>();
  private observer?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private media?: MediaQueryList;
  private frame = 0;
  private measure = true;
  private mounted = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.unmount());
  }

  register(element: HTMLElement, effect: ScrollEffect, index = 0, trigger = ''): () => void {
    const actor: ScrollActor = {
      element,
      // The stationary frame supplies geometry; never measure the transformed image.
      trigger:
        (trigger ? element.closest<HTMLElement>(trigger) : null) ??
        element.parentElement ??
        element,
      effect,
      index,
      top: 0,
      height: 0,
      visible: false,
    };
    this.zone.runOutsideAngular(() => {
      this.actors.add(actor);
      if (!this.mounted) this.mount();
      this.observer?.observe(actor.trigger);
      this.createAnimation(actor);
      this.refresh();
    });
    return () => {
      actor.animation?.cancel();
      element.removeAttribute('data-motion-active');
      this.actors.delete(actor);
      if (![...this.actors].some((other) => other.trigger === actor.trigger))
        this.observer?.unobserve(actor.trigger);
      if (!this.actors.size) this.unmount();
    };
  }

  private readonly schedule = (): void => {
    if (!this.frame && this.mounted && !this.document.hidden)
      this.frame = requestAnimationFrame(this.draw);
  };

  private readonly refresh = (): void => {
    this.measure = true;
    this.schedule();
  };

  private readonly sync = (): void => {
    for (const actor of this.actors) this.createAnimation(actor);
    this.refresh();
  };

  private mount(): void {
    this.mounted = true;
    this.media = matchMedia('(prefers-reduced-motion: reduce)');
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const actor of this.actors) {
            if (entry.target === actor.trigger) actor.visible = entry.isIntersecting;
          }
        }
        this.refresh();
      },
      { rootMargin: '120px 0px' },
    );
    this.resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(this.refresh);
    this.resizeObserver?.observe(this.document.body);
    window.addEventListener('scroll', this.schedule, { passive: true });
    window.addEventListener('resize', this.sync, { passive: true });
    this.document.addEventListener('visibilitychange', this.refresh);
    this.media.addEventListener('change', this.sync);
    void this.document.fonts?.ready.then(() => {
      if (this.mounted) this.refresh();
    });
  }

  private createAnimation(actor: ScrollActor): void {
    actor.animation?.cancel();
    actor.animation = undefined;
    actor.lastTime = undefined;
    actor.element.removeAttribute('data-motion-active');
    if (this.media?.matches || actor.effect === 'none') return;
    const narrow = window.innerWidth < 768;
    // Small viewports keep the photo drift, but do not tilt product text or the phone.
    if (narrow && ['contract', 'platform', 'phone'].includes(actor.effect)) return;
    const transforms: Partial<Record<ScrollEffect, [string, string]>> = {
      hero: ['translateY(0) scale(1.06)', 'translateY(32px) scale(1.1)'],
      photo: [
        `translateY(${narrow ? 12 : 30}px) scale(1.12)`,
        `translateY(${narrow ? -12 : -30}px) scale(1.12)`,
      ],
      contract: [
        'perspective(1400px) translateY(44px) rotateY(-5deg) rotateZ(-1deg) scale(.96)',
        'perspective(1400px) translateY(0) rotateY(0) rotateZ(0) scale(1)',
      ],
      platform: [
        'perspective(1600px) translateY(64px) rotateX(5deg) rotateZ(1.5deg) scale(.96)',
        'perspective(1600px) translateY(0) rotateX(0) rotateZ(0) scale(1)',
      ],
      phone: ['translateY(42px) rotate(-3deg)', 'translateY(-18px) rotate(1deg)'],
      history: ['scaleY(0)', 'scaleY(1)'],
    };
    const depth = actor.index;
    let frames: Keyframe[];
    const pair = transforms[actor.effect];
    if (pair) frames = pair.map((transform) => ({ transform }));
    else if (actor.effect === 'opening-band') {
      const expanded = `scale(${1 + 17 * Math.pow(depth, 2.4)}) rotate(${-16 * depth}deg)`;
      frames = [
        { transform: 'scale(1) rotate(0)' },
        {
          transform: expanded,
          offset: 0.74,
        },
        { transform: expanded, offset: 0.779 },
        { transform: depth === 1 ? expanded : 'scale(1) rotate(0)', offset: 0.78 },
        { transform: depth === 1 ? expanded : 'scale(1) rotate(0)' },
      ];
    } else if (actor.effect === 'opening-figure') {
      frames = [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(20%,-36%) scale(.22)', opacity: 0, offset: 0.55 },
        { transform: 'translate(20%,-36%) scale(.22)', opacity: 0 },
      ];
    } else if (actor.effect === 'opening-copy') {
      frames = [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-12vh)', opacity: 0, offset: 0.38 },
        { transform: 'translateY(-12vh)', opacity: 0 },
      ];
    } else if (actor.effect === 'hang') {
      const sign = actor.index % 2 ? 1 : -1;
      frames = [
        { transform: `translateY(-70px) rotate(${3.2 * sign}deg)` },
        { transform: `translateY(-28px) rotate(${-1.8 * sign}deg)`, offset: 0.38 },
        { transform: `translateY(-8px) rotate(${0.8 * sign}deg)`, offset: 0.72 },
        { transform: 'translateY(0) rotate(0)' },
      ];
    } else if (actor.effect === 'dial') {
      frames = [
        {
          transform: `translate(${-130 * depth}px,${90 * depth}px)`,
          fill: `color-mix(in srgb, #2054bb ${depth * 100}%, #90e4f9)`,
        },
        {
          transform: 'translate(0,0)',
          fill: `color-mix(in srgb, #087a69 ${depth * 100}%, #b8eee6)`,
          offset: 0.5,
        },
        {
          transform: `translate(${130 * depth}px,${90 * depth}px)`,
          fill: `color-mix(in srgb, #10243a ${depth * 100}%, #a3c8fa)`,
        },
      ];
    } else if (actor.effect === 'rings') {
      frames = [
        { transform: 'scale(.86)', opacity: 0.15 },
        { transform: 'scale(1)', opacity: 1 },
      ];
    } else if (actor.effect === 'strata-left' || actor.effect === 'strata-right') {
      const distance = actor.trigger.clientWidth * 0.22 * (actor.effect === 'strata-left' ? 1 : -1);
      const start = Math.min(0.35, depth * 0.022);
      frames = [
        { transform: `translateX(${distance}px)` },
        { transform: `translateX(${distance}px)`, offset: start },
        { transform: 'translateX(0)', offset: Math.min(1, start + 0.65) },
        { transform: 'translateX(0)' },
      ];
    } else if (actor.effect === 'color-row') {
      frames = [
        { backgroundColor: '#10243a' },
        { backgroundColor: '#2054bb', offset: 0.5 },
        { backgroundColor: '#087a69' },
      ];
    } else {
      frames = [{ transform: 'translateY(24px)' }, { transform: 'translateY(-24px)' }];
    }
    try {
      actor.animation = actor.element.animate(frames, {
        duration: 1000,
        fill: 'both',
        easing: 'linear',
      });
      actor.animation.pause();
      // Settle immediately at the current scroll position (including restored anchors).
      actor.element.setAttribute('data-motion-active', '');
    } catch {
      actor.animation?.cancel();
      actor.animation = undefined;
    }
  }

  private readonly draw = (): void => {
    this.frame = 0;
    const scroll = window.scrollY;
    const viewport = window.innerHeight;
    if (this.measure) {
      // All layout reads happen before any animation time is changed.
      for (const actor of this.actors) {
        const rect = actor.trigger.getBoundingClientRect();
        actor.top = rect.top + scroll;
        actor.height = rect.height;
      }
      this.measure = false;
    }
    for (const actor of this.actors) {
      if (!actor.animation) continue;
      let start = actor.top - viewport;
      let end = actor.top + actor.height;
      if (actor.effect === 'hero') {
        start = actor.top;
        end = actor.top + actor.height;
      } else if (actor.effect === 'contract' || actor.effect === 'platform') {
        start = actor.top - viewport * 0.92;
        end = actor.top + actor.height * 0.35 - viewport * 0.5;
      } else if (actor.effect === 'history') {
        start = actor.top - viewport * 0.7;
        end = actor.top + actor.height - viewport * 0.45;
      } else if (actor.effect.startsWith('opening-')) {
        start = actor.top;
        end = actor.top + Math.max(viewport, actor.height - viewport);
      } else if (actor.effect === 'hang') {
        start = actor.top - viewport * 0.9;
        end = actor.top + Math.min(actor.height * 0.45, viewport * 0.4) - viewport * 0.35;
      } else if (actor.effect === 'dial') {
        start = actor.top - viewport * 0.3;
        end = actor.top + actor.height - viewport * 0.7;
      } else if (actor.effect.startsWith('strata-')) {
        start = actor.top - viewport * 0.78;
        end = actor.top + actor.height - viewport * 0.88;
      } else if (actor.effect === 'rings') {
        start = actor.top - viewport * 0.9;
        end = actor.top - viewport * 0.15;
      }
      // Firefox may report a fully masked frame as non-intersecting during its reveal.
      // Its stationary geometry still supplies the correct initial scroll position.
      const nearViewport =
        actor.top < scroll + viewport + 120 && actor.top + actor.height > scroll - 120;
      if (!actor.visible && !nearViewport && scroll > start && scroll < end) continue;
      const progress = Math.max(0, Math.min(1, (scroll - start) / Math.max(1, end - start)));
      const time =
        // Once the second panel covers the stage, drop the enlarged SVG geometry.
        // Keeping scaled SVG paths behind it can stall Firefox's refresh/scroll delivery.
        (actor.effect === 'opening-band' && progress >= 1) ||
        (actor.effect === 'opening-copy' && actor.element.contains(this.document.activeElement))
          ? 0
          : progress * 1000;
      if (actor.lastTime !== time) {
        actor.animation.currentTime = time;
        actor.lastTime = time;
      }
    }
  };

  private unmount(): void {
    if (!this.mounted) return;
    this.mounted = false;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    window.removeEventListener('scroll', this.schedule);
    window.removeEventListener('resize', this.sync);
    this.document.removeEventListener('visibilitychange', this.refresh);
    this.media?.removeEventListener('change', this.sync);
    for (const actor of this.actors) {
      actor.animation?.cancel();
      actor.element.removeAttribute('data-motion-active');
    }
  }
}

@Directive({
  selector: '[appScrollMotion]',
  host: { '[attr.data-scroll-motion]': 'appScrollMotion()' },
})
export class ScrollMotion {
  readonly appScrollMotion = input.required<ScrollEffect>();
  readonly motionIndex = input(0);
  readonly motionTrigger = input('');
  private readonly driver = inject(ScrollMotionDriver);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const element = this.element.nativeElement;
      if (
        typeof matchMedia === 'undefined' ||
        typeof IntersectionObserver === 'undefined' ||
        typeof element.animate !== 'function'
      )
        return;
      if (this.appScrollMotion() === 'none') return;
      const unregister = this.driver.register(
        element,
        this.appScrollMotion(),
        this.motionIndex(),
        this.motionTrigger(),
      );
      this.destroyRef.onDestroy(unregister);
    });
  }
}
