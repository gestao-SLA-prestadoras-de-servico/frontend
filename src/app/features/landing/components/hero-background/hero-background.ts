import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-hero-background',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pointer-events-none absolute inset-0 z-0 isolate overflow-hidden bg-navy',
    '[attr.data-video-state]': "ready() ? 'ready' : 'poster'",
  },
  templateUrl: './hero-background.html',
  styleUrl: './hero-background.css',
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

    const canPlay = () =>
      visible && document.visibilityState === 'visible' && !motion.matches && !disposed && !failed;
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
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(([entry]) => {
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
