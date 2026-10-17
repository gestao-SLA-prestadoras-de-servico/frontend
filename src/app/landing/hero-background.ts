import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import type { ShaderInstance } from 'shaders/js';

@Component({
  selector: 'app-hero-background',
  template: `<img src="images/nivelo-refraction.png" width="1536" height="1024" alt="" fetchpriority="high" decoding="async" /><canvas #canvas [class.is-ready]="ready()" aria-hidden="true"></canvas>`,
  styles: `
    :host { position: absolute; inset: 0; overflow: hidden; pointer-events: none; background: #10243a; }
    img, canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    img { object-fit: cover; object-position: center 30%; }
    canvas { opacity: 0; mix-blend-mode: screen; mask-image: linear-gradient(#000 15%, transparent 86%); transition: opacity 1.2s ease-out; }
    canvas.is-ready { opacity: .34; }
    :host::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgb(4 16 38 / 3%) 22%, rgb(4 16 38 / 18%) 48%, #06162de8 100%); }
    @media (prefers-reduced-motion: reduce) { canvas { display: none; transition: none; } }
  `,
})
export class HeroBackground {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly destroyRef = inject(DestroyRef);
  protected readonly ready = signal(false);
  private instance?: ShaderInstance;
  private destroyed = false;
  private generation = 0;
  private visible = true;
  private initializing = false;

  constructor() {
    afterNextRender(() => this.mount());
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.generation++;
      this.instance?.destroy();
    });
  }

  private mount(): void {
    if (typeof matchMedia === 'undefined' || typeof IntersectionObserver === 'undefined' || typeof ResizeObserver === 'undefined') return;
    const canvas = this.canvas().nativeElement;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (motion.matches) {
        this.generation++;
        this.instance?.destroy();
        this.instance = undefined;
        this.ready.set(false);
      } else if (this.visible && document.visibilityState === 'visible') {
        if (this.instance) this.instance.resume();
        else void this.initialize();
      } else this.instance?.pause();
    };
    const visibility = new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; sync(); });
    visibility.observe(canvas);
    const resize = new ResizeObserver(() => this.resize());
    resize.observe(canvas.parentElement!);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    this.destroyRef.onDestroy(() => {
      visibility.disconnect();
      resize.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    });
    sync();
  }

  private async initialize(): Promise<void> {
    if (this.initializing || !('gpu' in navigator) || !navigator.gpu || this.destroyed) return;
    this.initializing = true;
    const generation = this.generation;
    try {
      // Import after hydration; this module is never evaluated on the server.
      const { createShader } = await import('shaders/js');
      if (this.destroyed || generation !== this.generation) return;
      const instance = await createShader(this.canvas().nativeElement, {
        components: [
          { id: 'swirl', type: 'Swirl', props: { colorA: '#10243A', colorB: '#2864DC', detail: 1.5, speed: 0.16 } },
          { id: 'flow', type: 'ChromaFlow', props: { baseColor: '#10243A', downColor: '#2864DC', leftColor: '#10243A', rightColor: '#2864DC', upColor: '#03CBD3', radius: 4, opacity: 0.7 } },
          { id: 'glass', type: 'FlutedGlass', props: { aberration: 0, angle: 0, frequency: 48, lightAngle: -90, refraction: 4, shape: 'rounded', softness: 1 } },
          { id: 'grain', type: 'FilmGrain', props: { strength: 0.06, animated: false } },
        ],
      }, {
        observeElement: false, disableTelemetry: true, enablePerformanceTracking: false,
        onReady: () => { if (!this.destroyed && generation === this.generation) this.ready.set(true); },
        onError: () => { if (!this.destroyed) this.ready.set(false); },
      });
      if (this.destroyed || generation !== this.generation) { instance.destroy(); return; }
      this.instance = instance;
      this.resize();
      if (!this.visible || document.visibilityState !== 'visible') instance.pause();
    } catch { if (!this.destroyed) this.ready.set(false); }
    finally {
      this.initializing = false;
      if (!this.destroyed && generation !== this.generation && !matchMedia('(prefers-reduced-motion: reduce)').matches && this.visible && document.visibilityState === 'visible') void this.initialize();
    }
  }

  private resize(): void {
    if (!this.instance) return;
    const canvas = this.canvas().nativeElement;
    const { width, height } = canvas.parentElement!.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const scale = Math.min(1, 1280 / (Math.max(width, 1) * dpr), 900 / (Math.max(height, 1) * dpr));
    this.instance.resize(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)));
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }
}
