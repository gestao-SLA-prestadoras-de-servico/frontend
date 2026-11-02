import { ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';
import {
  IntersectionObserverStub,
  MatchMediaStub,
  renderComponent,
  resetTestEnvironment,
  stubIntersectionObserver,
  stubMatchMedia,
} from '@testing/helpers';
import { HeroBackground } from './hero-background';

vi.setConfig({ testTimeout: 15_000 });

describe('HeroBackground video', () => {
  let fixture: ComponentFixture<HeroBackground>;
  let motion: MatchMediaStub;
  let intersection: IntersectionObserverStub;
  let visibility: ReturnType<typeof vi.spyOn>;
  let play: ReturnType<typeof vi.spyOn>;
  let pause: ReturnType<typeof vi.spyOn>;
  let load: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    motion = stubMatchMedia();
    intersection = stubIntersectionObserver();
    visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
  });

  afterEach(() => {
    fixture?.destroy();
    resetTestEnvironment();
  });

  async function render() {
    const rendered = await renderComponent(HeroBackground);
    fixture = rendered.fixture;
    return rendered.element.querySelector('video') as HTMLVideoElement;
  }

  const intersect = (visible: boolean) => intersection.trigger(visible);

  function paint(video: HTMLVideoElement) {
    video.dispatchEvent(new Event('playing'));
    fixture.detectChanges();
  }

  it('keeps the poster until visible, then starts a silent inline loop and reveals a playing frame', async () => {
    const video = await render();
    expect(video.hasAttribute('src')).toBe(false);
    expect(play).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe(
      'images/nivelo-hero-poster.webp',
    );
    intersect(true);
    expect(video.getAttribute('src')).toBe('videos/nivelo-hero-loop.mp4');
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.controls).toBe(false);
    expect(play).toHaveBeenCalledOnce();
    expect(video.parentElement?.getAttribute('data-video-state')).toBe('poster');
    paint(video);
    expect(video.parentElement?.getAttribute('data-video-state')).toBe('ready');
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
    expect(video.parentElement?.getAttribute('data-video-state')).toBe('ready');
    motion.matches = true;
    motion.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(video.parentElement?.getAttribute('data-video-state')).toBe('poster');
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
    expect(video.parentElement?.getAttribute('data-video-state')).toBe('poster');
    intersect(false);
    intersect(true);
    paint(video);
    expect(video.parentElement?.getAttribute('data-video-state')).toBe('ready');
  });

  it('falls back to the poster after a media error', async () => {
    const video = await render();
    intersect(true);
    paint(video);
    video.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(video.parentElement?.getAttribute('data-video-state')).toBe('poster');
    intersect(false);
    intersect(true);
    expect(play).toHaveBeenCalledOnce();
  });

  it('disconnects observers, removes listeners and releases the video on destruction', async () => {
    const video = await render();
    intersect(true);
    fixture.destroy();
    expect(intersection.disconnect).toHaveBeenCalledOnce();
    expect(video.hasAttribute('src')).toBe(false);
    expect(load).toHaveBeenCalledTimes(2);
    document.dispatchEvent(new Event('visibilitychange'));
    motion.dispatchEvent(new Event('change'));
    expect(play).toHaveBeenCalledOnce();
  });
});
