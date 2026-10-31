import { expect, test } from '@playwright/test';

const scroll = async (page: import('@playwright/test').Page, top: number) => {
  await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), top);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
};

test('opening contours expand with scroll and restore their initial geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const core = page.locator('[data-scroll-motion="opening-band"]').last();
  await expect(core).toHaveAttribute('data-motion-active', '');
  const read = () => core.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
  await scroll(page, 0);
  const start = await read();
  await scroll(page, 350);
  await expect.poll(read).toBeGreaterThan(start + 1);
  await scroll(page, 0);
  await expect.poll(read).toBeCloseTo(start, 2);
});

test('the contour dial changes colour and the layered bands open reversibly', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const dial = page.locator('#historico [data-scroll-motion="dial"]').last();
  const history = await page
    .locator('#historico')
    .evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.getBoundingClientRect().height,
    }));
  await scroll(page, history.top - 600);
  const fill = await dial.evaluate((el) => getComputedStyle(el).fill);
  await scroll(page, history.top + history.height - 500);
  await expect.poll(() => dial.evaluate((el) => getComputedStyle(el).fill)).not.toBe(fill);
  const layer = page.locator('[data-scroll-motion="strata-left"]').first();
  const stage = await page
    .locator('.strata-stage')
    .evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.getBoundingClientRect().height,
    }));
  await scroll(page, stage.top - 800);
  const x = await layer.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).e);
  expect(x).toBeGreaterThan(100);
  await scroll(page, stage.top + stage.height - 500);
  await expect
    .poll(() => layer.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).e))
    .toBeCloseTo(0, 1);
  await scroll(page, stage.top - 800);
  await expect
    .poll(() => layer.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).e))
    .toBeCloseTo(x, 1);
});

test('all new scenes stay readable without their animation APIs', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Element.prototype, 'animate', { value: undefined });
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined });
  });
  await page.goto('/');
  await expect(page.locator('.poster-print')).toHaveCount(3);
  for (const id of [
    'inicio',
    'beneficios',
    'prazos',
    'historico',
    'evidencias',
    'como-funciona',
    'perfis',
    'plataforma',
    'contratos',
    'celular',
    'faq',
    'disponibilidade',
  ]) {
    await expect(
      page
        .locator('#' + id)
        .locator('h1,h2')
        .first(),
    ).toBeVisible();
  }
  await expect(page.locator('.strata-list li')).toHaveCount(4);
  await expect(page.locator('.strata-list li').last()).toContainText('cliente valida');
});
