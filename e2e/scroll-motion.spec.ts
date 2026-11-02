import { expect, test } from '@playwright/test';

test('photo, product and history follow scrolling and return to their earlier position', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const photo = page.locator('[data-scroll-motion="photo"]').first();
  const section = photo.locator('..');
  const top = await section.evaluate((element) => element.getBoundingClientRect().top + scrollY);
  const scrollTo = async (y: number) => {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
  };
  await scrollTo(top - 700);
  await expect(photo).toHaveAttribute('data-motion-active', '');
  await expect
    .poll(() =>
      photo.evaluate(
        (element) =>
          element
            .parentElement!.getAnimations()
            .find(
              (animation) =>
                animation.effect instanceof KeyframeEffect &&
                animation.effect.getKeyframes().some((frame) => frame['clipPath']),
            )
            ?.effect?.getTiming().duration,
      ),
    )
    .toBe(1100);
  const first = await photo.evaluate((element) => getComputedStyle(element).transform);
  await scrollTo(top + 200);
  await expect
    .poll(() => photo.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(first);
  await scrollTo(top - 700);
  await expect
    .poll(() => photo.evaluate((element) => getComputedStyle(element).transform))
    .toBe(first);
  await expect(page.locator('[data-scroll-motion="platform"]')).toHaveAttribute(
    'data-motion-active',
    '',
  );
  const dial = page.locator('#historico [data-scroll-motion="dial"]').last();
  await expect(dial).toHaveAttribute('data-motion-active', '');
  expect(errors).toEqual([]);
});

test('text entrances run once and keyboard focus cancels any remaining entrance', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const calls: string[] = [];
    Object.defineProperty(window, '__headingEntrances', { value: calls });
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const heading = this.closest('h1, h2');
      if (heading) calls.push(heading.id);
      return animate.call(this, frames, options);
    };
  });
  await page.goto('/');
  const title = page.locator('#contracts-title');
  await title.scrollIntoViewIfNeeded();
  const count = () =>
    page.evaluate(
      () =>
        (window as unknown as { __headingEntrances: string[] }).__headingEntrances.filter(
          (id) => id === 'contracts-title',
        ).length,
    );
  await expect.poll(count).toBe(2);
  await page.locator('#inicio').scrollIntoViewIfNeeded();
  await title.scrollIntoViewIfNeeded();
  expect(await count()).toBe(2);
  const trigger = page.locator('#disponibilidade button');
  await trigger.focus();
  await expect(trigger).toBeFocused();
  expect(
    await page
      .locator('#disponibilidade')
      .evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .filter(
              (animation) =>
                animation.playState === 'running' && animation.constructor.name === 'Animation',
            ).length,
      ),
  ).toBe(0);
});

test('reduced motion cancels scroll effects immediately and a narrow viewport keeps the phone static', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const actors = page.locator('[data-scroll-motion]');
  await expect(page.locator('[data-scroll-motion="phone"]')).toHaveAttribute(
    'data-motion-active',
    '',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const actor of await actors.all()) {
    await expect(actor).not.toHaveAttribute('data-motion-active', '');
    await expect(actor).toHaveCSS('transform', 'none');
  }
  await expect(page.locator('.opening-person img')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('[data-scroll-motion="phone"]')).not.toHaveAttribute(
    'data-motion-active',
    '',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('missing animation APIs leave the same headings and images readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(Element.prototype, 'animate', { value: undefined });
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined });
  });
  await page.goto('/');
  for (const id of [
    'hero-title',
    'contracts-title',
    'platform-title',
    'evidence-section-title',
    'history-section-title',
    'mobile-title',
  ]) {
    const title = page.locator('#' + id);
    await expect(title).toBeVisible();
    await expect(title).toHaveCSS('opacity', '1');
  }
  await expect(page.locator('.record-photo').first()).toHaveCSS('clip-path', 'none');
  expect(errors).toEqual([]);
});
