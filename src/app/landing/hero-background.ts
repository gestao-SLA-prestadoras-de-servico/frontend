import { afterNextRender, Component, DestroyRef, ElementRef, inject, NgZone, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-hero-background',
  host: { '[attr.data-video-state]': "ready() ? 'ready' : 'poster'" },
  template: `<img src="images/nivelo-hero-poster.webp" width="1280" height="720" alt="" fetchpriority="high" decoding="async" /><video #video muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true" [class.is-ready]="ready()"></video>`,
  styles: `
    :host { position: absolute; z-index: 0; inset: 0; overflow: hidden; isolation: isolate; pointer-events: none; background: var(--navy); }
    img, video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
    video { opacity: 0; transition: opacity .6s cubic-bezier(.16, 1, .3, 1); }
    video.is-ready { opacity: 1; }
    :host::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgb(4 16 38 / 3%) 22%, rgb(4 16 38 / 46%) 48%, #06162de8 100%); }
    @media (max-width: 900px) { :host::after { background: linear-gradient(180deg, rgb(4 16 38 / 3%) 12%, rgb(4 16 38 / 65%) 48%, #06162de8 100%); } }
    @media (max-width: 900px) and (max-height: 700px) { :host::after { background: linear-gradient(180deg, rgb(4 16 38 / 12%), rgb(4 16 38 / 65%) 22%, rgb(4 16 38 / 78%) 65%, #06162de8 100%); } }
    @media (prefers-reduced-motion: reduce) { video { display: none; transition: none; } }
  `,
})
export class HeroBackground {
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  protected readonly ready = signal(false);

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.mount()));
  }

  private mount(): void {
    if (typeof matchMedia === 'undefined') return;
    const video = this.video().nativeElement;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = typeof IntersectionObserver === 'undefined';
    let disposed = false;
    let failed = false;
    let generation = 0;
    video.muted = video.defaultMuted = true;

    const canPlay = () => visible && document.visibilityState === 'visible' && !motion.matches && !disposed && !failed;
    const sync = () => {
      const attempt = ++generation;
      if (!canPlay()) {
        video.pause();
        if (motion.matches) this.ready.set(false);
        return;
      }
      if (!video.hasAttribute('src')) {
        video.src = 'videos/nivelo-hero-loop.mp4';
        video.load();
      }
      void video.play().catch(() => {
        if (!disposed && attempt === generation) this.ready.set(false);
      });
    };
    const playing = () => {
      if (canPlay()) this.ready.set(true);
      else video.pause();
    };
    const error = () => {
      failed = true;
      generation++;
      video.pause();
      this.ready.set(false);
    };
    const observer = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    video.addEventListener('playing', playing);
    video.addEventListener('error', error);
    observer?.observe(video.parentElement!);
    sync();

    this.destroyRef.onDestroy(() => {
      disposed = true;
      generation++;
      observer?.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      video.removeEventListener('playing', playing);
      video.removeEventListener('error', error);
      video.pause();
      video.removeAttribute('src');
      video.load();
    });
  }
}
