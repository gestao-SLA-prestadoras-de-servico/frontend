import { expect, test } from '@playwright/test';

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
]) {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`history circle is complete and stays in the section flow at ${viewport.width}x${viewport.height}, ${reducedMotion}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const dial = page.locator('#historico .day-dial');
      await expect(dial).toHaveCSS('position', 'static');
      const top = await dial.evaluate((el) => el.getBoundingClientRect().top + scrollY);
      const scroll = async (y: number) => {
        await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            ),
        );
      };
      await scroll(top - 110);
      const before = await dial.boundingBox();
      await scroll(top + 90);
      const after = await dial.boundingBox();
      expect(before!.y - after!.y).toBeCloseTo(200, 0);
      const bounds = await dial.evaluate((el) => {
        const container = el.getBoundingClientRect();
        const svg = el.querySelector('svg')!.getBoundingClientRect();
        return {
          width: svg.width,
          height: svg.height,
          overflow: getComputedStyle(el).overflow,
          pathsInside: [...el.querySelectorAll('path')].every((path) => {
            const box = path.getBoundingClientRect();
            return (
              box.left >= container.left - 1 &&
              box.right <= container.right + 1 &&
              box.top >= container.top - 1 &&
              box.bottom <= container.bottom + 1
            );
          }),
        };
      });
      expect(bounds.height).toBeCloseTo(bounds.width, 0);
      expect(bounds.pathsInside).toBe(true);
      expect(bounds.overflow).toBe('visible');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    });
  }
}
