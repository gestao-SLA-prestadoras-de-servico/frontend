import { expect, test } from '@playwright/test';

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 844, height: 390 },
]) {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`evidence cards keep the staircase and clear the preceding text at ${viewport.width}px, ${reducedMotion}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const rows = page.locator('#evidencias .record-row');
      const boxes = await rows.evaluateAll((elements) =>
        elements.map((element) => {
          const row = element.getBoundingClientRect();
          const photo = element.querySelector('.record-photo')!;
          return {
            left: row.left,
            right: row.right,
            width: row.width,
            photoWidth: parseFloat(getComputedStyle(photo).width),
          };
        }),
      );
      expect(boxes).toHaveLength(4);
      for (let i = 0; i < boxes.length; i++) {
        expect(boxes[i].photoWidth).toBeGreaterThan(110);
        expect(boxes[i].right).toBeCloseTo(boxes[0].right, 0);
        if (i) expect(boxes[i].left).toBeGreaterThan(boxes[i - 1].left);
      }
      if (viewport.width < 760) expect(boxes[3].photoWidth).toBeCloseTo(boxes[3].width, 0);
      for (const row of await rows.all()) {
        const top = await row.evaluate((element) => element.getBoundingClientRect().top + scrollY);
        await page.evaluate(
          (top) => scrollTo({ top, behavior: 'instant' }),
          top - viewport.height * 0.75,
        );
        await page.waitForTimeout(220);
        const clearance = await row.evaluate((element) => {
          const previous =
            element.previousElementSibling?.querySelector('.record-body p') ??
            document.querySelector('#evidencias .section-intro > p')!;
          const clip = element.querySelector<HTMLElement>('.print-clips i')!;
          const rope = getComputedStyle(clip, '::before');
          const ropeTop =
            clip.getBoundingClientRect().top +
            parseFloat(getComputedStyle(clip).height) -
            parseFloat(rope.bottom) -
            parseFloat(rope.height);
          return {
            gap: ropeTop - previous.getBoundingClientRect().bottom,
            height: parseFloat(rope.height),
          };
        });
        expect(clearance.height).toBeLessThanOrEqual(48);
        expect(clearance.gap).toBeGreaterThanOrEqual(12);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    });
  }
}
