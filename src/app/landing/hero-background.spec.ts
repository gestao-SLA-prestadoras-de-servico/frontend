import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HeroBackground } from './hero-background';

@Component({ imports: [HeroBackground], template: '<section class="hero"><app-hero-background /></section>' })
class HeroHarness {}

describe('HeroBackground video', () => {
  let fixture: ComponentFixture<HeroHarness>;
  let motion: EventTarget & { matches: boolean };
  let intersect: (visible: boolean) => void;
  let disconnect: ReturnType<typeof vi.fn>;
  let visibility: ReturnType<typeof vi.spyOn>;
  let play: ReturnType<typeof vi.spyOn>;
  let pause: ReturnType<typeof vi.spyOn>;
  let load: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    motion = Object.assign(new EventTarget(), { matches: false });
    disconnect = vi.fn();
    vi.stubGlobal('matchMedia', () => motion);
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        intersect = (visible) => callback([{ isIntersecting: visible }]);
      }
      observe() {}
      disconnect = disconnect;
    });
    visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  async function render() {
    fixture = TestBed.createComponent(HeroHarness);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('video') as HTMLVideoElement;
  }

  function paint(video: HTMLVideoElement) {
    video.dispatchEvent(new Event('playing'));
    fixture.detectChanges();
  }

  it('keeps the poster until visible, then starts a silent inline loop and reveals a playing frame', async () => {
    const video = await render();
    expect(video.hasAttribute('src')).toBe(false);
    expect(play).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('images/nivelo-hero-poster.webp');
    intersect(true);
    expect(video.getAttribute('src')).toBe('videos/nivelo-hero-loop.mp4');
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.controls).toBe(false);
    expect(play).toHaveBeenCalledOnce();
    expect(video.classList.contains('is-ready')).toBe(false);
    paint(video);
    expect(video.classList.contains('is-ready')).toBe(true);
  });

  it('avoids loading with reduced motion and restores the poster when that preference changes', async () => {
    motion.matches = true;
    const video = await render();
    intersect(true);
    expect(video.hasAttribute('src')).toBe(false);
    expect(play).not.toHaveBeenCalled();
    motion.matches = false;
    motion.dispatchEvent(new Event('change'));
    paint(video);
    expect(video.classList.contains('is-ready')).toBe(true);
    motion.matches = true;
    motion.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(video.classList.contains('is-ready')).toBe(false);
    expect(pause).toHaveBeenCalled();
  });

  it('pauses outside the hero and in hidden tabs, then resumes at the same position', async () => {
    const video = await render();
    intersect(true);
    video.currentTime = 3;
    pause.mockClear();
    intersect(false);
    expect(pause).toHaveBeenCalledOnce();
    intersect(true);
    expect(play).toHaveBeenCalledTimes(2);
    expect(video.currentTime).toBe(3);
    visibility.mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(pause).toHaveBeenCalledTimes(2);
    visibility.mockReturnValue('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(play).toHaveBeenCalledTimes(3);
    expect(video.currentTime).toBe(3);
  });

  it('keeps the poster on autoplay rejection and can retry when the hero returns', async () => {
    play.mockRejectedValueOnce(new DOMException('Autoplay denied', 'NotAllowedError'));
    const video = await render();
    intersect(true);
    await Promise.resolve();
    fixture.detectChanges();
    expect(video.classList.contains('is-ready')).toBe(false);
    intersect(false);
    intersect(true);
    paint(video);
    expect(video.classList.contains('is-ready')).toBe(true);
  });

  it('falls back to the poster after a media error', async () => {
    const video = await render();
    intersect(true);
    paint(video);
    video.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(video.classList.contains('is-ready')).toBe(false);
    intersect(false);
    intersect(true);
    expect(play).toHaveBeenCalledOnce();
  });

  it('disconnects observers, removes listeners and releases the video on destruction', async () => {
    const video = await render();
    intersect(true);
    fixture.destroy();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(video.hasAttribute('src')).toBe(false);
    expect(load).toHaveBeenCalledTimes(2);
    document.dispatchEvent(new Event('visibilitychange'));
    motion.dispatchEvent(new Event('change'));
    expect(play).toHaveBeenCalledOnce();
  });
});
