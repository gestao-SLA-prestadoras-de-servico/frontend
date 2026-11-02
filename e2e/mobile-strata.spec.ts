import { expect, test, type Page } from '@playwright/test';

async function scroll(page: Page, top: number) {
  await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), top);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

async function geometry(page: Page) {
  return page.locator('.strata-stage').evaluate((stage) => {
    const bounds = stage.getBoundingClientRect();
    const rows = [...stage.querySelectorAll('.strata-row')].map((row) => {
      const box = row.getBoundingClientRect();
      const [left, right] = [...row.children].map((el) => el.getBoundingClientRect());
      return {
        top: box.top,
        bottom: box.bottom,
        leftStart: Math.max(left.left, box.left),
        leftEnd: Math.min(left.right, box.right),
        rightStart: Math.max(right.left, box.left),
        rightEnd: Math.min(right.right, box.right),
      };
    });
    const text = [
      ...stage.querySelectorAll('.strata-list h3,.strata-list p,.strata-list .level-badge'),
    ].map((el) => {
      const box = el.getBoundingClientRect();
      const readable = rows
        .filter((row) => row.bottom > box.top + 1 && row.top < box.bottom - 1)
        .every((row) => row.leftEnd <= box.left + 1 && row.rightStart >= box.right - 1);
      return { heading: el.tagName === 'H3', readable };
    });
    return { left: bounds.left, right: bounds.right, rows, text };
  });
}

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 767, height: 844 },
  { width: 844, height: 390 },
]) {
  test(`mobile strata fully cover the text, open to the edges and reverse at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const halves = page.locator('.strata-row [data-motion-active]');
    await expect(halves).toHaveCount(24);
    const stage = await page.locator('.strata-stage').evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.getBoundingClientRect().height,
    }));
    const closed = stage.top - viewport.height * 0.95 - 20;
    await scroll(page, closed);
    const initial = await geometry(page);
    for (const row of initial.rows) {
      expect(row.leftStart).toBeCloseTo(initial.left, 0);
      expect(row.rightEnd).toBeCloseTo(initial.right, 0);
      expect(row.leftEnd).toBeGreaterThanOrEqual(row.rightStart - 1);
    }
    for (const [index, heading] of (await page.locator('.strata-list h3').all()).entries()) {
      const top = await heading.evaluate((el) => el.getBoundingClientRect().top + scrollY);
      await scroll(page, top - viewport.height * 0.4);
      expect((await geometry(page)).text.filter((text) => text.heading)[index].readable).toBe(true);
    }
    await scroll(page, stage.top + stage.height - viewport.height * 0.5 + 20);
    const opened = await geometry(page);
    expect(opened.text.every((text) => text.readable)).toBe(true);
    for (const row of opened.rows) {
      expect(row.leftEnd).toBeLessThan(row.rightStart);
      expect(row.leftStart).toBeCloseTo(opened.left, 0);
      expect(row.rightEnd).toBeCloseTo(opened.right, 0);
    }
    await scroll(page, closed);
    const reversed = await geometry(page);
    for (const row of reversed.rows) expect(row.leftEnd).toBeGreaterThanOrEqual(row.rightStart - 1);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(halves).toHaveCount(0);
    expect((await geometry(page)).text.every((text) => text.readable)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
  });
}

test('mobile strata remain readable when animation APIs are unavailable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() =>
    Object.defineProperty(Element.prototype, 'animate', { value: undefined }),
  );
  await page.goto('/');
  expect((await geometry(page)).text.every((text) => text.readable)).toBe(true);
  await expect(page.locator('.strata-row [data-motion-active]')).toHaveCount(0);
  await expect(page.locator('.strata-list li')).toHaveCount(4);
});
